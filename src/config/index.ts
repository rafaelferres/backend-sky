import * as interfaces from "../interfaces/"
import dotenv from "dotenv";

dotenv.config();

const getConfig = (): interfaces.IConfig => {
    var configExpress : interfaces.IConfigExpress = {
        port: Number(process.env.PORT)
    };

    var configMongo : interfaces.IConfigMongo = {
        mongoUrl: process.env.MONGO_URL
    }

    var configJWT : interfaces.IConfigJWT = {
        secret: process.env.SECRET_JWT
    }

    var config : interfaces.IConfig = {
        express: configExpress,
        jwt: configJWT,
        mongo: configMongo
    }

    return config;
}

export { getConfig };