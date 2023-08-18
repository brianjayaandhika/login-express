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
      defaultValue: 'user',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

export default userModel;
