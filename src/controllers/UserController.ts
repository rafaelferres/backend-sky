import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../schemas/User";
import signUpDTO from "../dto/signUp";
import signInDTO from "../dto/signIn";
import { IConfig } from "../interfaces";
import { getConfig } from "../config";

declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

class UserController {
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

  public async signUp(req: Request, res: Response): Promise<void> {
    const checkEmail = await User.findOne({ email: req.body.email });

    if (checkEmail) {
      res.status(400);
      res.json({ mensagem: "E-mail já existente" });
    } else {
      const user = await User.create(req.body);
      const userJSON = user.toJSON();
      delete userJSON._id;

      res.status(200);
      res.json(userJSON);
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

  public async signIn(
    req: Request,
    res: Response,
    secret: string
  ): Promise<void> {
    const user = await User.findOne({
      email: req.body.email,
      senha: req.body.senha,
    });
    if (user) {
      var userJSON = user.toJSON();
      userJSON.token = jwt.sign({ id: user.id }, secret, {
        expiresIn: 1800000, // 1800000ms = 30 min
      });

      await User.updateOne(
        { _id: user._id },
        { $set: { token: userJSON.token, ultimo_login: Date.now() } }
      );

      delete userJSON._id;

      res.status(200);
      res.send(userJSON);
    } else {
      res.status(401);
      res.send({ mensagem: "Usuário e/ou senha inválidos" });
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

export default new UserController();
