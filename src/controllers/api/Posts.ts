import { Request, Response } from 'express';
import PostModel from '@models/posts';
import HashtagModel from '@models/hashtags';
import { sendError, sendSuccess } from '@libs/response';
import { InternalError } from '@libs/errors';
import MediaModel from '@models/medias';
import MediaTagsModel from '@models/mediaTags';
import UserModel from '@models/users';
import PostTagUserModel from '@models/postTagUsers';
import multer from 'multer';
import FileUploaderService from '@services/fileUploader';
import PostHashtagModel from '@models/postHashtags';
import sequelize from '@initializers/sequelize';
const upload = multer({ storage: multer.memoryStorage() });


class PostController {
  public async index(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, userId } = req.query;
      const pageNumber = Number(page);
      const pageSize = Number(limit);

      const posts = await PostModel.scope(userId ? { method: ['byUser', userId ]} : {}).findAndCountAll({
        include: [
          { 
            model: PostHashtagModel,
            as: 'postHashtags',
            attributes: ['id'],
            include: [
              { 
                model: HashtagModel, 
                as: 'hashtag' 
              }
            ],
          },
          {
            model: MediaModel,
            as: 'media',
            include: [
              { 
                model: MediaTagsModel, 
                as: 'mediaTags', 
                attributes: ['id', 'x', 'y'], 
                include: [
                  { 
                    model: UserModel, 
                    as: 'user', 
                    attributes: ['id', 'name'] 
                  }
                ] 
              }  
            ],
          },
          {
            model: PostTagUserModel,
            as: 'taggedUsers',
            include: [
              { 
                model: UserModel, 
                as: 'user', 
                attributes: ['id', 'name'] 
              }
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        distinct: true,
      });

      sendSuccess(res, { 
        posts: posts.rows, 
        pagination: { 
          total: posts.count, 
          page, 
          limit, 
          totalPages: Math.ceil(posts.count / Number(limit)) 
        }
      });
      
    } catch (error) { 
      sendError(res, 500, InternalError, error.message);
    }
  }

  public async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await PostModel.findByPk(id, {
        include: [
          { 
            model: PostHashtagModel,
            as: 'postHashtags',
            attributes: ['id'],
            include: [
              { 
                model: HashtagModel, 
                as: 'hashtag' 
              }
            ],
          },
          {
            model: MediaModel,
            as: 'media',
            include: [
              { 
                model: MediaTagsModel, 
                as: 'mediaTags', 
                attributes: ['id', 'x', 'y'], 
                include: [
                  { 
                    model: UserModel, 
                    as: 'user', 
                    attributes: ['id', 'name'] 
                  }
                ] 
              }  
            ],
          },
          {
            model: PostTagUserModel,
            as: 'taggedUsers',
            include: [
              { 
                model: UserModel, 
                as: 'user', 
                attributes: ['id', 'name'] 
              }
            ],
          },
        ],
      });
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
        const post = await PostModel.findByPk(id, {
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
          transaction
        });
  
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
        const existingMedia = post.media.map(m => m.url);
        const mediaToAdd = validMediaItems.filter(m => !existingMedia.includes(m.url));
        const mediaToRemove = post.media.filter(m => !validMediaItems.some(n => n.url === m.url));
        if (mediaToRemove.length > 0) {
          for (const media of mediaToRemove) {
              await media.setMediaTags([]); 
              await media.destroy({ transaction }); 
          }
        }
        if (mediaToAdd.length > 0) {
          const newMedia = await MediaModel.bulkCreate(
            mediaToAdd.map(m => ({
              url: m.url,
              type: m.type,
              postId: post.id
            })), 
            { transaction }
          );
      
          for (const media of newMedia) {
            const matchingTags = parsedMediaTags.find(tag => tag.filename === media.url);
            if (matchingTags && matchingTags.mediaTags.length > 0) {
              const newTags = matchingTags.mediaTags.map(tag => ({
                mediaId: media.id,
                userId: tag.userId,
                x: tag.x,
                y: tag.y
              }));
              await MediaTagsModel.bulkCreate(newTags, { transaction });
            }
          }
        }
        await post.setMedia(await MediaModel.findAll({ where: { postId: post.id }, transaction }), { transaction });
        
        await transaction.commit();
  
        const updatedPost = await PostModel.findByPk(id, {
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
              attributes: ['id', 'name'],
              through: { attributes: [] },
            }
          ],
        });
  
        sendSuccess(res, { post: updatedPost });
      } catch (error) {
        await transaction.rollback();
        sendError(res, 500, 'Internal Error', error.message);
      }
    });
  };
  
}

export default new PostController();
