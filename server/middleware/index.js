import adminLevel from "./adminLevel";
import sanitizer from "./sanitizer";

export default function(app) {
  app.use(adminLevel);
  app.use(sanitizer);
}
