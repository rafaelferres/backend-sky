import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../schemas/User";
import signUpDTO from "../dto/signUp";
import signInDTO from "../dto/signIn";
import { IConfig } from "../interfaces";
import { getConfig } from "../config";

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
      console.log(req.body);
      res.json({ status : true});
  }
}

export default new UserController();
