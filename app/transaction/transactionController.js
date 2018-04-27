import axios from "axios";
import config from "../../server/config/config";

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

exports.verify = async (ctx, funcCall) => {
  //funcCall refers to the function called within server
  const reference = ctx.params.reference;
  try {
    const _res = await axios.get(`${config.endpoint}${reference}`, { headers: config.headers });
    return funcCall ? validResponse(_res) : resolve(_res, ctx);
  } catch (e) {
    return funcCall ? invalidResponse(e) : reject(e, ctx);
  }
};

