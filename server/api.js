import mount from "koa-mount";
import koa from "koa";
import cacheControl from "koa-cache-control";
import bodyParser from "koa-bodyparser";
import apiErrorHandler from "../util/api-error-handler";
import endpointApi from "../app/endpoints";

export default function Api() {
  const api = new koa();
  api.use(bodyParser());

  api.use(apiErrorHandler);

  api.use(cacheControl({ maxage: 10 * 1000 }));

  //bounce back if not from domain
  api.use(async (ctx, next) => {
    console.log(ctx.header.host, ctx.header.origin);
    ctx.set("Vary", "Accept-Encoding");
    await next();
    return;
  });

  api.use(mount("/", endpointApi));
  api.use(function terminator() {
    return; // Do not continue past the API request handlers into the frontend request handlers
  });

  return api;
}
