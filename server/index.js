import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
dotenv.config();

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log('Server is listening at port 3000!!!');
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

app.use("/client/user", userRouter);
app.use('/client/auth', authRouter);

