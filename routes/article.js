const router = require("express").Router();
const articleController = require("./../controllers/articleController");

router.post("/", articleController.createArticle);
router.delete("/:articleId", articleController.deleteArticle);
router.get("/", articleController.getAllArticles);
router.get("/:articleId", articleController.getArticle);
router.put("/:articleId", articleController.updateArticle);

module.exports = router;