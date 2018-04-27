import Donation from "../server/models/donationModel";
import User from "../server/models/userModel";
import VerifyPayment from "./transaction/transactionController";

const donations = async ctx => {
  try {
    const { reference: paymentReference } = ctx.params;
    const { body } = ctx.request;
    //sanitize inputs here
    const moldRequest = Object.assign({}, { paymentReference }, { ...body });

    //verify transaction can only be done in prod mode
    // if(process.env.NODE_ENV === 'production') {
    const paymentStatus = await VerifyPayment.verify(ctx, true);

    if (
      paymentStatus.status === false ||
      paymentStatus.status === "failed" ||
      paymentStatus.status !== "success" ||
      paymentStatus.status !== true
    ) {
      ctx.status = 404;
      ctx.body = "Payment not valid";
      return;
    }
    // }

    const newDonation = new Donation(moldRequest);
    const saveDonation = await newDonation.save();
    ctx.status = 200;
    ctx.body = "Successfully donated";
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      message: e
    };
  }
};

const votings = async ctx => {
  try {
    const uniqueCode = ctx.params.uniqueCode;
    const voteCount = ctx.query.voteCount;
    const findContestant = User.findOne({ uniqueCode });
  } catch (e) {
    ctx.status = 400;
    ctx.response = "Error placing vote";
  }
};

export default { donations };
