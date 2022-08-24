import { Request, Response } from "express";
import { Get, Post, Root } from "../lib/decorators";
import User, { encryptPwd, UserAttributes } from "../models/user";
import { createToken } from "../policy/auth";

@Root("/users")
class UserController {
  @Post("/login")
  async login(req: Request, res: Response) {
    if (!req?.body?.email || !req?.body?.password) {
      return res.status(400).json({ message: "missing value" });
    }
    const userInstance = await User.findOne({
      where: { email: req.body.email, password: encryptPwd(req.body.password) },
    });
    if (userInstance) {
      const user = userInstance.toJSON() as UserAttributes & { jwt: string };
      user.jwt = createToken(userInstance);
      return res.json(user);
    }
    return res.json({});
  }

  @Post("/")
  async create(req: Request, res: Response) {
    if (!req?.body?.email || !req?.body?.password) {
      return res.status(400).json({ message: "missing value" });
    }
    const userInstance = await User.create(req.body);
    const user = userInstance.toJSON() as UserAttributes & { jwt: string };
    user.jwt = createToken(userInstance);

    return res.json(user);
  }
}

export default UserController;
