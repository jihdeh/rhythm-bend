import passport from "koa-passport";
import LocalStrategy from "passport-local";
import User from "../app/user/userModel";
import shortid from "shortid";

shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@");

const generateShortCode = async (name, Model) => {
  const reg = new RegExp("[^A-Za-z]");
  const shortidcode = shortid
    .generate()
    .substring(0, 4)
    .toUpperCase()
    .replace(reg, "B");
  const uniqueCode = name + shortidcode;
  try {
    const verify = await Model.find({ uniqueCode });
    if (verify.length) {
      return generateShortCode(name, Model);
    } else {
      return uniqueCode;
    }
  } catch (e) {
    console.log(e);
  }
};

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
          if (!user) return done(null, false, "User does not exist");
          if (user.hashPassword(password, user.password.salt).hash === user.password.hash) {
            return done(null, user);
          } else {
            return done(null, false, "Password does not match");
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
        const user = await User.findOne({ email: email });
        const uniquecode = generateShortCode(req.body.firstName, User);
        if (user) {
          return done(null, false, "This username is already taken");
        } else {
          if (req.body.password === req.body.confirmPassword) {
            let newuser = new User(req.body);
            const uniqueCode = await generate(req.body.firstName, User);

            newuser.password = newuser.hashPassword(password, newuser.saltPassword());

            if (newuser.type === "contestant") newuser.uniqueCode = uniqueCode;

            newuser.save((err, saved) => {
              if (err) {
                return done(null, false, err);
              }
              if (saved) {
                return done(null, saved);
              }
            });
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
