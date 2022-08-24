import { Express } from "express";
import { bindControllers } from "express-router-decorators";
import { readdirSync } from "fs";
import { basename, extname, join, relative } from "path";

export async function registerRoutes(app: Express): Promise<void> {
  const controllerDir = join(__dirname, "../controllers");
  const files = readdirSync(controllerDir);

  const modules = files.map((file) =>
    relative(__dirname, join(controllerDir, basename(file, extname(file))))
  );
  for (const module of modules) {
    const Module = await import(module);
    bindControllers(app, Module.default);
  }
}
