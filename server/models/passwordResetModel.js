import mongoose from "mongoose";

const passwordReset = mongoose.Schema({
  email: { type: String },
  username: { type: String, required: true, trim: true },
  verifyCode: { type: String }
});

export default mongoose.model("PasswordReset", passwordReset);
