import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// Start the server
const PORT: number = 5000;
app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});
