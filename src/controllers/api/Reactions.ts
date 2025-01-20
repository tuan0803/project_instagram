import ReactionsModel from '@models/reactions';
import ReactionInterface from '@interfaces/reactions';

class ReactionController {
  public static async handleReactions (postId: number, reactions: ReactionInterface[] | undefined) {
    if (reactions && reactions.length > 0) {
      const reactionPromises = reactions.map(async (reaction) => {
        const [reactionRecord] = await ReactionsModel.findOrCreate({
          where: { postId: postId, userId: reaction.userId, type: reaction.type },
          defaults: { postId: postId, userId: reaction.userId, type: reaction.type },
        });
        return reactionRecord;
      });
      await Promise.all(reactionPromises);
    }
  }
}

export default ReactionController;
