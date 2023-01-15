const Article = require("../models/articleModel");
const SubUser = require("../models/subscribedUsers");
const dayjs = require("dayjs");
const ejs = require("ejs");
const cron = require("node-cron");
const { mailDetails } = require("../config/email.config");

const newsletter = async () => {
  const prevNewsLetter = dayjs().subtract(7, "day");
  const articles = await Article.find(
    {},
    "_id title authorName likes createdAt"
  )
    .limit(100)
    .skip(0)
    .sort({
      createdAt: -1,
    });

  const thisWeeksArticles = [];
  articles.forEach((article) => {
    if (dayjs(article.createdAt).isAfter(prevNewsLetter)) {
      const date = new Date(article.createdAt);
      article.created = date.toDateString();
      article.url = `${process.env.BASE_URL}/api/v1/article/${article._id}`;
      thisWeeksArticles.push(article);
    }
  });

  return await ejs.renderFile("./views/newsLetterEmailTemp.ejs", {
    articles: thisWeeksArticles,
  });
};

const generalSubscribersMail = async () => {
  const genSubUSersMail = [];
  const genSubUsers = await SubUser.find({ generalSub: true }, "email");

  genSubUsers.forEach((user) => genSubUSersMail.push(user.email));
  return genSubUSersMail;
};

// https://crontab.guru/#*_*_*_*_*
cron.schedule("0 18 * * 6", async () => {
  console.log("running a task at specified time");
  const subject = "Weekly newsletter from Shaz Blog";
  const recipients = await generalSubscribersMail();
  const htmlFile = await newsletter();
  mailDetails(recipients, subject, htmlFile);
});

module.exports = {
  newsletter,
  generalSubscribersMail,
};
