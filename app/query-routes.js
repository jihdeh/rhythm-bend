import log from "../util/log";
import Status from "../server/models/statusModel";
import User from "../server/models/userModel";
import notify from "../util/notify";

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
        contestantVideo: { $size: 1 },
        active: true
      })
        .select("-password -numberOfVotesAttained -phoneNumber -email")
        .lean()
        .exec();
      ctx.body = getResult;
      return;
    } else {
      const getResult = await User.find({ active: true, contestantVideo: { $size: 1 } })
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

const fetchContestants = async ctx => {
  try {
    const user = await User.find({}).select("-password -_id -__v");
    ctx.body = user;
    return;
  } catch (e) {
    ctx.status = 400;
    ctx.body = { message: "Error fetching contestants" };
  }
};

const slackLiteNotify = async ctx => {
  const { username, voteCount } = ctx.query;
  try {
    notify("Lite Vote", `Lite Someone voted for ${username} with ${voteCount}`);
    ctx.body = "done";
    return;
  } catch (e) {
    ctx.status = 400;
    ctx.body = { message: "Error sending notification" };
  }
};

export default { fetchMessage, getOpenStatus, findContestant, fetchContestants, slackLiteNotify };
