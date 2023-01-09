const Article = require("../models/articleModel");
const SubUser = require("../models/subscribedUsers")
const dayjs = require("dayjs");
const ejs = require("ejs")
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

  const thisWeeksArticle = [];
  articles.forEach((article) => {
    if (dayjs(article.createdAt).isAfter(prevNewsLetter)) {
      thisWeeksArticle.push(article);
    }
  });

  ejs.render("")

  return thisWeeksArticle;
};

const generalSubscribersMail = async () => {
  return await SubUser.find({ generalSub: true }, "email");
}

// cron.schedule("* * * * *", async () => {
//   console.log("running a task every minute");
//   const subject = "Weekly newsletter from Shazzar";
//   await transporter.sendMail(
//     mailDetails(
//       generalSubscribersMail(),
//       subject,
//       "<h3>Welcome to the amazing blog</h3>"
//     )
//   );
// });

/* Steps 
    Get top 20 most liked or commented-on articles from saturday (Exact time when last newsletter was published to date.now)
    {title, likes, comments}

    Get emails of subscribed users with general sub == true

    create email template
    Send mail on saturdays by 6pm
*/

module.exports = {
  newsletter,
};
