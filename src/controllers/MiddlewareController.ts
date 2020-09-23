import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import signInDTO from "../dto/signIn";
import signUpDTO from "../dto/signUp";


class MiddlewareController {
  public async checkSignUpData(
    req: Request,
    res: Response,
    next: NextFunction,
    secret: string
  ): Promise<void> {
    try {
      var data: any = await signUpDTO.validate(req.body);
      data.senha = crypto.createHash("md5").update(data.senha).digest("hex");
      data.id = uuidv4();
      data.token = jwt.sign({ id: data.id }, secret, {
        expiresIn: 1800000, // 1800000ms = 30 min
      });
      req.body = data;
      next();
    } catch (err) {
      res.status(400);
      res.send({ mensagem: err.message });
    }
  }

  public async checkSignInData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      var data: any = await signInDTO.validate(req.body);
      data.senha = crypto.createHash("md5").update(data.senha).digest("hex");
      req.body = data;
      next();
    } catch (err) {
      res.status(400);
      res.send({ mensagem: err.message });
    }
  }

  public async verifyBearerToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    var bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.status(401);
      res.json({
        mensagem: "Não autorizado",
      });
    }
  }

  public async validateCredentials(
    req: Request,
    res: Response,
    next: NextFunction,
    secret: string
  ) {
    jwt.verify(req.token, secret, async (err: any, decoded: any) => {
      if (err) {
        res.status(403);
        res.json({
          mensagem: "Sessão inválida",
        });
        return;
      }

      next();
    });
  }
}

export default new MiddlewareController();
