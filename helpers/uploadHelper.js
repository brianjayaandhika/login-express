import { v2 as cloudinary } from 'cloudinary';
export const uploadImage = async (imagePath) => {
  try {
    const options = {
      overwrite: true,
      resource_type: 'image',
      public_id: `image-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      folder: 'Movie_Poster',
    };

    const result = await cloudinary.uploader.upload(imagePath, options);
    return result;
  } catch (error) {
    console.error(error);
  }
};
