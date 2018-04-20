import twilio from "twilio";

const sendSms = async to => {
    const client = twilio(process.env.accountSid, process.env.authToken);

    try {
        const message = await client
            .messages
            .create({to: to, from: process.env.number, body: "it takes two to tangle"});
        if (message) {
            console.log(message.sid);
            return message;
        }
    } catch (e) {
        console.log(e);
        return e;
    }
};

export default sendSms