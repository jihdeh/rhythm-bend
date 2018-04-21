import User from "../../../app/user/userModel";
import log from "../../../util/log";
import _ from "lodash";
import generate from "../../../util/generatecode";
import sendSms from "../../../util/sms-client";

export default function() {
  log.info("Seeding the Database");

  const users = [
    {
      email: "jimmlo@x.com",
      firstName: "jim",
      lastName: "zing",
      password: "test",
      type: "voter",
      phoneNumber: 2348144194590
    },
    {
      email: "jimmy@x.com",
      firstName: "kim",
      lastName: "kar",
      password: "test",
      type: "contestant",
      phoneNumber: 2348144194590
    },
    {
      email: "xoko@x.com",
      firstName: "jake",
      lastName: "mark",
      password: "test",
      type: "contestant",
      phoneNumber: 2348144194590
    }
  ];

  const createDoc = (model, doc) =>
    new Promise((resolve, reject) =>
      new model(doc).save((err, saved) => (err ? reject(err) : resolve(saved)))
    );

  const cleanDB = () => {
    log.info("...cleaning the DB");

    var cleanPromises = [User].map(model => model.remove().exec());

    return Promise.all(cleanPromises);
  };

  const createUsers = async data => {
    const allusers = await User.find({ type: "contestant" });
    let promises = users.map(async (user, key) => {
      let newuser = new User(user);
      const uniqueCode = await generate(newuser.firstName, User);
      await sendSms("+" + newuser.phoneNumber);
      newuser.password = newuser.hashPassword(user.password, newuser.saltPassword());
      if (user.type === "contestant") newuser.uniqueCode = uniqueCode;
      return newuser.save();
    });

    return Promise.all(promises)
      .then(users =>
        _.merge(
          {
            users: users
          },
          data || {}
        )
      )
      .catch(err => console.log("user exists"));
  };

  cleanDB()
    .then(createUsers)
    .then(users => log.info("Seeded db with 3 users"))
    .catch(err => log.error(err));
}
