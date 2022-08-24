import "@babel/polyfill"; // support for async/await
import supertest from "supertest";
import { Server } from "./server";

let server: Server;
let requestWithSupertest: supertest.SuperTest<supertest.Test>;

describe("TEST", () => {
  beforeAll(async () => {
    server = new Server();
    await server.initDatabase();
    requestWithSupertest = supertest(server.app);
  });
  afterAll(() => {
    server.close();
  });

  test("GET / should be return hello world", async () => {
    const res = await requestWithSupertest.get("/");
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toEqual({ version: "0.0.1" });
  });
});
