import PostModel from '@models/posts';
import { PostCreationAttributes } from '@interfaces/posts';
import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';

class PostService {
    public async getAllPosts(userId: number, page: number, limit: number) {
        try {
            if (!userId || isNaN(Number(userId)) || userId >= 1) {
                throw new Error('Invalid userId'); //userId can duoc truyen tu nguoi dang dung
            }
            const offset = (page - 1) * limit;
            const posts = await PostModel.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
            if (posts.length === 0) {
                throw new Error('Không có bài viết nào!');
            }

            return posts;
        } catch (error) {
            throw new Error('Lỗi khi lấy danh sách bài viết');
        }
    }

    public async create(userId: number, text: string) {
        try {
            const newPost = await PostModel.create({
                userId,
                text,
            } as PostCreationAttributes);

            return newPost;
        } catch (error) {
            throw new Error('Lỗi khi tạo bài viết');
        }
    }

    public async update(postId: number, text: string) { //Error: bad content-type header, unknown content-type: text/plain
        try {
            const post = await PostModel.findByPk(postId);
            if (!post) {
                throw new Error('Bài viết không tồn tại');
            }
            post.text = text;
            await post.save();

            return post;
        } catch (error) {
            throw new Error('Lỗi khi cập nhật bài viết');
        }
    }

    public async delete(postId: number) {
        try {
            const post = await PostModel.findByPk(postId);
            if (!post) {
                throw new Error('Bài viết không tồn tại');
            }
            await post.destroy();
        } catch (error) {
            throw new Error('Lỗi khi xóa bài viết');
        }
    }
}

export default new PostService();