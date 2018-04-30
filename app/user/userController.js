import crypto from "crypto";
import passport from "koa-passport";
import LocalStrategy from "passport-local";
import jwt from "jsonwebtoken";
import User from "../../server/models/userModel";

const SECRET = process.env.AUTH_SECRET;

const authenticate = (type, ctx) => {
  return passport.authenticate(type, (err, user, info, status) => {
    if (user) {
      ctx.status = 200;
      ctx.body = {
        data: jwt.sign(
          {
            token: {
              email: user.email,
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              uniquecode: user.uniqueCode
            }
          },
          SECRET,
          {
            expiresIn: "7d"
          }
        )
      };
      return ctx.login(user);
    } else {
      ctx.status = 400;
      ctx.body = {
        status: "error",
        message: info
      };
    }
  })(ctx);
};

const response = (user, ctx) => {
  if (user) {
    ctx.status = 200;
    ctx.body = {
      data: {
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        uniquecode: user.uniqueCode
      }
    };
  } else if (!user) {
    ctx.status = 400;
    ctx.body = {
      status: "error",
      message: "Incorrect email or password"
    };
  }
};

const reject = (e, ctx) => {
  ctx.status = 400;
  ctx.body = {
    status: "error",
    message: e
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
          profilePicture:user.profilePhoto,
          state: user.state,
          country: user.country,
          contestantVideo: user.contestantVideo,
          email: user.email,
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
          state: user.state,
          country: user.country,
          contestantVideo: user.contestantVideo
        }
      };
    }
  } else {
    ctx.status = 400;
    ctx.body = {
      status: "error",
      message: "user not found"
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
