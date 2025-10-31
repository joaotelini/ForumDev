import express from "express";
import helmet from "helmet";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import yaml from "yaml";
import swaggerUi from "swagger-ui-express";

const server = express();

const file = fs.readFileSync("./docs/swagger.yaml", "utf8");
const swaggerDocument = yaml.parse(file);

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.use(cookieParser());

server.use(
  cors({
    origin: "http://localhost:3001",

    credentials: true,
  })
);

server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(routes);

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
