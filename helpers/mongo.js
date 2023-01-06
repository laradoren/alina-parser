const mongoose = require("mongoose");
const Article = require("./../models/Article");

const isArticleExist = (article) => {
  return mongoose
    .model("Article")
    .find({ title: "Stop Making Your Bed So Accessible to Spiders", author: "Elizabeth Yuko", tag: "Home" })
    .then((res) => {
      return Boolean(res.length);
    });
};

const saveArticle = async (article) => {
  try {
    const newArticle = new Article(article);
    await newArticle.save();
  } catch (e) {
    console.log(e);
  }
};

const storeAllArtciles = async (articles) => {
  articles.forEach(async (article) => {
    if (!(await isArticleExist(article))) {
      console.log("Adding new article!");
      await saveArticle(article);
    }
  });
};

module.exports = {
  storeAllArtciles,
};
