import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import PostModel from '@models/posts';
import HashtagModel from '@models/hashtags';
import UserModel from '@models/users';
import sequelize from '@initializers/sequelize';

class PostController {
  public async create(req: Request, res: Response) {
    const userId = req.currentUser?.userId ?? 1;
    const text = typeof req.fields?.text === "string" ? req.fields.text : "";

    try {
      const hashtagsList = PostModel.extractHashtags(text);
      const taggedUserIds = PostModel.extractTaggedUsers(text);
      const transaction = await sequelize.transaction();

      const hashtags = await Promise.all(
        hashtagsList.map(async (tag) => {
          const [hashtag] = await HashtagModel.findOrCreate({
            where: { name: tag },
            defaults: { name: tag },
            transaction,
          });
          return hashtag;
        })
      );

      const taggedUsers = await UserModel.findAll({
        where: { id: taggedUserIds },
        transaction,
      });

      const newPost = await PostModel.create({ userId, text }, { transaction });

      if (hashtags.length > 0) {
        await newPost.setHashtags(hashtags, { transaction });
      }
      if (taggedUsers.length > 0) {
        await newPost.setTaggedUsers(taggedUsers, { transaction });
      }
      await transaction.commit();
      console.log("Created post:", newPost);
      return sendSuccess(res, newPost, "Post created successfully");
    } catch (error) {
      await transaction.rollback();
      return sendError(res, 500, "Error creating post", error.message || error);
    }
  }
}

export default new PostController();
