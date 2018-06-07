import axios from "axios";
import config from "../../server/config/config";
import notify from "../../util/notify";

const reject = (e, ctx) => {
  ctx.status = e.response.status;
  ctx.body = invalidResponse(e);
};

const invalidResponse = e => ({
  status: e.response.data.status,
  message: e.response.data.message
});

const validResponse = _res => ({
  status: _res.data.data.status,
  message: _res.data.message,
  gateway_response: _res.data.data.gateway_response,
  authorization: _res.data.data.authorization,
  reference: _res.data.data.reference,
  log: _res.data.data.log
});

const resolve = (_res, ctx) => {
  ctx.status = 200;
  ctx.body = {
    data: validResponse(_res)
  };
};

exports.verify = async ctx => {
  const reference = ctx.params.reference;
  const direct = ctx.query.direct;
  try {
    const _res = await axios.get(`${config.endpoint}${reference}`, { headers: config.headers });
    notify("Payment verification", JSON.stringify(validResponse(_res)));
    return direct ? resolve(_res, ctx) : validResponse(_res);
  } catch (e) {
    return direct ? invalidResponse(e) : reject(e, ctx);
  }
};
