import mongoose from "mongoose";

export default function(app) {
  console.log(process.env);
  const url = process.env.DB_URL;

  mongoose
    .connect(url)
    .then(() => console.info(`==> ✅ Database connection established`))
    .catch(err => console.error(err));
}
