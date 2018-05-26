import koa from "koa";
import koaRouter from "koa-router";
import queryRoutes from "./query-routes";
import editRoutes from "./edit-routes";
import userRoutes from "./user/userRoutes";
import transactionRoutes from "./transaction/transactionRoutes";
import middlewares from "../server/middleware/index";

const api = new koa();
const router = koaRouter();
//middlewares
middlewares(api);

router.post("/donate/:reference", editRoutes.donations);
router.post("/vote/:reference", editRoutes.votings);

router.put("/openStatus", editRoutes.updateOpenStatus);

router.put("/uploadProfileImage", editRoutes.uploadProfileImage);

router.get("/message", queryRoutes.fetchMessage);
router.get("/openStatus", queryRoutes.getOpenStatus);
router.get("/searchContestant", queryRoutes.findContestant);

userRoutes(api);
transactionRoutes(api);
api.use(router.routes()).use(router.allowedMethods());

export default api;
