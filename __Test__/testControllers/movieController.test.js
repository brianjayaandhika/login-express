import movieController from '../../controllers/movieController.js';
import { movie } from '../../database/db.js';
import { Op } from 'sequelize';
import { uploadImage } from '../../helpers/uploadHelper.js';
import responseHelper from '../../helpers/responseHelper.js';

jest.mock('../../helpers/uploadHelper.js'); // Mock uploadImage function

jest.mock('../../database/db.js', () => {
  return {
    movie: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
  };
});

jest.mock('../../helpers/responseHelper.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('movieController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addMovie', () => {
    it('should add a movie successfully', async () => {
      const req = {
        body: {
          title: 'Movie Title',
          year: 2023,
          genre: 'Action',
        },
        file: {
          path: 'imagePath',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      uploadImage.mockResolvedValue({
        public_id: 'public_id',
        secure_url: 'secure_url',
      });

      movie.create.mockResolvedValue({});

      await movieController.addMovie(req, res);

      expect(uploadImage).toHaveBeenCalledWith('imagePath');
      expect(movie.create).toHaveBeenCalledWith({
        title: 'Movie Title',
        year: 2023,
        genre: 'Action',
        poster: 'secure_url',
        posterId: 'public_id',
      });
      expect(responseHelper).toHaveBeenCalledWith(res, 200, {}, 'Add Movie Success');
    });

    it('should respond with 400 if required fields are missing', async () => {
      const req = {
        body: {
          title: 'Movie Title',
          year: 2023,
        },
        file: {
          path: 'imagePath',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await movieController.addMovie(req, res);

      expect(uploadImage).not.toHaveBeenCalled();
      expect(movie.create).not.toHaveBeenCalled();
      expect(responseHelper).toHaveBeenCalledWith(res, 400, null, 'Add Movie Failed');
    });

    it('should respond with 500 on internal server error', async () => {
      const req = {
        body: {
          title: 'Movie Title',
          year: 2023,
          genre: 'Action',
        },
        file: {
          path: 'imagePath',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      uploadImage.mockRejectedValue(new Error('Upload Error'));

      await movieController.addMovie(req, res);

      expect(uploadImage).toHaveBeenCalledWith('imagePath');
      expect(movie.create).not.toHaveBeenCalled();
      expect(responseHelper).toHaveBeenCalledWith(res, 500, null, 'Internal Server Error');
    });
  });

  describe('getMovie', () => {
    it('should retrieve a list of movies successfully', async () => {
      const moviesMock = [
        { title: 'Movie 1', year: 2021, genre: 'Action' },
        { title: 'Movie 2', year: 2022, genre: 'Comedy' },
      ];

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findAll.mockResolvedValue(moviesMock);

      await movieController.getMovie(req, res);

      expect(movie.findAll).toHaveBeenCalled();
      expect(responseHelper).toHaveBeenCalledWith(res, 200, moviesMock, 'Get Movies Success');
    });

    it('should respond with 500 on internal server error', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findAll.mockRejectedValue(new Error('Database Error'));

      await movieController.getMovie(req, res);

      expect(movie.findAll).toHaveBeenCalled();
      expect(responseHelper).toHaveBeenCalledWith(res, 500, null, 'Internal Server Error');
    });
  });

  describe('getMovieByGenre', () => {
    it('should retrieve movies by genre successfully', async () => {
      const moviesMock = [
        { title: 'Movie 1', genre: 'Action' },
        { title: 'Movie 2', genre: 'Action' },
      ];

      const req = {
        params: {
          genre: 'action',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findAll.mockResolvedValue(moviesMock);

      await movieController.getMovieByGenre(req, res);

      expect(movie.findAll).toHaveBeenCalledWith({
        attributes: ['title', 'genre'],
        where: {
          genre: 'action',
        },
      });
      expect(responseHelper).toHaveBeenCalledWith(res, 200, moviesMock, 'Get Movies By Genre Success');
    });

    it('should respond with 404 if no movies found', async () => {
      const req = {
        params: {
          genre: 'action',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findAll.mockResolvedValue([]);

      await movieController.getMovieByGenre(req, res);

      expect(movie.findAll).toHaveBeenCalledWith({
        attributes: ['title', 'genre'],
        where: {
          genre: 'action',
        },
      });
      expect(responseHelper).toHaveBeenCalledWith(res, 404, null, 'No movies found');
    });

    it('should respond with 500 on internal server error', async () => {
      const req = {
        params: {
          genre: 'action',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findAll.mockRejectedValue(new Error('Database Error'));

      await movieController.getMovieByGenre(req, res);

      expect(movie.findAll).toHaveBeenCalledWith({
        attributes: ['title', 'genre'],
        where: {
          genre: 'action',
        },
      });
      expect(responseHelper).toHaveBeenCalledWith(res, 500, null, 'Internal Server Error');
    });
  });

  describe('getMovieByYear', () => {
    it('should retrieve movies by year successfully', async () => {
      const moviesMock = [
        { title: 'Movie 1', year: 2021 },
        { title: 'Movie 2', year: 2022 },
      ];

      const req = {
        params: {
          year: 2022,
        },
        body: {
          timeClause: 'before',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findAll.mockResolvedValue(moviesMock);

      await movieController.getMovieByYear(req, res);

      expect(movie.findAll).toHaveBeenCalledWith({
        attributes: ['title', 'year'],
        where: {
          year: { [Op.lte]: 2022 },
        },
      });
      expect(responseHelper).toHaveBeenCalledWith(res, 200, moviesMock, 'Get Movies By Year Success');
    });

    it('should respond with 500 on internal server error', async () => {
      const req = {
        params: {
          year: 2022,
        },
        body: {
          timeClause: 'before',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findAll.mockRejectedValue(new Error('Database Error'));

      await movieController.getMovieByYear(req, res);

      expect(movie.findAll).toHaveBeenCalledWith({
        attributes: ['title', 'year'],
        where: {
          year: { [Op.lte]: 2022 },
        },
      });
      expect(responseHelper).toHaveBeenCalledWith(res, 500, null, 'Internal Server Error');
    });
  });

  describe('getMovieById', () => {
    it('should retrieve a movie by ID successfully', async () => {
      const selectedMovieMock = { title: 'Movie 1', year: 2021 };

      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findByPk.mockResolvedValue(selectedMovieMock);

      await movieController.getMovieById(req, res);

      expect(movie.findByPk).toHaveBeenCalledWith(1);
      expect(responseHelper).toHaveBeenCalledWith(res, 200, selectedMovieMock, 'Get Movie By Id Success');
    });

    it('should respond with 404 if movie not found', async () => {
      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findByPk.mockResolvedValue(null);

      await movieController.getMovieById(req, res);

      expect(movie.findByPk).toHaveBeenCalledWith(1);
      expect(responseHelper).toHaveBeenCalledWith(res, 404, null, 'API not found');
    });

    it('should respond with 500 on internal server error', async () => {
      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findByPk.mockRejectedValue(new Error('Database Error'));

      await movieController.getMovieById(req, res);

      expect(movie.findByPk).toHaveBeenCalledWith(1);
      expect(responseHelper).toHaveBeenCalledWith(res, 500, null, 'Internal Server Error');
    });
  });

  describe('updateMovie', () => {
    it('should update a movie successfully', async () => {
      const req = {
        params: {
          id: 'movieId',
        },
        body: {
          title: 'New Title',
          year: 2022,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const selectedMovie = {
        update: jest.fn(),
      };

      movie.findByPk = jest.fn().mockResolvedValueOnce(selectedMovie);

      await movieController.updateMovie(req, res);

      expect(movie.findByPk).toHaveBeenCalledWith('movieId');
      expect(selectedMovie.update).toHaveBeenCalledWith(req.body);
      expect(responseHelper).toHaveBeenCalledWith(res, 200, selectedMovie, 'Update Movie Success');
    });

    it('should respond with 404 if movie not found', async () => {
      const req = {
        params: {
          id: 'movieId',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findByPk = jest.fn().mockResolvedValueOnce(null);

      await movieController.updateMovie(req, res);

      expect(movie.findByPk).toHaveBeenCalledWith('movieId');
      expect(responseHelper).toHaveBeenCalledWith(res, 404, null, 'API not found');
    });

    it('should respond with 500 on internal server error', async () => {
      const req = {
        params: {
          id: 'movieId',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      movie.findByPk.mockRejectedValue(new Error('Database Error'));

      await movieController.updateMovie(req, res);

      expect(movie.findByPk).toHaveBeenCalledWith('movieId');
      expect(responseHelper).toHaveBeenCalledWith(res, 500, null, 'Internal Server Error');
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie successfully', async () => {
      const selectedMovieMock = { id: 1, title: 'Movie 1', destroy: jest.fn() };

      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the behavior of the movie model
      movie.findByPk.mockResolvedValue(selectedMovieMock);
      selectedMovieMock.destroy.mockResolvedValue(); // Indicates successful deletion

      await movieController.deleteMovie(req, res);

      expect(movie.findByPk).toHaveBeenCalledWith(1);
      expect(selectedMovieMock.destroy).toHaveBeenCalled();
      expect(responseHelper).toHaveBeenCalledWith(res, 200, null, 'Delete Movie Success');
    });

    it('should respond with 404 if movie not found for deletion', async () => {
      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the behavior of the movie model to return null (not found)
      movie.findByPk.mockResolvedValue(null);

      await movieController.deleteMovie(req, res);

      expect(movie.findByPk).toHaveBeenCalledWith(1);
      expect(responseHelper).toHaveBeenCalledWith(res, 404, null, 'API not found');
    });

    it('should respond with 500 on internal server error', async () => {
      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the behavior of the movie model to throw an error
      movie.findByPk.mockRejectedValue(new Error('Database Error'));

      await movieController.deleteMovie(req, res);

      expect(movie.findByPk).toHaveBeenCalledWith(1);
      expect(responseHelper).toHaveBeenCalledWith(res, 500, null, 'Internal Server Error');
    });

    // Add additional test cases here
  });
});
