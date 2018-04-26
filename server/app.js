import koa from "koa";
import cors from "@koa/cors";
import forward from "koa-forward-request";
import mount from "koa-mount";
import log from "../util/log";
import Api from "./api";
import connection from "./db/connection";
import Frontend from "./frontend";
import seed from "./db/seeds/user";
import session from "koa-session";
import passport from "koa-passport";
import auth from "./auth";

function App() {
  const app = new koa();
  app.use(cors());
  //sessions
  app.keys = ["super-secret-key"];
  app.use(session(app));

  //authentication
  auth();
  app.use(passport.initialize());
  app.use(passport.session());

  //mongoose connection
  connection(app);

  //seed db
  seed();

  forward(app);
  app.use(mount("/", Frontend())).use(mount("/api", Api()));
  //you will now make api calls with "/api" as default base
  //for example GET => /api/getNotes, /api/postInfo

  return app;
}
export default App;
