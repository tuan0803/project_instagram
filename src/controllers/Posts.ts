import { sendError, sendSuccess } from '@libs/response';
import PostModel from '@models/posts';
import MediaController from '@controllers/Medias';
import HashtagController from '@controllers/Hashtags';

class PostController {
  public async create(req: Request, res: Response) {
@@ -11,16 +12,21 @@ class PostController {
        return sendError(res, 400, 'Media is required to create post');
      } else {
        const userId = req.params.userId;
        const text = req.fields.text;
        const value = PostModel.CREATABLE.reduce((acc: any, field: string) => {
          if (field === 'userId') acc[field] = userId;
          if (field === 'text') acc[field] = text;
          return acc;
        }, {});
        const newPost = await PostModel.create(value);
        await MediaController.create(newPost.userId, newPost.id, mediaBuffer);
        const hashtags = text.match(/#[\w]+/g);
        if (hashtags.length > 0) {
          await HashtagController.create(newPost.id, hashtags);
        }
        return sendSuccess(res, newPost, 'Post created successfully');
      }
    } catch (error) {
      return sendError(res, 500, 'Error creating post', error.message || error);
    }