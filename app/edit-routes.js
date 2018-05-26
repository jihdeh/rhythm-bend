import Cloudinary from "cloudinary";
import Donation from "../server/models/donationModel";
import User from "../server/models/userModel";
import Status from "../server/models/statusModel";
import verifyPaystackResponse from "../server/middleware/verifyPaystackResponse";

const donations = async ctx => {
  try {
    const { reference: paymentReference } = ctx.params;
    const { body } = ctx.request;
    if ((!body.name.trim() && !body.amount) || body.amount <= 0) {
      ctx.status = 404;
      ctx.body = { message: "Required fields not present" };
      return;
    }
    //sanitize inputs here
    const moldRequest = Object.assign({}, { paymentReference }, { ...body });

    const isVerified = await verifyPaystackResponse(ctx);
    if (!isVerified) {
      ctx.status = 404;
      ctx.body = { message: "Payment not valid" };
      return;
    }

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
    // /api/vote/841736995?username=jakeRJWL&voteCount=2 url sample.
    const username = ctx.query.username;
    const voteCount = ctx.query.voteCount;
    const findContestant = await User.findOne({ username }).select("numberOfVotesAttained");

    const incVote = +findContestant.numberOfVotesAttained + +voteCount;

    const isVerified = await verifyPaystackResponse(ctx);

    if (!isVerified) {
      ctx.status = 404;
      ctx.body = "Payment not valid";
      return;
    }
    const updateContestantVote = await User.findOneAndUpdate(
      { username },
      { numberOfVotesAttained: incVote },
      { new: true }
    ).select("numberOfVotesAttained email username");
    ctx.status = 200;
    ctx.body = updateContestantVote;
  } catch (e) {
    ctx.status = 400;
    ctx.response = { message: "Error placing vote" };
  }
};

const updateOpenStatus = async ctx => {
  try {
    //http://localhost:6500/api/openStatus?type=votingOpen&state=false
    const type = ctx.query.type;
    const state = ctx.query.state;
    const getStatuses = await Status.findOneAndUpdate(
      {},
      { [type]: state },
      {
        upsert: true
      }
    );
    ctx.body = "Successfully set";
  } catch (error) {
    ctx.status = 404;
    ctx.body = { message: "Error setting status" };
  }
};

const uploadProfileImage = async ctx => {
  try {
    const { image, username } = ctx.request.body;
    console.log(image);
    Cloudinary.uploader.upload(
      image,
      result => {
        console.log(result);
      },
      {
        public_id: username
      }
    );
  } catch (error) {
    ctx.status = 404;
    ctx.body = { message: "Error updating Profile Image" };
  }
};

export default { donations, votings, updateOpenStatus, uploadProfileImage };
