import { cloudinary } from 'cloudinary';
import { uploadImage } from '../../helpers/uploadHelper.js'; // Adjust the path to the actual path of your code
import { jest } from '@jest/globals';
import upload from '../../helpers/multerHelper.js';

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn(),
    },
  },
}));

describe('uploadImage', () => {
  test('should upload an image and return the result', async () => {
    // Arrange
    const imagePath = '/path/to/image.jpg';
    const expectedUrl = 'https://cloudinary.com/image.jpg';
    const expectedPublicId = 'public_id_123';

    // Mock the cloudinary.uploader.upload function
    cloudinary.v2.uploader.upload.mockResolvedValue({
      url: expectedUrl,
      public_id: expectedPublicId,
    });

    // Act
    const result = await uploadImage(imagePath);

    // Assert
    expect(result).toBeDefined();
    expect(result.url).toBe(expectedUrl);
    expect(result.public_id).toBe(expectedPublicId);
  });

  test('should handle error if upload fails', async () => {
    // Arrange
    const imagePath = '/path/to/image.jpg';
    const expectedError = new Error('Upload failed');
    cloudinary.uploader.upload.mockRejectedValue(expectedError);

    // Act
    try {
      await uploadImage(imagePath);
      // Assert
      // Fail the test if uploadImage does not throw an error
      fail('Expected uploadImage to throw an error');
    } catch (error) {
      // Assert
      expect(error).toBe(expectedError);
    }
  });
});
