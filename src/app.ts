import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import routes from "./routes";

import { IConfig } from "./interfaces";
import { getConfig } from "./config";


class App {
    public express: express.Application;
    private config: IConfig;

    constructor(){
        this.config = getConfig();
        this.express = express();
        this.middlewares();
        this.database();
        this.routes();
    }

    private middlewares(): void {
        this.express.use(cors());
        this.express.use(express.json());
        this.express.use(morgan("short"));
    }

    private database(): void {
        mongoose.connect(this.config.mongo.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    private routes(): void {
        this.express.use(routes);
    }


    public listen(): void{
        this.express.listen(this.config.express.port, () => {
            console.log(`Running on port ${this.config.express.port}`);
        });
    }
}
export default new App();

//skyuser
//p4Emx0dOAobJPthL