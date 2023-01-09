const nodemailer = require("nodemailer");
const fs = require("fs");

const mailDetails = (recipient, subject, path) => {
  //email host information
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  fs.readFile(
    path,
    { encoding: "utf-8" },
    (err, data) => {
      let htmlFile = data;
      htmlFile = htmlFile.replace("#replaceWithLink#", "myOtherLinkTest");

      if (err) {
        console.warn("Error getting password reset template: " + err);
      } else {
        transporter.sendMail({
          from: `"Shazzar :)" ${process.env.AUTH_EMAIL}`,
          to: recipient,
          subject: subject,
          html: htmlFile, //Work on the html temlate. (It looks very terrible)
        });
      }
    }
  );
  return;
};

module.exports = { mailDetails };
