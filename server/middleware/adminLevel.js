const adminLevel = async (ctx, next) => {
  const body = ctx.request.body;
<<<<<<< HEAD
  if (body.adminAccess === 1111) {
    ctx.request.body.admin = true;
  } else {
    ctx.request.body.admin = false;
=======
  if (body) {
    if (body.adminAcess === 1111) {
      ctx.request.body.admin = true;
    } else {
      ctx.request.body.admin = false;
    }
>>>>>>> WIP:added sanitizer
  }
  await next();
};

export default adminLevel;
