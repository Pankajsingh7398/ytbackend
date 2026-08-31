import{v2 as claudinary} from'claudinary';
import fs, { unlink, unlinkSync }  from 'fs';
import { url } from 'inspector';

cloudinary.config({ 
  cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', 
  api_key: 'process.env.CLOUDINARY_API_KEY', 
  api_secret: 'process.env.CLOUDINARY_API_SECRET'
});


const uploadCloudinary = async(localfilePath) => {
  try {
    if (!localfilePath)  return null;
    const response = await cloudinary.v2.uploader.upload(localfilePath, {
      resource_type: "auto"
    });
    console.log("file is uploaded on claudinary", response.url);
    return response; 

  } catch (error) {
    fs.unlinkSync(localfilePath);
    return null;
  }
};
export { uploadOnCloudinary };
