import fs from "fs";
import * as path from "path";
import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../db/config";

const db: any = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

export default db;
