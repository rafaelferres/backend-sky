import { Router, NextFunction, Request, Response } from "express";
import { getConfig } from "./config";

import UserController from "./controllers/UserController";
import { IConfig } from "./interfaces";

const config: IConfig = getConfig();

const routes = Router();

routes.post(
  "/sign_up",
  (req: Request, res: Response, next: NextFunction) => UserController.checkSignUpData(req, res, next, config.jwt.secret),
  UserController.signUp
);

routes.post(
    "/sign_in",
    UserController.checkSignInData,
    (req: Request, res: Response) => UserController.signIn(req, res, config.jwt.secret)
)

export default routes;
