import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import aiRoutes from './api/ai';
import adminRoutes from './api/admin';
import artisansRoutes from './api/artisans';
import postsRoutes from './api/posts';
import connectDB from './db';

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/artisans', artisansRoutes);
app.use('/api/posts', postsRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Qala Server running on port ${PORT}`);
});
