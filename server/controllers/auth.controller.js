import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const userByUsername = await User.findOne({ username }).exec();
        if (userByUsername) {
            return res.status(400).json("Username already taken - please try another");
        }

        const userByEmail = await User.findOne({ email }).exec();
        if (userByEmail) {
            return res.status(400).json("Email already in use - please try another");
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json("User created successfully!");
    } catch (error) {
        next(error);
    }
};
