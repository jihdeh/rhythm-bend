import Router from "koa-router";
import passport from "koa-passport";
import LocalStrategy from "passport-local";
import User from "../../server/models/userModel";
import usercontroller from "./userController";

//authentication
function register(app) {
  const router = new Router({
    prefix: "/auth"
  });

  router
    .post("/signup/:reference", usercontroller.register)
    .post("/signin", usercontroller.login)
    .post("/test", async ctx => {
      console.log("hey", ctx.request.body);
      ctx.status = 200;
      ctx.body = ctx.request.body;
    })
    .put("/:uid", usercontroller.update)
    .delete("/:uid", usercontroller.delete);

  app.use(router.routes()).use(router.allowedMethods());
}

//seeker
function find(app) {
  const router = new Router({
    prefix: "/user"
  });

  router.get("/:username", usercontroller.find);

  app.use(router.routes()).use(router.allowedMethods());
}

//exports
export default function(app) {
  register(app);
  find(app);
}
