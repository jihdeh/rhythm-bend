import crypto from "crypto";
import passport from "koa-passport";
import LocalStrategy from "passport-local";
import jwt from "jsonwebtoken";
import User from "../../server/models/userModel";

const SECRET = process.env.AUTH_SECRET;

const authenticate = (type, ctx) => {
  return passport.authenticate(type, (err, user, info, status) => {
    if (user) {
      user.password = undefined;
      user.numberOfVotesAttained = undefined;
      ctx.status = 200;
      ctx.body = {
        data: jwt.sign(
          {
            token: user
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
    ctx.body = user;
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
    ctx.body = user;
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
    const user = await User.findOneAndUpdate({ username: ctx.params.uid }, ctx.request.body, {
      new: true
    }).select("-password -numberOfVotesAttained -_id -__v");
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
    const username = ctx.params.username;
    if (!ctx.query.admin) {
      const user = await User.findOne({ username }).select(
        "-password -numberOfVotesAttained -_id -__v"
      );
      searchresult(user, ctx);
      return;
    } else {
      const user = await User.findOne({ username }).select("-password");
      searchresult(user, ctx);
      return;
    }
  } catch (e) {
    reject(e, ctx);
  }
};
