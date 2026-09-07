import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
//refreshtoken method
const generateRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken; 
        await user.save({validateBeforeSave:false});
        return{accessToken,refreshToken}
 
        
    }catch(err){
        throw new ApiError(500,"refresh token genratin failed")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user registration details from request body
    const { fullName, username, email, password } = req.body;
    console.log("Received user registration details:", { fullName, username, email });

    // 2. Validate that all required fields are provided
    if ([fullName, username, email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check whether a user already exists with the given username or email
    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // 4. Check if an avatar image is provided
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || req.files?.coverimage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    // 5. Upload the avatar image (and optional cover image) to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverimage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "Avatar is required");
    }

    // 6. Create the user object and save it to the database
    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverimage?.url || "",
    });

    // 7. Verify that the user was successfully created (exclude password & refreshToken)
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User registration failed");
    }

    // 8. Return a success response with the newly created user
    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});
const login =asyncHandler(async (req,res)=>{
//req body access data.
const {email,password,username}=req.body;
if(!email||!username){
    throw new ApiError(400,"Email and password are required")
}
//user by username or email and find user
const user =await User.findOne({
    $or:[email,username]
})
if(!user){
    throw new ApiError(404,"User not found")
}
//check password
const isPasswordValid = await user.isPasswordCorrect(password)
if(!isPasswordValid){
    throw new ApiError(401,"invalid user credential")
}
//access and refresh token
const {accessToken,refreshToken}=await generateRefreshToken(user._id)
//send cookies
const loggedInUser= await user.findById(user_id).
select("-password -refreshToken")
const options={
    httpOnly:true,
    secure:true
}
return res
   .status(200)
   .cookie("asccessToken",accessToken,options)
   .cookie("RefreshToken",refreshToken,options)
   .json(
      new ApiResponse(200,{
        user:loggedin,accessToken,refreshToken},
        "user logged in successfully"))

});

  




export { registerUser
    ,login
 };