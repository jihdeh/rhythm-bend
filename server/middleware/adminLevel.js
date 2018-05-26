const adminLevel = async (ctx, next) => {
  const body = ctx.request.body;
  if (body.adminAccess === 1111) {
    ctx.request.body.admin = true;
  } else {
    ctx.request.body.admin = false;
  }
  await next();
};

export default adminLevel;
