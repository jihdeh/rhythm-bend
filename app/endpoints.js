import koa from "koa";
import koaRouter from "koa-router";
import bodyParser from "koa-bodyparser";
import queryRoutes from "./query-routes";
import editRoutes from "./edit-routes";
import userRoutes from "./user/userRoutes";
import transactionRoutes from "./transaction/transactionRoutes";
import middlewares from "../server/middleware/index";

const api = new koa();
const router = koaRouter();

// body parser
api.use(bodyParser());

//middlewares
middlewares(api);

router.post("/donate/:reference", editRoutes.donations);
router.post("/vote/:reference", editRoutes.votings);

router.get("/message", queryRoutes.fetchMessage);
router.get("/throwError", queryRoutes.throwErrorByDefault);

userRoutes(api);
transactionRoutes(api);
api.use(router.routes()).use(router.allowedMethods());

export default api;
