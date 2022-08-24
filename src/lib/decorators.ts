import * as express from "express";
import { readdirSync } from "fs";
import { basename, extname, join, relative } from "path";

export type HttpMethods = "get" | "post" | "options";

const ROOT_ROUTE = "ROOT_ROUTE";
const PATH_ROUTE = "PATH_ROUTE";
const HTTP_METHOD = "HTTP_METHOD";
const MIDDLEWARE = "MIDDLEWARE";
const startsWithForwardSlashRegExp = /^\//;

/**
 * Class decorator used to define the router's mounting point.
 * @param rootRoute - router's mounting point (as known from Express: `app.use('/mountingpoint', router)`).
 */
export function Root(rootRoute: string) {
  return function (target: any) {
    target[ROOT_ROUTE] = rootRoute;
  };
}

const path =
  (method: HttpMethods, pathRoute: string | RegExp, middlewares?: any[]) =>
  (target: any, propertyKey: string) => {
    target[propertyKey][PATH_ROUTE] = pathRoute;
    target[propertyKey][HTTP_METHOD] = method;
    if (middlewares) {
      target[propertyKey][MIDDLEWARE] = middlewares;
    }
  };

export function Post(pathRoute: string | RegExp, middlewares?: any[]) {
  return path("post", pathRoute, middlewares);
}

export function Get(pathRoute: string | RegExp, middlewares?: any[]) {
  return path("get", pathRoute, middlewares);
}

/**
 * Attaches the router controllers to the main express application instance.
 * @param app - express application instance (result of call to `express()`)
 * @param controllers - controller classes (rest parameter) decorated with @Root and @Path/@Use
 */
export function bindControllers(
  app: express.Express,
  ...controllers: Function[]
) {
  for (const Clazz of controllers) {
    const router: any = express.Router();
    const instance = new (<any>Clazz)();

    const rootRoute = (Clazz as any)[ROOT_ROUTE];
    if (!rootRoute || !startsWithForwardSlashRegExp.test(rootRoute)) {
      throw new Error(
        "Class-level '@Root' decorator must be used with single string argument starting with forward slash (eg. '/' or '/myRoot')!"
      );
    }

    // @Path
    const pathRouteMethods = getClassMethodsByDecoratedProperty(
      Clazz,
      PATH_ROUTE
    );
    pathRouteMethods.forEach((pathRouteMethod) => {
      const {
        PATH_ROUTE,
        HTTP_METHOD,
        MIDDLEWARE = [],
      } = instance[pathRouteMethod];

      router[HTTP_METHOD](
        PATH_ROUTE,
        MIDDLEWARE,
        instance[pathRouteMethod].bind(instance)
      );
    });

    app.use(rootRoute, router);
  }
}

/**
 * Recursively (taking into account super classes) find names of the methods, that were decorated with given property, in a class.
 * @param clazz - target class
 * @param decoratedPropertyName - name of the property known to be added by decorator, eg. 'ROOT_ROUTE'
 * @param foundMethodsNames - array of methods names found (useful when concatenating results of recursive search through superclasses)
 */
function getClassMethodsByDecoratedProperty(
  clazz: any,
  decoratedPropertyName: string,
  foundMethodsNames: string[] = []
): string[] {
  const clazzMethods = foundMethodsNames.concat(
    Object.getOwnPropertyNames(clazz.prototype)
      .filter((functionName) => functionName !== "constructor")
      .filter(
        (functionName) =>
          clazz.prototype[functionName][decoratedPropertyName] !== undefined
      )
  );

  const parentClazz = Object.getPrototypeOf(clazz);
  if (parentClazz.name !== "") {
    return getClassMethodsByDecoratedProperty(
      parentClazz,
      decoratedPropertyName,
      clazzMethods
    );
  }
  // returns an array of *unique* method names
  return clazzMethods.filter(
    (methodName, index, array) => array.indexOf(methodName) === index
  );
}

export async function registerRoutes(app: express.Express): Promise<void> {
  const controllerDir = join(__dirname, "../controllers");
  const files = readdirSync(controllerDir);

  const modules = files
    .filter((file) => /\w+Ctrl/.test(file))
    .map((file) =>
      relative(__dirname, join(controllerDir, basename(file, extname(file))))
    );
  for (const module of modules) {
    const Module = await import(module);
    bindControllers(app, Module.default);
  }
}
