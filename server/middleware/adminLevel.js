const adminLevel = async (ctx, next) => {
  const body = ctx.request.body;
  if (body.adminAcess) {
    if (body.adminAcess === 1111) {
      ctx.request.body.admin = true;
    } else {
      ctx.request.body.admin = false;
    }
  }
  await next();
};

export default adminLevel;
