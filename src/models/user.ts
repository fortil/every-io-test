import crypto from "crypto";
import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../db/";
import Task from "./task";

export type UserAttributes = {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "createdAt" | "updatedAt"
>;

const PROTECTED_ATTRIBUTES = ["password", "id"];

export const encryptPwd = (pwd: string): string =>
  crypto.createHash("sha256").update(pwd).digest("hex");

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare email: string;
  declare password: string;
  declare jwt: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare addTask: HasManyAddAssociationMixin<Task, number>;
  declare createTask: HasManyCreateAssociationMixin<Task, "ownerId">;
  declare getTasks: HasManyGetAssociationsMixin<Task>;
  declare static associations: {
    tasks: Association<User, Task>;
  };
  toJSON() {
    let attributes = Object.assign({}, this.get());
    for (let a of PROTECTED_ATTRIBUTES) {
      delete (attributes as any)[a];
    }
    return attributes;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
  }
);

User.beforeCreate((user) => {
  user.password = encryptPwd(user.password);
});

User.hasMany(Task, {
  sourceKey: "id",
  foreignKey: "ownerId",
  as: "tasks",
});

export default User;
