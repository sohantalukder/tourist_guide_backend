/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequelize } from "sequelize";
import dbConfig from "../configs/database.js";
import divisions from "./divisions.js";

let dbConnection: any;
if (dbConfig.database && dbConfig.username) {
    dbConnection = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        { dialect: "mysql", host: dbConfig.host, logging: dbConfig.logging }
    );
    dbConnection.addModels([divisions]);
}
export default dbConnection;
