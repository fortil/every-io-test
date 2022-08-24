import { Sequelize } from "sequelize";
import config, { nodeEnv } from "./config";

const { username, password, database, host, dialect } =
  config[process.env.NODE_ENV as nodeEnv];

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
});

export default sequelize;
