const Article = require("./../models/Article");

const getAllArticles = async (req, res) => {
  const sorters = prepareSorters(req.body.sorter);
  const page = preparePage(req.body.page);
  let query = prepareQuery(req.body.filters, req.body.search);

  try {
    const articles = await Article.find(query)
      .skip(page.index * page.size)
      .limit(page.size)
      .sort(sorters);
    res.json(articles);
  } catch (error) {
    res.json({ message: error });
  }
};

const prepareSorters = (dtoInSorter) => {
  let sorters = {};
  if (dtoInSorter && Object.keys(dtoInSorter).length) {
    if (dtoInSorter.title) {
      sorter.title = dtoInSorter.title;
    }
    if (dtoInSorter.tag) {
      sorter.tag = dtoInSorter.tag;
    }
    if (dtoInSorter.author) {
      sorter.author = dtoInSorter.author;
    }
  }
  return sorters;
};

const prepareQuery = (dtoInFilter = {}, dtoInSearch = {}) => {
  let query = {};
  if (dtoInFilter.title) {
    query.title = dtoInFilter.title;
  }
  if (dtoInFilter.tag) {
    query.tag = dtoInFilter.tag;
  }
  if (dtoInFilter.author) {
    query.author = dtoInFilter.author;
  }

  if (dtoInSearch) {
    query = {
      $or: [
        {
          title: {
            $in: [query.title || [], new RegExp(dtoInSearch, "i")].flat(),
          },
        },
        {
          tag: {
            $in: [query.tag || [], new RegExp(dtoInSearch, "i")].flat(),
          },
        },
        {
          author: {
            $in: [query.author || [], new RegExp(dtoInSearch, "i")].flat(),
          },
        },
      ],
    };
  }

  return query;
};

const preparePage = (dtoInPage) => {
  const page = {
    index: 0,
    size: 10,
  };

  if (dtoInPage && Object.keys(dtoInPage).length) {
    if (req.body.page.index) {
      page.index = dtoInPage.index;
    }
    if (req.body.page.size) {
      page.size = dtoInPage.size;
    }
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
