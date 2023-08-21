import express from 'express';
import responseHelpers from '../helpers/responseHelper.js';

const documentation = express.Router();

documentation.get('/', (req, res) => {
  const data = {
    movie: {
      addMovie: {
        Endpoint: '/movies',
        Method: 'POST',
        Request: {
          Headers: {
            accessToken: 'string',
          },
          Body: {
            title: 'string',
            year: 'number',
            genre: 'string',
            poster: 'file',
          },
        },
        Description: 'Add new movies. (Admin access required)',
      },

      getMovie: {
        Endpoint: '/movies',
        Method: 'GET',
        Request: {
          Headers: {
            accessToken: 'string',
          },
        },
        Description: 'Get all movies.',
      },

      getMovieByGenre: {
        Endpoint: '/movies/genre/:genre',
        Method: 'GET',
        Request: {
          Headers: {
            accessToken: 'string',
          },
        },
        Description: 'Get all movies by specific genre.',
      },

      getMovieByYear: {
        Endpoint: '/movies/year/:year',
        Method: 'GET',
        Request: {
          Headers: {
            accessToken: 'string',
          },
          Body: {
            timeClause: 'string {before|after}',
          },
        },
        Description: 'Retrieves a list of movies based on the specified year and filter.',
      },

      getMovieById: {
        Endpoint: '/movies/:id',
        Method: 'GET',
        Request: {
          Headers: {
            accessToken: 'string',
          },
        },
        Description: 'Retrieves detailed information about a specific movie by its ID.',
      },

      updateMovie: {
        Endpoint: '/movies/:id',
        Method: 'PUT',
        Request: {
          Headers: {
            accessToken: 'string',
          },
          Body: {
            title: 'string',
            year: 'number',
            genre: 'string',
          },
        },
        Description: 'Updates information about a specific movie by its ID. (Admin access required)',
      },

      deleteMovie: {
        Endpoint: '/movies/:id',
        Method: 'DELETE',
        Request: {
          Headers: {
            accessToken: 'string',
          },
        },
        Description: 'Deletes a specific movie from the database by its ID. (Admin access required)',
      },
    },

    user: {
      registerUser: {
        Endpoint: '/api/register',
        Method: 'POST',
        Request: {
          Body: {
            username: 'string',
            email: 'string',
            password: 'string',
            role: 'string',
          },
        },
        Description: 'Registers a new user and sends a verification email.',
      },

      loginUser: {
        Endpoint: '/api/login',
        Method: 'POST',
        Request: {
          Body: {
            username: 'string',
            password: 'string',
          },
        },
        Description: 'Logs in a user and generates an authentication token.',
      },

      changePassword: {
        Endpoint: '/api/change-password',
        Method: 'PUT',
        Request: {
          Body: {
            username: 'string',
            oldPassword: 'string',
            newPassword: 'string',
          },
        },
        Description: "Changes the user's password if the old password matches.",
      },

      forgotPassword: {
        Endpoint: '/api/forgot-password',
        Method: 'POST',
        Request: {
          Body: {
            email: 'string',
          },
        },
        Description: "Sends a password reset email to the user's email address.",
      },

      getProfile: {
        Endpoint: '/api/profile/:username',
        Method: 'GET',
        Description: 'Retrieves the profile information of a specific user. ',
      },

      getAllUser: {
        Endpoint: '/api/users',
        Method: 'GET',
        Description: 'Retrieves a list of all registered users. (Admin access required)',
      },

      updateRole: {
        Endpoint: '/api/users/:username/role',
        Method: 'PUT',
        Request: {
          Body: {
            role: 'string',
          },
        },
        Description: 'Updates the role of a specific user. (Admin access required)',
      },

      deleteUser: {
        Endpoint: '/api/users/:username',
        Method: 'DELETE',
        Description: 'Deletes a user from the system. (Admin access required)',
      },
    },
  };

  responseHelpers(res, 200, data, 'Get all APIs.');
});

export default documentation;
