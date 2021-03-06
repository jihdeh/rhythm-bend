import mongoose from "mongoose";

const status = mongoose.Schema({
  registrationOpen: { type: Boolean, default: false },
  votingOpen: { type: Boolean, default: false },
  nextStage: { type: Boolean, default: false },
  loginOpen: { type: Boolean, default: false }
});

export default mongoose.model("Status", status);
