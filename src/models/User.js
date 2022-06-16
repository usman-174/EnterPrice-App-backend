import mongoose from "mongoose";
import validator from 'validator';
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            maxLength: [30, "Username cannot exceed 30 characters"],
            required: [true, "Please enter Username."],
        },
        email: {
            type: String,
            required: [true, "Please enter your email."],
            unique: [true,"Email already in use."],
            validate: [validator.isEmail, 'Please enter a valid Email.']
        },
        password: {
            type: String,
            minlength: [6, 'Password length must be longer than 6 characters.'],
            select: false
        },
        role: {
            type: String,
            default: 'user',
            enum: {
                values: [
                    "admin",
                    "user",

                ], message: "Please select the correct role.",
            }
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        }
    
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
