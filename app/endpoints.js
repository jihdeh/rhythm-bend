import koa from "koa";
import koaRouter from "koa-router";
import queryRoutes from "./query-routes";
import koaBody from "koa-body";
import bodyParser from "koa-bodyparser";
import editRoutes from "./edit-routes";
import userRoutes from "./user/userRoutes";
import transactionRoutes from "./transaction/transactionRoutes";
import middlewares from "../server/middleware/index";

const api = new koa();
const router = koaRouter();

api.use(bodyParser());

//middlewares
middlewares(api);

router.post("/donate/:reference", editRoutes.donations);
router.post("/vote/:reference", editRoutes.votings);

router.post("/password/request", editRoutes.passwordRequest);
router.post("/password/reset", editRoutes.passwordReset);

router.put("/openStatus", editRoutes.updateOpenStatus);
router.put("/updatePassword", editRoutes.updatePassword);
router.put(
  "/uploadProfileImage",
  koaBody({
    multipart: true,
    formLimit: 3
  }),
  editRoutes.uploadProfileImage
);

router.get("/message", queryRoutes.fetchMessage);
router.get("/openStatus", queryRoutes.getOpenStatus);
router.get("/searchContestant", queryRoutes.findContestant);

userRoutes(api);
transactionRoutes(api);
api.use(router.routes()).use(router.allowedMethods());

export default api;
