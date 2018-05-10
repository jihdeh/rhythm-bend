require("babel-polyfill");

import os from "os";
import cluster from "cluster";

import App from "./app";
import connection from "./db/connection";
import seed from "./db/seeds/user";

import http from "http";
import https from "https";
import fs from "fs";

const options = {
  ca: fs.readFileSync("./config/STAR_soundit_africa.ca-bundle"),
  key: fs.readFileSync("./config/server.key"),
  cert: fs.readFileSync("./config/STAR_soundit_africa.crt")
};

function startMaster() {
  const workforce = process.env.WEB_CONCURRENCY || os.cpus().length;

  for (var i = 0; i < workforce; i++) {
    setTimeout(() => {
      cluster.fork();
    }, i * 1000);
  }

  cluster.on("exit", worker => {
    console.warn(`Worker ${worker.process.pid} died, forking new worker`);
    cluster.fork();
  });
}

function startWorker() {
  const app = App();
  const port = process.env.PORT || 6500;
  const securePort = process.env.PORT || 6800;

  //mongoose connection
  connection(app);

  //seed db
  seed();

  // http.createServer(app.callback()).listen(port);
  https.createServer(options, app.callback()).listen(securePort);

  console.info(
    `==> ✅  Server is listening in ${process.env.NODE_ENV || "development"} mode, with worker ${
      process.pid
    }`
  );
  console.info(`==> 🌎  started on port ${port}`, { event: "start", port });
  if (process.send) {
    process.send("online");
  }
} // Not enough memory on free heroku for fork mode
if (cluster.isMaster && process.env.NODE_ENV !== "development") {
  startMaster();
} else {
  startWorker();
}
