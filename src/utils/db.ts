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

//@ts-ignore
const sql1 = postgres({
  ...db1Config,
});

//@ts-ignore
const sql10 = postgres({
  ...db10Config,
});

//@ts-ignore
const sql100 = postgres({
  ...db100Config,
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
