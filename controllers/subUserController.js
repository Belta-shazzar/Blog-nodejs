const SubUser = require("../models/subscribedUsers");
const { transpoter, sendSubscriberMail } = require("../config/email.config");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const userGeneralSubscription = async (req, res) => {
  const checkEmail = await SubUser.findOne({ email: req.body.email });
  req.body.generalSub = true;
  let subUser;
  let statusCode;

  if (!checkEmail) {
    subUser = await SubUser.create(req.body);
    statusCode = StatusCodes.CREATED;
  } else if (checkEmail && checkEmail.generalSub === false) {
    subUser = await SubUser.findOneAndUpdate(
      { email: req.body.email },
      req.body.generalSub,
      { new: true }
    );
    statusCode = StatusCodes.OK;
  } else if (checkEmail && checkEmail.generalSub === true) {
    throw new BadRequestError("email already subscribed");
  } else {
    throw new BadRequestError("an error occurred");
  }

  //   Thank you for subscribing mail
  const subject = "Blog Welcome";
  await transpoter.sendMail(sendSubscriberMail(req.body.email, subject, "Welcome to the amazing blog"));
  res
    .status(statusCode)
    .json({ success: true, msg: "subscription successful" });
};

module.exports = { userGeneralSubscription };
