import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());


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

app.get("/", (req, res) => {
    res.send("API Server is Running")
})

app.get("*", (req, res) => {
    res.send("API not defined")
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});


app.listen(3000, () => {
    console.log('Server is listening at port 3000!!!');
});
  

// app.post('/server/auth/sign-up', (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   // Simulate user creation logic
//   console.log('Received user data:', { username, email, password });

//   // Respond with success
//   res.status(200).json({ message: 'User created successfully' });
// });
