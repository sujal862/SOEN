import morgan from 'morgan';
import express from 'express';
import connect from './db/db.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

connect();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
 
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
} )

export default app;