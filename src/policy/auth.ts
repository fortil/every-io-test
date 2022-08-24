import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

export type RequestAndUser = Request & { user: User | null };

export const createToken = (user: User) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY as string;
  let data = {
    time: Date(),
    userId: user.id,
  };

  const token = jwt.sign(data, jwtSecretKey);
  return token;
};

export const validateToken = async (
  req: RequestAndUser,
  res: Response,
  next: NextFunction
) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY as string;
  let jwtSecretKey = process.env.JWT_SECRET_KEY as string;

  try {
    const token = req.header(tokenHeaderKey) as string;

    const verified = jwt.verify(token, jwtSecretKey);

    if (verified && typeof verified !== "string" && !!verified.userId) {
      const user = await User.findOne({ where: { id: verified.userId } });
      req.user = user;
      next();
    } else {
      return res
        .status(401)
        .json({ name: "Access Denied", message: "Access Denied" });
    }
  } catch (error) {
    return res.status(401).json(error);
  }
};
