import mongoose from "mongoose";

export default function(app) {
  const url = process.env.DB_URL;
  const options = {
    keepAlive: 300000,
    connectTimeoutMS: 30000,
    reconnectTries: 30,
    reconnectInterval: 5000
  };
  mongoose
    .connect(url, options)
    .then(() => console.info(`==> ✅ Database connection established`))
    .catch(err => console.error(err));
}
