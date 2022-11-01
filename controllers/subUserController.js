const SubUser = require("../models/subscribedUsers");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const userGeneralSubscription = async (req, res) => {
  const checkEmail = await SubUser.findOne({ email: req.body.email });
  req.body.generalSub = true;
  let subUsers;
  let statusCode;

  if (!checkEmail) {
    subUsers = await SubUser.create(req.body);
    statusCode = StatusCodes.CREATED;
  } else if (checkEmail && checkEmail.generalSub === false) {
    subUsers = await SubUser.findOneAndUpdate(
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
  res
    .status(statusCode)
    .json({ success: true, msg: "subscription successful" });
};

module.exports = { userGeneralSubscription };
