import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.listen(3000, () => {
  console.log('Server is listening at port 5000!!!');
});

const connectDB = async () => {
    try 
    {
        await mongoose.connect(`${process.env.MONGO}`);
        console.log("Connected to MongoDB!");
        
    } catch (error) 
    {
        console.log(error);
    }
    
};

connectDB();
