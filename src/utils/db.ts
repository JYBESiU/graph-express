import { Request } from "express";
import postgres, { Sql } from "postgres";
import ssh2 from "ssh2";

const db1Config = {
  host: "localhost",
  port: 5433,
  database: "ldbcsnb_sf1",
  username: "postgres",
  password: "mysecretpassword",
};
const db10Config = {
  host: "localhost",
  port: 5433,
  database: "ldbcsnb_sf10",
  username: "postgres",
  password: "mysecretpassword",
};
const db100Config = {
  host: "localhost",
  port: 5433,
  database: "ldbcsnb_sf100",
  username: "postgres",
  password: "mysecretpassword",
};
const sshConfig = {
  host: "143.248.140.127",
  port: 22,
  username: "joyo10",
  password: "joyo1020",
};

const socketFunction = ({
  host: [host],
  port: [port],
}: {
  host: string[];
  port: number[];
}) =>
  new Promise((resolve, reject) => {
    const ssh = new ssh2.Client();
    ssh
      .on("error", reject)
      .on("ready", () =>
        ssh.forwardOut(
          "127.0.0.1",
          12345,
          host,
          port,
          (err, socket) =>
            err ? reject(err) : resolve(socket)
        )
      )
      .connect(sshConfig);
  });

//@ts-ignore
const sql1 = postgres({
  ...db1Config,
  socket: socketFunction,
});

//@ts-ignore
const sql10 = postgres({
  ...db10Config,
  socket: socketFunction,
});

//@ts-ignore
const sql100 = postgres({
  ...db100Config,
  socket: socketFunction,
});

export async function getSql(req: Request) {
  const sf = req.query.sf;

  let sql: Sql = postgres();

  if (sf === "1") sql = sql1;
  if (sf === "10") sql = sql10;
  if (sf === "100") sql = sql100;

  await sql`LOAD 'pg_graph'`;
  await sql`SET SEARCH_PATH=graph_catalog, "$user", public`;

  return sql;
}
