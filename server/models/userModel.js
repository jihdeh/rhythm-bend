import mongoose from "mongoose";
import crypto from "crypto";

const shouldRequirePaymentReference = process.env.NODE_ENV === "production";

const user = mongoose.Schema({
  email: { type: String, required: true, index: true },
  password: { salt: String, hash: String },
  firstName: { type: String, required: true, trim: true, index: true },
  lastName: { type: String, required: true, trim: true, index: true },
  phoneNumber: { type: String, required: true, index: true },
  profilePhoto: String,
  contestantVideo: [],
  numberOfVotesAttained: { type: String, default: 0 },
  hasPaid: Boolean,
  username: { type: String, trim: true, required: true, index: true },
  paymentReference: { type: String, required: !!shouldRequirePaymentReference },
  about: { type: String, index: true },
  state: { type: String, index: true },
  active: { type: Boolean, required: true, default: false },
  country: { type: String, index: true },
  facebook: { type: String, index: true },
  twitter: { type: String, index: true },
  instagram: { type: String, index: true },
  youtube: { type: String, index: true },
  random: {
    type: [Number],
    default: function() {
      return [Math.random(), Math.random()];
    },
    index: "2d"
  }
});

user.methods.saltPassword = () => crypto.randomBytes(128).toString("hex");

user.methods.hashPassword = (password, salt) => {
  let hash = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return {
    salt,
    hash
  };
};

export default mongoose.model("Users", user);
