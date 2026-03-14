import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

dotenv.config();
const app = express();
app.use(express.json());

console.log(process.env.MONGODB_URI);
await connectDB(process.env.MONGODB_URI, process.env.MONGODB_NAME);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);
});