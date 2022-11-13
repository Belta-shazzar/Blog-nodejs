const nodemailer = require("nodemailer");

const transpoter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});


const sendSubscriberMail = (recipient, subject, body) => {
    const message = {
        from: process.env.AUTH_EMAIL,
        to: recipient,
        subject: subject,
        html:
          "Hello there" +
          ",\n\n" +
          "\n\nThank You for signing up on our weekly update!\n",  // Can be either html or text
    }
    return message;
}

module.exports = { transpoter, sendSubscriberMail };
