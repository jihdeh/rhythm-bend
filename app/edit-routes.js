import Cloudinary from "cloudinary";
import Donation from "../server/models/donationModel";
import User from "../server/models/userModel";
import Status from "../server/models/statusModel";
import MailClient from "../util/mail-client";
import verifyPaystackResponse from "../server/middleware/verifyPaystackResponse";
import JWTClient from "../util/jwt-utils";
import ResetMailTemplate from "../util/mailTemplates/resetMail";

Cloudinary.config({
  cloud_name: "soundit-africa",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
    if (!findContestant) {
      ctx.status = 404;
      ctx.body = { message: "Username not found" };
      return;
    }

    const incVote = +findContestant.numberOfVotesAttained + +voteCount;

    const isVerified = await verifyPaystackResponse(ctx);

    if (!isVerified) {
      ctx.status = 404;
      ctx.body = "Payment not valid";
      return;
    }
    const getVotingStatus = await Status.findOne({ votingOpen: true });
    if (!getVotingStatus) {
      ctx.status = 400;
      ctx.body = { message: "Voting closed." };
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
  // content-type: multipart/from
  // username, image as file
  try {
    const { fields: { username }, files: { image: { path } } } = ctx.request.body;
    const upload = await Cloudinary.v2.uploader.upload(path, {
      public_id: username,
      faces: true
    });
    if (upload) {
      const updateProfile = await User.findOneAndUpdate(
        { username },
        { profilePhoto: upload.secure_url }
      );
      ctx.body = upload;
    } else {
      ctx.status = 404;
      ctx.body = { message: "photo not updated" };
    }
  } catch (error) {
    ctx.status = 404;
    ctx.body = { message: "Error updating Profile Image" };
  }
};

const updatePassword = async ctx => {
  const { password, username } = ctx.request.body;
  if (!password || !username) {
    ctx.status = 400;
    ctx.body = { message: "Please provide required fields" };
  }
  try {
    let newuser = new User();
    let hashPass = newuser.hashPassword(password, newuser.saltPassword());
    const findUserAndUpdate = await User.findOneAndUpdate({ username }, { password: hashPass });
    ctx.body = "Successfully Updated Password";
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: error };
  }
};

const passwordRequest = async ctx => {
  //send mail link, with jwt username, sign it
  try {
    const { email } = ctx.request.body;
    const findByEmail = await User.findOne({ email });
    if (!findByEmail) {
      this.status = 404;
      this.body = { message: "User not found" };
      return;
    }
    const { username } = findByEmail;
    const sign = JWTClient.sign({ username, email });
    const domain =
      process.env.APP_ENV === "production" ? "https://www.soundit.africa" : "http://localhost:3000";
    const mailHtmlBody = ResetMailTemplate(username, `${domain}/password/reset?code=${sign}`);
    MailClient(email, "Password Reset - SoundIT Africa", mailHtmlBody);
    ctx.body = "You'd receive a mail from us shortly";
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: "Sorry try again" };
  }
};

const passwordReset = async ctx => {
  try {
    const { token, password } = ctx.request.body;
    const { uuid: { username, email } } = JWTClient.verify(token);
    ctx.request.body["username"] = username;
    updatePassword(ctx);
    ctx.body = "Successfully Reset Password";
  } catch (error) {
    ctx.status = 404;
    ctx.body = { message: "Error resetting password" };
  }
};

const setQualifiedCandidates = async ctx => {
  try {
    const { isQualified, username } = ctx.request.body;
    const updated = await User.findOneAndUpdate({ username }, { qualified: isQualified });
    ctx.body = "Successfully Updated Qualification";
  } catch (error) {
    ctx.status = 404;
    ctx.body = {
      message: e
    };
  }
};

const resetVoteCount = async ctx => {
  try {
    const updated = await User.update(
      {},
      { numberOfVotesAttained: "0", qualified: false },
      { multi: true }
    );
    ctx.body = "Successfully reset count";
  } catch (e) {
    ctx.status = 404;
    ctx.body = { message: "Error resetting count" };
  }
};

export default {
  donations,
  votings,
  updateOpenStatus,
  uploadProfileImage,
  updatePassword,
  passwordRequest,
  passwordReset,
  setQualifiedCandidates,
  resetVoteCount
};
