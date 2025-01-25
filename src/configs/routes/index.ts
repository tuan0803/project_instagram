import { Router } from 'express';
import PostRouter from '@controllers/Posts';
import upload from '@middlewares/upload';
const router = Router();

router.get('/posts/userId/:userId', PostRouter.getAllPosts);
router.post('/posts', PostRouter.create);
router.put('/posts/update/userId/:id', PostRouter.update);
router.delete('/posts/delete/:id', PostRouter.delete);

router.post('/upload', upload.single('image'), (req, res) => {
  const file = req.file;
  if (file) {
    console.log('File Buffer:', file.buffer);
    console.log('Original File Name:', file.originalname);
    res.send('File uploaded successfully');
  } else {
    res.status(400).send('No file uploaded');
  }
});

export default router;
