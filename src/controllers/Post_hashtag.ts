import PostHashtagsModel from '@models/post_hashtags'; // Đảm bảo đường dẫn import chính xác
class PosthashtagController {
    public async create(postId: number, hashtagId: number) {
        try {
            const result = await PostHashtagsModel.create({ postId, hashtagId });
        } catch (error) {
            console.error('Error in PosthashtagController.create:', error);
        }
    }
}
export default new PosthashtagController();