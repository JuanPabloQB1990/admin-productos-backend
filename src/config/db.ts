import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();

// Cargamos el .env correspondiente antes de inicializar
console.log(process.env.DATABASE_URL);

const DATABASE_URL_MYSQL = process.env.NODE_ENV === "test" ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL

const db = new Sequelize(DATABASE_URL_MYSQL!, {
  dialect: 'mysql',
  models: [__dirname + "/../models/**/*"],
  logging: false,
});

export default db;
