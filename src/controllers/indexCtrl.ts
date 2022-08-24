import { Request, Response } from "express";
import { Get, Root } from "../lib/decorators";

@Root("/")
class IndexController {
  @Get("/")
  async helloWorld(_: Request, res: Response) {
    res.json({ message: "hello world" });
  }
}

export default IndexController;
