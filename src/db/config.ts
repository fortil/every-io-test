import { Dialect } from "sequelize";

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST as string;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD as string;

export type nodeEnv = "development" | "production" | "test";

export type TConfig = {
  [k in nodeEnv]: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
  };
};

const config: TConfig = {
  development: {
    username: dbUser,
    password: dbPassword,
    database: dbName,
    host: dbHost,
    dialect: dbDriver,
  },
  test: {
    username: dbUser,
    password: dbPassword,
    database: dbName,
    host: dbHost,
    dialect: dbDriver,
  },
  production: {
    username: dbUser,
    password: dbPassword,
    database: dbName,
    host: dbHost,
    dialect: dbDriver,
  },
};
module.exports = config;

export default config;
