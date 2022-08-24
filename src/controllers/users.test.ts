import "@babel/polyfill"; // support for async/await
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { Server } from "../server";

let server: Server;
let requestWithSupertest: supertest.SuperTest<supertest.Test>;

const dataLogUser = { email: faker.internet.email(), password: "testing" };

beforeAll(async () => {
  server = new Server();
  await server.initDatabase();
  requestWithSupertest = supertest(server.app);
});
afterAll(() => {
  server.close();
});

describe("Users", () => {
  describe("Creating user", () => {
    test("POST /users should be return an error 400", async () => {
      const dataUser = { password: "testing" };

      const res = await requestWithSupertest
        .post("/users")
        .set("Content-type", "application/json")
        .send(dataUser);
      expect(res.status).toEqual(400);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toMatchObject({
        message: "missing value",
      });
    });

    test("POST /users should be return a new user", async () => {
      const res = await requestWithSupertest
        .post("/users")
        .set("Content-type", "application/json")
        .send(dataLogUser);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toMatchObject({
        email: dataLogUser.email,
        jwt: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
  describe("Login user", () => {
    test("POST /users/login should be return a log user", async () => {
      const res = await requestWithSupertest
        .post("/users/login")
        .set("Content-type", "application/json")
        .send(dataLogUser);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toMatchObject({
        email: dataLogUser.email,
        jwt: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
