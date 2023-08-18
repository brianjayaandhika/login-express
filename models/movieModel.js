import { DataTypes } from 'sequelize';

const movieModel = (sequelize) =>
  sequelize.define('movies', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    posterId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

export default movieModel;
