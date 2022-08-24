import {
  CreateOptions,
  DataTypes,
  ForeignKey,
  Model,
  Optional,
  UpdateOptions,
} from "sequelize";
import sequelize from "../db/";
import User from "./user";

export enum STATUS {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  ARCHIVE = "ARCHIVE",
}

type TaskAttributes = {
  id: number;
  title: string;
  description: string;
  status: keyof typeof STATUS;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
};

type TaskCreationAttributes = Optional<
  TaskAttributes,
  "id" | "status" | "createdAt" | "updatedAt"
>;

class Task extends Model<TaskAttributes, TaskCreationAttributes> {
  declare id: number;
  declare title: string;
  declare description: string;
  declare status: keyof typeof STATUS;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare ownerId: ForeignKey<User["id"]>;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM({ values: Object.keys(STATUS) }),
      defaultValue: STATUS["TO_DO"],
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize }
);

Task.beforeValidate("status", (task) => {
  if (!Object.keys(STATUS).includes(task.status)) {
    throw new Error(
      `Status should be one of those values (${Object.keys(STATUS).join(", ")})`
    );
  }
});

export default Task;
