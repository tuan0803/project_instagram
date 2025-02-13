import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import PostModel from '@models/posts';
import HashtagModel from '@models/hashtags';
import UserModel from '@models/users';

class PostController {
  public async create(req: Request, res: Response) {
    const userId = req.currentUser?.userId ?? 1;
    const text = typeof req.fields?.text === "string" ? req.fields.text : "";

    try {
      console.log("Text received:", text);

      const hashtagsList =  PostModel.extractHashtags(text);
      const taggedUserIds =  PostModel.extractTaggedUsers(text);

      console.log("Tagged Users:", taggedUserIds);

      const hashtags = await Promise.all(
        hashtagsList.map(async (tag) => {
          const [hashtag] = await HashtagModel.findOrCreate({
            where: { name: tag },
            defaults: { name: tag },
          });
          return hashtag;
        })
      );

      const taggedUsers = await UserModel.findAll({
        where: { id: taggedUserIds },
      });

      const newPost = await PostModel.create(
        {
          userId,
          text,
        },
        {
          include: [
            { model: HashtagModel, as: "hashtags" },
            { model: UserModel, as: "taggedUsers" },
          ],
        }
      );

      console.log("Created post:", newPost);
      return sendSuccess(res, newPost, "Post created successfully");
    } catch (error) {
      return sendError(res, 500, "Error creating post", error.message || error);
    }
  }
}

export default new PostController();
