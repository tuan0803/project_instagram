import { Request, Response } from 'express';
import PostModel from '@models/posts';
import HashtagModel from '@models/hashtags';
import { sendError, sendSuccess } from '@libs/response';
import { InternalError } from '@libs/errors';
import MediaModel from '@models/medias';
import MediaTagsModel from '@models/mediaTags';
import UserModel from '@models/users';
import multer from 'multer';
import FileUploaderService from '@services/fileUploader';
import sequelize from '@initializers/sequelize';
const upload = multer({ storage: multer.memoryStorage() });



class PostController {
  public async index(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, userId } = req.query;
      const pageNumber = Number(page);
      const pageSize = Number(limit);

      const scopes = [
        'withComponents',
        userId ? { method: ['byUser', userId] } : {}, 
      ];
      const total = await PostModel.count({
        distinct: true,
        col: 'PostModel.id',
      });
      const posts = await PostModel.scope(scopes).findAll({
        order: [['createdAt', 'DESC']],
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize
      });

      sendSuccess(res, { 
        posts, 
        pagination: {
          total,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (error) {
      sendError(res, 500, InternalError, error.message);
    }
  }
 
  public async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await PostModel.scope(['withComponents']).findByPk(id);
      sendSuccess(res, { post });
    } catch (error) {
      sendError(res, 500, InternalError, error.message);
    }
  }

  public async create(req: Request, res: Response) {
    upload.array('file', 6)(req, res, async (err) => {
      try {
        const userId = req.currentUser.id;
        const { text } = req.body;
        const parsedMediaTags = typeof req.body.mediaTags === 'string' 
            ? JSON.parse(req.body.mediaTags) 
            : req.body.mediaTags || [];
        const mediaItems = await Promise.all(
          (req.files as Express.Multer.File[]).map(async (file) => {
            try {
              const fileType = file.mimetype.toLowerCase();
              if (!(fileType.startsWith('image/') || fileType.startsWith('video/'))) {
                throw new Error(`Invalid file type: ${fileType}. Only images and videos are allowed.`);
              }
              const fileUrl = await FileUploaderService.singleUpload(file.buffer, file.originalname);
              const matchedTags = parsedMediaTags.filter(tag => tag.filename === file.originalname);
              return {
                url: fileUrl,
                type: fileType.startsWith('image/') ? 'image' : 'video',
                mediaTags: matchedTags.flatMap(tag =>
                  tag.mediaTags?.filter(t => t.userId && t.x !== undefined && t.y !== undefined) || []
                ) || [], 
              };
            } catch (error) {
              console.error("File upload error:", error);
              return null; 
            }
          })
        );
        const validMediaItems = mediaItems.filter(item => item !== null);
        const post = await PostModel.create(
          {
            text,
            userId,
            media: validMediaItems.map(media => ({
              url: media.url,
              type: media.type,
              mediaTags: media.mediaTags,
            })),
          },
          {
            include: [
              { 
                 model: HashtagModel, 
                 as: 'hashtags', 
                 through: { attributes: [] }
              },
              {
                model: MediaModel,
                as: 'media',
                include: [{ model: MediaTagsModel, as: 'mediaTags' }],
              },
              {
                model: UserModel,
                as: 'users',
                through: { attributes: [] },
              }
            ],
          }
        );        
        sendSuccess(res, { post });
      } catch (error) {
        sendError(res, 500, InternalError, error.message);
      }
    });
  } 

  public async update(req: Request, res: Response) {
    upload.array('file', 6)(req, res, async (err) => {
      const transaction = await sequelize.transaction();
      try {
        const userId = req.currentUser.id;
        const { id } = req.params;
        const { text } = req.body;
        const parsedMediaTags = typeof req.body.mediaTags === 'string' 
            ? JSON.parse(req.body.mediaTags) 
            : req.body.mediaTags || [];
        const post = await PostModel.scope('withComponents').findByPk(id, { transaction });
  
        if (!post) {
          await transaction.rollback();
          return sendError(res, 404, 'Post not found');
        }
        if (post.userId !== userId) {
          await transaction.rollback();
          return sendError(res, 403, 'Unauthorized');
        }
        const mediaItems = await Promise.all(
          (req.files as Express.Multer.File[]).map(async (file) => {
            try {
              const fileType = file.mimetype.toLowerCase();
              if (!(fileType.startsWith('image/') || fileType.startsWith('video/'))) {
                throw new Error(`Invalid file type: ${fileType}. Only images and videos are allowed.`);
              }
              const fileUrl = await FileUploaderService.singleUpload(file.buffer, file.originalname);
              const matchedTags = parsedMediaTags.filter(tag => tag.filename === file.originalname);
              return {
                url: fileUrl,
                type: fileType.startsWith('image/') ? 'image' : 'video',
                mediaTags: matchedTags.flatMap(tag =>
                  tag.mediaTags?.filter(t => t.userId && t.x !== undefined && t.y !== undefined) || []
                ) || [],
              };
            } catch (error) {
              console.error("File upload error:", error);
              return null;
            }
          })
        );
        const validMediaItems = mediaItems.filter(item => item !== null);
        await post.update({ text }, { transaction });
        await MediaModel.destroy({
          where: { postId: post.id },
          transaction
        });
        const newMediaArray = await MediaModel.bulkCreate(
          validMediaItems.map(m => ({
            url: m.url,
            type: m.type,
            postId: post.id,
          })),
          { returning: true, transaction }
        );
        const allTags = newMediaArray.flatMap((media, index) => 
          validMediaItems[index].mediaTags.map(tag => ({
            mediaId: media.id,
            userId: tag.userId,
            x: tag.x,
            y: tag.y,
          }))
        );
        if (allTags.length > 0) {
          await MediaTagsModel.bulkCreate(allTags, { transaction });
        }
        await transaction.commit();
        const updatedPost = await PostModel.scope('withComponents').findByPk(id);
  
        sendSuccess(res, { post: updatedPost });
      } catch (error) {
        await transaction.rollback();
        sendError(res, 500, 'Internal Error', error.message);
      }
    });
  };
  
  public async delete( req: Request, res: Response ) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.currentUser;
      const { postId } = req.params;
      const post = await PostModel.scope(['withComponents', { method: ['byId', postId]}, {method: ['byUser', id]}]).findOne();  

      await post.destroy({ transaction })
      await transaction.commit();
      sendSuccess(res, {}, 'Post deleted successfully');
    } catch (error) {
      sendError(res, 500, 'Internal Error', error.message);
    }
  }
}

export default new PostController();
