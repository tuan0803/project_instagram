import { Request, Response } from 'express';
import HashtagsModel from '@models/hashtags';

class HashtagController {
  public async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Hashtag name is required' });
      }

      const existingHashtag = await HashtagsModel.findOne({ where: { name } });
      if (existingHashtag) {
        return res.status(409).json({ error: 'Hashtag already exists' });
      }

      const newHashtag = await HashtagsModel.create({ name });

      return res.status(201).json(newHashtag);
    } catch (error) {
      console.error('Error creating hashtag:', error);
      return res.status(500).json({ error: 'Server error while creating hashtag' });
    }
  }
}

export default new HashtagController();
