import { Request, Response } from 'express';
import PostModel from '@models/posts';
import HashtagModel from '@models/hashtags';
import { sendError, sendSuccess } from '@libs/response';
import { InternalError } from '@libs/errors';
import UserModel from '@models/users';
import FileUploaderService from '@services/fileUploader';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
import MediaModel from '@models/medias';
import MediaTagsModel from '@models/mediaTags';



class PostController {
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
}

export default new PostController();
