import sanitizeHtml from "sanitize-html";

const sanitizer = async (ctx, next) => {
  if (ctx.request.body) {
    const { body } = ctx.request;
    const mykeys = Object.keys(body);

    mykeys.forEach(key => {
      ctx.request.body[`${key}`] = sanitizeHtml(ctx.request.body[`${key}`]);
    });
  }
  await next();
};

export default sanitizer;
