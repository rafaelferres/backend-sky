import { IConfigExpress, IConfigJWT, IConfigMongo } from ".";

export default interface IConfig {
    express: IConfigExpress,
    mongo: IConfigMongo,
    jwt: IConfigJWT
}