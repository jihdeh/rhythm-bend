// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mail = (to, subject, html) => {
  const msg = {
    to,
    from: "donotreply@soundit.africa",
    subject,
    html
  };
  sgMail.send(msg);
};

export default mail;
