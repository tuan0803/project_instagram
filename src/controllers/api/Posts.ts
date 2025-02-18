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
const upload = multer({ storage: multer.memoryStorage() });


class PostController {
  public async index(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = Number(page);
      const pageSize = Number(limit);

      const posts = await PostModel.findAndCountAll({
        include: [
          { model: PostHashtagModel,
            as: 'postHashtags',
            include: [{ model: HashtagModel, as: 'hashtag' }],
          },
          {
            model: MediaModel,
            as: 'media',
            include: [{ model: MediaTagsModel, as: 'mediaTags' }],
          },
          {
            model: PostTagUserModel,
            as: 'taggedUsers',
            include: [{ model: UserModel, as: 'user' }],
          },
        ],
        order: [['createdAt', 'DESC']],
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
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
  public async create(req: Request, res: Response) {
    upload.array('file', 6)(req, res, async (err) => {
      try {
        const userId = req.currentUser.id;
        const { text, mediaTags = [] } = req.body;
        let mediaItems: any = [];
        const parsedMediaTags = Array.isArray(mediaTags) ? mediaTags : JSON.parse(mediaTags) || [];
        const filePaths = await Promise.all(
          (req.files as Express.Multer.File[]).map(async (file) => {
            const fileType = file.mimetype.toLowerCase(); 
            if (!(fileType.startsWith('image/') || fileType.startsWith('video/'))) {
              throw new Error(`Invalid file type: ${fileType}. Only images and videos are allowed.`);
            }
            const fileUrl = await FileUploaderService.singleUpload(file.buffer, file.originalname);
            return {
              originalname: file.originalname,
              mimetype: fileType,
              url: fileUrl, 
              type: fileType.startsWith('image/') ? 'image' : 'video',  
            };
          })
        );
        filePaths.forEach((filePath, index) => {
          if (!Array.isArray(parsedMediaTags)) {
            console.error("parsedMediaTags is not an array:", parsedMediaTags);
            return;
          }
          const matchedTags = parsedMediaTags.filter(tag => tag.index === index + 1);
          mediaItems.push({
            url: filePath.url,
            type: filePath.type,
            mediaTags: matchedTags, 
          });
        });
        const post = await PostModel.create(
          {
            text,
            userId,
            media: mediaItems.map(media => ({
              url: media.url,
              type: media.type,
              mediaTags: media.mediaTags,
            })),
          },
          {
            include: [
              { model: PostHashtagModel,
                as: 'postHashtags',
                include: [{ model: HashtagModel, as: 'hashtag' }],
              },
              {
                model: MediaModel,
                as: 'media',
                include: [{ model: MediaTagsModel, as: 'mediaTags' }],
              },
              {
                model: PostTagUserModel,
                as: 'taggedUsers',
                include: [{ model: UserModel, as: 'user' }],
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
}

export default new PostController();
