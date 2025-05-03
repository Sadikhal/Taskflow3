import mongoose from 'mongoose';

export const connected = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};