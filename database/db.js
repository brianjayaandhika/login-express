import { Sequelize } from 'sequelize';
import dbConfig from '../config/dbConfig.js';
import movieModel from '../models/movieModel.js';

// Option 3: Passing parameters separately (other dialects)
const db = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, dbConfig.options);

export const movie = movieModel(db);

export default db;
