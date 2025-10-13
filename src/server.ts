import express from "express";
import helmet from "helmet";
import routes from "./routes";

const server = express();

server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(routes);

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
