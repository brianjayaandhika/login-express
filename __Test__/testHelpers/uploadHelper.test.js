import { v2 as cloudinary } from 'cloudinary';
import { uploadImage } from '../../helpers/uploadHelper.js'; // Adjust the path to the actual path of your code
import { jest } from '@jest/globals';

jest.mock('cloudinary');

describe('uploadImage', () => {
  it('should upload an image successfully', async () => {
    // Set up mock behavior for cloudinary.uploader.upload
    cloudinary.uploader.upload.mockResolvedValue({
      public_id: 'public_id',
      secure_url: 'secure_url',
    });

    const imagePath = '/path/to/image.jpg';
    const result = await uploadImage(imagePath);

    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
      imagePath,
      expect.objectContaining({
        overwrite: true,
        resource_type: 'image',
        folder: 'Movie_Poster',
      })
    );
    expect(result).toEqual({
      public_id: 'public_id',
      secure_url: 'secure_url',
    });
  });

  it('should handle upload error', async () => {
    // Set up mock behavior for cloudinary.uploader.upload
    cloudinary.uploader.upload.mockRejectedValue(new Error('Upload Error'));

    const imagePath = '/path/to/image.jpg';
    const result = await uploadImage(imagePath);

    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(imagePath, expect.any(Object));
    expect(result).toBeUndefined(); // Expect the result to be undefined in case of error
  });
});
