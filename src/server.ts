import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import icvkRoutes from './routes/icvkRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/icvk', icvkRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log("Server running on port : ", PORT);
});
