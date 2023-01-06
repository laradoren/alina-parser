const mongoose = require("mongoose");
const Article = require("./../models/Article");

const isArticleExist = (article) => {
  let article = mongoose
    .model("Article")
    .find({ title: article.title, author: article.author });
  return article ? true : false;
};

const saveArticle = async (article) => {
  try {
    const article = new Article(article);
    await article.save();
  } catch (e) {
    console.log(e);
  }
};

const storeAllArtciles = async (articles) => {
  articles.forEach(async (article) => {
    if (isArticleExist(article)) {
      await saveArticle();
    }
  });
};

module.exports = {
  storeAllArtciles,
};
