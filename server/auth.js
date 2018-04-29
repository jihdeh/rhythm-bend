import passport from "koa-passport";
import LocalStrategy from "passport-local";
import User from "./models/userModel";
import shortid from "shortid";
import sendSms from "../util/sms-client";
import generateShortCode from "../util/generatecode";
import verifyPaystackResponse from "./middleware/verifyPaystackResponse";

const options = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true
};

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

function localsignin() {
  passport.use(
    "local-signin",
    new LocalStrategy(options, (req, email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) return done(null, false, "Incorrect email or password");
          if (user.hashPassword(password, user.password.salt).hash === user.password.hash) {
            return done(null, user);
          } else {
            return done(null, false, "Incorrect email or password");
          }
        })
        .catch(err => {
          return done(err);
        });
    })
  );
}

function localsignup() {
  passport.use(
    "local-signup",
    new LocalStrategy(options, async (req, email, password, done) => {
      try {
        const isVerified = await verifyPaystackResponse(req);
        if (!isVerified) {
          //@TODO send notification details to slack
          done(null, false, "Payment not valid");
          return;
        }
        const user = await User.findOne({ email: email });
        const uniquecode = generateShortCode(req.body.firstName, User);

        if (user) {
          return done(
            null,
            false,
            "An account has already being registered with this email address"
          );
        } else {
          if (req.body.password === req.body.confirmPassword) {
            let newuser = new User(req.body);
            const uniqueCode = await generate(req.body.firstName, User);

            newuser.password = newuser.hashPassword(password, newuser.saltPassword());

            newuser.uniqueCode = uniqueCode;

            try {
              const saved = await newuser.save();
              await sendSms(`+${newuser.phoneNumber}`);
              return done(null, saved);
            } catch (err) {
              return done(null, false, err);
            }
          } else {
            return done(
              null,
              false,
              "Password Mismatch,password field and confirmPassword field must match"
            );
          }
        }
      } catch (err) {
        return done(err);
      }
    })
  );
}
export const generate = (name, Model) => {
  return generateShortCode(name, Model);
};

export default function() {
  localsignin();
  localsignup();
}
