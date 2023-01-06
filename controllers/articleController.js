const Article = require("./../models/Article");

const getAllArticles = async (req, res) => {
  const sorters = prepareSorters(req.query.sortBy, req.query.sortOrder);
  const page = preparePage(req.query.index);
  let query = prepareQuery(req.query.filter, req.query.search);
  try {
    const totalArticles = await Article.find(query);
    const articles = await Article.find(query)
      .skip(page.index * page.size)
      .limit(page.size)
      .sort(sorters);
    res.json({articles, total: totalArticles.length});
  } catch (error) {
    res.json({ message: error });
  }
};

const prepareSorters = (sortBy, sortOrder) => {
  let sorters = {};
  if (sortBy && sortOrder) {
    sorters[sortBy] = sortOrder;
  }
  return sorters;
};

const prepareQuery = (dtoInFilter = '', dtoInSearch = '') => {
  let query = {};
  if (dtoInFilter) {
    query.tag = dtoInFilter;
  }
  if (Object.keys(dtoInSearch).length) {
    query = {
      $or: [
        {
          title: new RegExp(dtoInSearch, "i"),
        },
        {
          author: new RegExp(dtoInSearch, "i"),
        },
      ],
    };
  }

  return query;
};

const preparePage = (index) => {
  const page = {
    index: 0,
    size: 10,
  };

  if(index) {
    page.index = index;
  }

  return page;
};

const getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);
    res.json(article);
  } catch (error) {
    res.json({ message: error });
  }
};

const createArticle = async (req, res) => {
  const article = new Article({
    title: req.body.title,
    image: req.body.image,
    tag: req.body.tag,
    author: req.body.author,
  });
  try {
    const articles = await article.save();
    res.send(articles);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.articleId);
    res.json(article);
  } catch (error) {
    res.json({ message: error });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = {
      title: req.body.title,
      image: req.body.image,
      tag: req.body.tag,
      author: req.body.author,
    };
    const updatedArticle = await Article.findByIdAndUpdate(
      { _id: req.params.articleId },
      article
    );
    res.send(updatedArticle);
  } catch (error) {
    res.json({ message: error });
  }
};

module.exports = {
  getAllArticles,
  getArticle,
  createArticle,
  deleteArticle,
  updateArticle,
};
