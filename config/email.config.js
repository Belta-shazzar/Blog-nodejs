const nodemailer = require("nodemailer");

const mailDetails = (recipient, subject, htmlFile) => {
  console.log(recipient)
  //email host information
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  transporter.sendMail({
    from: process.env.AUTH_EMAIL,
    to: recipient,
    subject: subject,
    html: htmlFile, //Work on the html temlate. (It looks very terrible)
  });

  return;
};

module.exports = { mailDetails };
