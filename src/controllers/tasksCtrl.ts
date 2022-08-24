import { Request, Response } from "express";
import { Get, Post, Root } from "../lib/decorators";
import Task from "../models/task";
import { validateToken, RequestAndUser } from "../policy/auth";

@Root("/tasks")
class TaskController {
  @Get("/", [validateToken])
  async getAllTasks(req: RequestAndUser, res: Response) {
    const tasks = await req.user?.getTasks();
    return res.json(tasks);
  }

  @Post("/", [validateToken])
  async create(req: RequestAndUser, res: Response) {
    if (!req?.body?.title || !req?.body?.description || !req?.body?.status) {
      return res.status(400).json({ message: "missing value" });
    }
    try {
      const taskInstance = await req.user?.createTask(req.body);
      return res.json(taskInstance);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Post("/:taskid", [validateToken])
  async update(req: RequestAndUser, res: Response) {
    if (!req?.params?.taskid || !req?.body?.status) {
      return res.status(400).json({ message: "missing value" });
    }

    try {
      const [updated, tasks] = await Task.update(req.body, {
        where: { id: req.params.taskid },
        returning: true,
      });
      return res.json(tasks[0]);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default TaskController;
