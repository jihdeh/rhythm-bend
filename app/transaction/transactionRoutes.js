import Router from "koa-router";
import transactionController from "./transactionController";

export default function(app) {
  const router = new Router({
    prefix: "/transaction"
  });

  router.get("/:reference", transactionController.verify);

  app.use(router.routes()).use(router.allowedMethods());
}
