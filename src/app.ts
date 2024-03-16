import express, {
  Application,
  Request,
  Response,
} from "express";
import cors from "cors";

import { port } from "./constant";

const app: Application = express();

app.use(cors());

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello");
});
