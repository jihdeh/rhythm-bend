import mongoose from "mongoose";
import crypto from "crypto";

const user = mongoose.Schema({
  email: { type: String, required: true },
  password: { salt: String, hash: String },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true },
  profilePhoto: String,
  contestantVideo: [String],
  numberOfVotesAttained: Number,
  hasPaid: Boolean,
  uniqueCode: { type: String, trim: true },
  paymentReference: { type: String, required: true },
  about: String,
  state: String,
  country: String
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
