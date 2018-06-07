// import User from "../../models/userModel";
// import log from "../../../util/log";
// import _ from "lodash";
// import sendSms from "../../../util/sms-client";

// export default function() {
//   log.info("Seeding the Database");

//   const users = [
//     {
//       email: "jimmlo@x.com",
//       firstName: "jim",
//       lastName: "zing",
//       password: "test",
//       username: "jincheng",
//       active: false,
//       contestantVideo: ["https://www.youtube.com/embed/-oCCnxBos10"],
//       phoneNumber: 2348144194590,
//       state: "Lagos",
//       country: "Nigeria"
//     },
//     {
//       email: "jimmy@x.com",
//       firstName: "kim",
//       lastName: "kar",
//       password: "test",
//       username: "jimmyxy",
//       contestantVideo: ["https://www.youtube.com/embed/-oCCnxBos10"],
//       active: false,
//       phoneNumber: 2348069790405,
//       state: "Lagos",
//       country: "Kenya"
//     },
//     {
//       email: "xoko@x.com",
//       firstName: "jake",
//       lastName: "mark",
//       password: "test",
//       contestantVideo: ["https://www.youtube.com/embed/-oCCnxBos10"],
//       username: "soco",
//       active: false,
//       phoneNumber: 2348144194590,
//       state: "Lagos",
//       country: "Brazil"
//     }
//   ];

//   const cleanDB = async () => {
//     log.info("...cleaning the DB");

//     var cleanPromises = await User.remove({});

//     return cleanPromises;
//   };

//   const createUsers = async data => {
//     let promises = users.map(async (user, key) => {
//       let newuser = new User(user);
//       try {
//         const cv = await sendSms(`+${newuser.phoneNumber}`);
//       } catch (e) {
//         console.log(e, "as");
//       }
//       newuser.password = newuser.hashPassword(user.password, newuser.saltPassword());
//       newuser.active = true;
//       return newuser.save();
//     });

//     return Promise.all(promises)
//       .then(users =>
//         _.merge(
//           {
//             users: users
//           },
//           data || {}
//         )
//       )
//       .catch(err => console.log("user exists"));
//   };

//   cleanDB()
//     .then(createUsers)
//     .then(users => log.info("Seeded db with 3 users"))
//     .catch(err => log.error(err));
// }
