import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: false,
}));

app.use(express.json());

app.use('/api', authRoutes);           
app.use('/api/admin', adminRoutes);    
app.use('/api/store', storeRoutes);    
app.use('/api', ratingRoutes);         
app.use('/api/users', userRoutes);        

app.get('/', (req, res) => {
  res.send('Store Rating Backend API is running ✅');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
 