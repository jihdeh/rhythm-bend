import User from "../../models/userModel";
import log from "../../../util/log";
import _ from "lodash";
import sendSms from "../../../util/sms-client";

export default function() {
  log.info("Seeding the Database");

  const users = [
    {
      email: "jimmlo@x.com",
      firstName: "jim",
      lastName: "zing",
      password: "test",
      username: "jincheng",
      phoneNumber: 2348144194590,
      active:false
    },
    {
      email: "jimmy@x.com",
      firstName: "kim",
      lastName: "kar",
      password: "test",
      username: "jimmyxy",
      phoneNumber: 2348144194590,
      active:false
    },
    {
      email: "xoko@x.com",
      firstName: "jake",
      lastName: "mark",
      password: "test",
      username: "soco",
      phoneNumber: 2348144194590,
      active:false
    }
  ];

  const cleanDB = async () => {
    log.info("...cleaning the DB");

    var cleanPromises = await User.remove({});

    return cleanPromises;
  };

  const createUsers = async data => {
    let promises = users.map(async (user, key) => {
      let newuser = new User(user);
      await sendSms(`+${newuser.phoneNumber}`);
      newuser.password = newuser.hashPassword(user.password, newuser.saltPassword());
      newuser.active = true;
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
