import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true,
        },

        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video",
            },
        ],

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true, 
        },

        avatar: {
            type: String,
            required: true,
        },

        coverImage: {
            type: String,
        },

        password: {
            type: String,
            required: [true, 'password is required']
        },

        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};



userSchema.methods.generateAccessToken = function () {
    jwt.sign({
id: this.id,
email: this.email,
username: this.username,
fullName: this.fullName, 
    });
};
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
}


userSchema.methods.generateRefreshToken = function () {
    jwt.sign({
id: this.id,
    });
};
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
}
    
 

export const User = mongoose.model("User", userSchema);