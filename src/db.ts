import postgres from "postgres";
import ssh2 from "ssh2";

const dbConfig = {
  host: "localhost",
  port: 5433,
  database: "ldbcsnb_sf1",
  username: "postgres",
  password: "mysecretpassword",
};

const sshConfig = {
  host: "143.248.140.127",
  port: 22,
  username: "joyo10",
  password: "joyo1020",
};

// @ts-ignore
const sql = postgres({
  ...dbConfig,
  // @ts-ignore
  socket: ({ host: [host], port: [port] }) =>
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
    }),
});

export default sql;
