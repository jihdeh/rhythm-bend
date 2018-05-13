import log from "../util/log";
import Status from "../server/models/statusModel";

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

export default { fetchMessage, getOpenStatus };
