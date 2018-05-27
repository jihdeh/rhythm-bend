import sanitizeHtml from "sanitize-html";

const sanitizer = async (ctx, next) => {
  //ctx.request.body = sanitizeHtml(ctx.request.body);
  //ctx.query = sanitizeHtml(ctx.query);
  await next();
};

export default sanitizer;
