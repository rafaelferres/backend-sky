import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../schemas/User";


declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

class UserController {

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


  public async getUser(req: Request, res: Response) {
    const userId = req.params["user_id"];

    var user = await User.findOne({ id: userId, token: req.token });
    if (user) {
      var userJSON = user.toJSON();
      delete userJSON._id;

      res.status(200);
      res.json(userJSON);
    } else {
      res.status(401);
      res.json({ message: "Não autorizado" });
    }
  }
}

export default new UserController();
