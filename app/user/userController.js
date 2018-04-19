import crypto from "crypto";
import passport from "koa-passport";
import LocalStrategy from "passport-local";
import User from "./userModel";

const authenticate = (type, ctx) => {
  return passport.authenticate(type, (err, user, info, status) => {
    if (user) {
      ctx.status = 200;
      ctx.body = {
        data: {
          email: user.email,
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type,
          uniquecode: user.uniqueCode
        }
      };
      return ctx.login(user);
    } else {
      ctx.status = 400;
      ctx.body = {
        status: "error",
        data: {
          message: info
        }
      };
    }
  })(ctx);
};

const response = (user, ctx) => {
  if (user) {
    console.log(user);
    ctx.status = 200;
    ctx.body = {
      data: {
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
        uniquecode: user.uniqueCode
      }
    };
  } else if (!user) {
    ctx.status = 400;
    ctx.body = {
      status: "error",
      data: {
        message: "user not found"
      }
    };
  }
};

const reject = (e, ctx) => {
  ctx.status = 400;
  ctx.body = {
    status: "error",
    data: {
      message: e
    }
  };
};
const searchresult = (user, ctx) => {
  if (user) {
    ctx.status = 200;
    if (ctx.request.body.admin) {
      ctx.body = {
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          uniqueCode: user.uniqueCode,
          about: user.about,
          location: user.location,
          contestantVideo: user.contestantVideo,
          email: user.email,
          type: user.type,
          numberOfVotesAttained: user.numberOfVotesAttained,
          hasPaid: user.hasPaid
        }
      };
    } else {
      ctx.body = {
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          uniqueCode: user.uniqueCode,
          about: user.about,
          location: user.location,
          contestantVideo: user.contestantVideo
        }
      };
    }
  } else {
    ctx.status = 400;
    ctx.body = {
      status: "error",
      data: {
        message: "user not found"
      }
    };
  }
};

exports.login = async ctx => authenticate("local-signin", ctx);

exports.register = async ctx => authenticate("local-signup", ctx);

exports.update = async ctx => {
  try {
    const user = await User.findByIdAndUpdate(ctx.params.uid, ctx.request.body, { new: true });
    response(user, ctx);
  } catch (e) {
    reject(e, ctx);
  }
};

exports.delete = async ctx => {
  try {
    const user = await User.findByIdAndRemove(ctx.params.uid);
    response(user, ctx);
  } catch (e) {
    reject(e, ctx);
  }
};
exports.find = async ctx => {
  try {
    const uniqueCode = ctx.params.uniqueCode;
    const user = await User.findOne({ uniqueCode });
    searchresult(user, ctx);
  } catch (e) {
    reject(e, ctx);
  }
};
