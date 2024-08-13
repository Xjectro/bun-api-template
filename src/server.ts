import "dotenv/config";
import * as http from "http";
import app from "./app";
import { connect as dbConnection } from "./database/dbConnection";
import { config } from "./constants";

const httpServer = http.createServer(app);

httpServer.listen(config.port, function () {
    dbConnection();
    console.log(`Server listening on port ${config.port}`);
});
