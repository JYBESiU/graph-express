import express, {
  Application,
  Request,
  Response,
} from "express";
import cors from "cors";

import { port } from "./constant";
import sql from "./db";

const app: Application = express();

app.use(cors());

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

app.get("/hello", async (req: Request, res: Response) => {
  const a = await sql`select * from city`;
  res.send("Hello");
});
