import log from "../util/log";
import Status from "../server/models/statusModel";
import User from "../server/models/userModel";

function fetchMessage(ctx) {
  ctx.body = {
    author: "Jihdeh",
    github: "https://github.com/jihdeh/simple-node",
    twitter: "@slim_temple"
  };
}

const getOpenStatus = async ctx => {
  try {
    const getStatuses = await Status.findOne({});
    ctx.body = getStatuses;
  } catch (error) {
    ctx.status = 404;
    ctx.body = { message: "Error getting status" };
  }
};

const findContestant = async ctx => {
  const username = ctx.query.username;
  try {
    if (username) {
      const getResult = await User.find({
        username: { $regex: ctx.query.username, $options: "i" },
        active: true
      })
        .select("-password -numberOfVotesAttained -phoneNumber -email")
        .lean()
        .exec();
      ctx.body = getResult;
      return;
    } else {
      const getResult = await User.find({ active: true })
        .where("random")
        .near([Math.random(), Math.random()])
        .select("-password -numberOfVotesAttained -phoneNumber -email")
        .lean()
        .exec();
      ctx.body = getResult;
      return;
    }
  } catch (error) {
    ctx.status = 404;
    console.log(error);
    ctx.body = { message: "Error getting contestant profile" };
  }
};

export default { fetchMessage, getOpenStatus, findContestant };
