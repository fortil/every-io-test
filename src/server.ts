import * as http from "http";
import express, {
  Express,
  Application,
  Request,
  Response,
  NextFunction,
} from "express";
import { registerRoutes } from "./lib/decorators";
import sequelize from "./db/";

export class Server {
  private readonly _app: Application;

  get app(): Application {
    return this._app;
  }

  private _server!: http.Server;

  get server(): http.Server {
    return this._server;
  }

  constructor() {
    this._app = express();

    this._app.set("port", process.env.PORT || 8080);

    this.configureMiddleware();
  }

  async initDatabase(): Promise<any> {
    return sequelize.sync();
  }

  public async configureMiddleware() {
    // Required for POST requests
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));

    // CORS
    this.app.use(function (req: Request, res: Response, next: NextFunction) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
      );
      next();
    });
    await registerRoutes(this._app as Express);
  }

  public start() {
    this._server = this._app.listen(this._app.get("port"), () => {
      console.log("🚀 Server is running on port " + this._app.get("port"));
    });
  }

  public async close() {
    try {
      sequelize.close();
      this._server?.close();
    } catch (error) {
      console.log("+", error);
    }
  }
}
