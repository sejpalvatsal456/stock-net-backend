import mongoose from 'mongoose';

export const connectDB = async (uri, name) => {
    try {
        await mongoose.connect(uri, {
            dbName: name,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}