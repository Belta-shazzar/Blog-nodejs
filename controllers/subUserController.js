const SubUser = require("../models/subscribedUsers");
const { mailDetails } = require("../config/email.config");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const { newsletter } = require("../service/subUserService")
const { getAuthorById, addSubUser } = require("./userController");

// req.body only contains email
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
      { generalSub: true },
      { new: true }
    );
    statusCode = StatusCodes.OK;
  } else if (checkEmail && checkEmail.generalSub === true) {
    throw new BadRequestError("email already subscribed");
  } else {
    throw new BadRequestError("an error occurred");
  }

  const htmlFile ="<h1>Hello new subscriber</h1>"; //Come back
  const subject = "Blog Welcome";
  mailDetails(req.body.email, subject, htmlFile);

  res
    .status(statusCode)
    .json({ success: true, msg: "subscription successful" });
};

// req.body contains email and author's ID
const subscribeToAnAuthor = async (req, res) => {
  // Add email validation
  const subscribedEmail = req.body.email;
  const authorId = req.body.authorId;
  const checkEmail = await SubUser.findOne({ email: subscribedEmail });
  await getAuthorById(authorId);

  if (checkEmail) {
    checkEmail.authorSubscription.forEach((id) => {
      if (id === authorId) {
        throw new BadRequestError("already subscribed to this author");
      }
    });
    checkEmail.authorSubscription.push(authorId);

    await checkEmail.save();
  } else {
    const subUser = await SubUser.create({
      email: subscribedEmail,
      authorSubscription: [authorId],
    });
  }
  const authorName = await addSubUser(authorId, subscribedEmail);

  res
    .status(200)
    .json({ msg: `${subscribedEmail} is now subscribed to ${authorName}.` });
};

module.exports = { userGeneralSubscription, subscribeToAnAuthor };
