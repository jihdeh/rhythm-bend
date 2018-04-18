import koa from "koa";
import koaRouter from "koa-router";
import bodyParser from "koa-bodyparser";
import queryRoutes from "./query-routes";
import userRoutes from "./user/userRoutes";
import middlewares from "../server/middleware/index";

const api = new koa();
const router = koaRouter();

// body parser
api.use(bodyParser());

//middlewares
middlewares(api);

router.get("/message", queryRoutes.fetchMessage);
router.get("/throwError", queryRoutes.throwErrorByDefault);

userRoutes(api);
api.use(router.routes()).use(router.allowedMethods());

export default api;
