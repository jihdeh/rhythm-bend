import VerifyPayment from "../../app/transaction/transactionController";

//verify transaction can only be done in prod mode
const verifyResponse = async ctx => {
  if (process.env.APP_ENV === "production") {
    const paymentStatus = await VerifyPayment.verify(ctx, true);
    if (
      paymentStatus.status === false ||
      paymentStatus.status === "failed" ||
      paymentStatus.status !== "success" ||
      paymentStatus.status !== true
    ) {
      return false;
    }
  }
  return true;
};

export default verifyResponse;
