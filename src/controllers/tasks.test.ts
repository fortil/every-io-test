import "@babel/polyfill"; // support for async/await
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { Server } from "../server";
import { STATUS } from "../models/task";

let server: Server;
let requestWithSupertest: supertest.SuperTest<supertest.Test>;
let globalTask: any;

const dataLogUser = {
  email: faker.internet.email(),
  password: "testing",
  jwt: "",
};

beforeAll(async () => {
  server = new Server();
  await server.initDatabase();
  requestWithSupertest = supertest(server.app);
  const res = await requestWithSupertest
    .post("/users")
    .set("Content-type", "application/json")
    .send(dataLogUser);
  dataLogUser.jwt = res.body.jwt;
  console.log(dataLogUser);
});
afterAll(() => {
  server.close();
});

describe("Tasks", () => {
  describe("Error authentication", () => {
    test("GET /tasks should be return an error 400", async () => {
      const res = await requestWithSupertest.get("/tasks");
      expect(res.status).toEqual(401);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toMatchObject({
        name: "JsonWebTokenError",
        message: "jwt must be provided",
      });
    });
  });

  describe("Creating task", () => {
    test("POST /tasks should be return an error 400", async () => {
      const dataTask = { title: "testing", status: "not status" };

      const res = await requestWithSupertest
        .post("/tasks")
        .set("Content-type", "application/json")
        .set("accessToken", dataLogUser.jwt)
        .send(dataTask);
      expect(res.status).toEqual(400);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toMatchObject({
        message: "missing value",
      });
    });

    test("POST /tasks should be return an error 400", async () => {
      const dataTask = {
        title: "testing",
        description: "short description",
        status: "not status",
      };

      const res = await requestWithSupertest
        .post("/tasks")
        .set("Content-type", "application/json")
        .set("accessToken", dataLogUser.jwt)
        .send(dataTask);
      expect(res.status).toEqual(400);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toMatchObject({
        message:
          "Status should be one of those values (TO_DO, IN_PROGRESS, DONE, ARCHIVE)",
      });
    });

    test("POST /tasks should be return a new task", async () => {
      const dataTask = {
        title: "testing task",
        description: "description for testing task",
        status: STATUS["TO_DO"],
      };

      const res = await requestWithSupertest
        .post("/tasks")
        .set("Content-type", "application/json")
        .set("accessToken", dataLogUser.jwt)
        .send(dataTask);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toMatchObject(dataTask);
      globalTask = res.body;
    });
  });

  describe("Chaning status task", () => {
    test("POST /tasks should be return a new TO_DO task", async () => {
      const dataTask = {
        title: "testing task 2",
        description: "description for testing task 2",
        status: STATUS["TO_DO"],
      };

      const res = await requestWithSupertest
        .post("/tasks")
        .set("Content-type", "application/json")
        .set("accessToken", dataLogUser.jwt)
        .send(dataTask);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toMatchObject(dataTask);
      globalTask = res.body;
    });

    test("POST /tasks/:taskid should be return status IN_PROGRESS", async () => {
      const res = await requestWithSupertest
        .post(`/tasks/${globalTask.id}`)
        .set("Content-type", "application/json")
        .set("accessToken", dataLogUser.jwt)
        .send({ status: STATUS["IN_PROGRESS"] });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toMatchObject({
        status: STATUS["IN_PROGRESS"],
      });
    });

    test("POST /tasks/:taskid should be return status ARCHIVE", async () => {
      const res = await requestWithSupertest
        .post(`/tasks/${globalTask.id}`)
        .set("Content-type", "application/json")
        .set("accessToken", dataLogUser.jwt)
        .send({ status: STATUS["ARCHIVE"] });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toMatchObject({
        status: STATUS["ARCHIVE"],
      });
    });

    test("POST /tasks/:taskid should be return status DONE", async () => {
      const res = await requestWithSupertest
        .post(`/tasks/${globalTask.id}`)
        .set("Content-type", "application/json")
        .set("accessToken", dataLogUser.jwt)
        .send({ status: STATUS["DONE"] });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toMatchObject({
        status: STATUS["DONE"],
      });
    });
  });

  describe("Get all tasks", () => {
    test("GET /tasks should return more than 1 tasks", async () => {
      const res = await requestWithSupertest
        .get("/tasks")
        .set("accessToken", dataLogUser.jwt);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body.length).toBeGreaterThan(1);
    });
  });
});
