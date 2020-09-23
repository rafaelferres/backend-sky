import { Router, NextFunction, Request, Response } from "express";
import { getConfig } from "./config";

import UserController from "./controllers/UserController";
import MiddlewareController from "./controllers/MiddlewareController";
import { IConfig } from "./interfaces";

const config: IConfig = getConfig();

const routes = Router();

routes.post(
  "/sign_up",
  (req: Request, res: Response, next: NextFunction) => MiddlewareController.checkSignUpData(req, res, next, config.jwt.secret),
  UserController.signUp
);

routes.post(
    "/sign_in",
    MiddlewareController.checkSignInData,
    (req: Request, res: Response) => UserController.signIn(req, res, config.jwt.secret)
)

routes.get(
    "/user/:user_id",
    MiddlewareController.verifyBearerToken,
    (req: Request, res: Response, next: NextFunction) => MiddlewareController.validateCredentials(req, res, next,config.jwt.secret),
    UserController.getUser
)

export default routes;
