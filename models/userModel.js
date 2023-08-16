import { DataTypes } from 'sequelize';

const userModel = (sequelize) =>
  sequelize.define('users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      default: 'user',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  });

export default userModel;
