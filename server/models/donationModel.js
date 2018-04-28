import mongoose from "mongoose";

const donation = mongoose.Schema({
  email: { type: String },
  name: { type: String, required: true, trim: true },
  phoneNumber: { type: String },
  paymentReference: { type: String, required: true },
  amount: { type: String, required: true }
});

export default mongoose.model("Donations", donation);
