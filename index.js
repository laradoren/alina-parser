const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const cron = require("node-cron");
const { getParsedArticles } = require("./helpers/parse");
const articleRoutes = require("./routes/article");
const userRoutes = require("./routes/user");
const { storeAllArtciles } = require("./helpers/mongo");

//Connecting mongodb
try {
  mongoose.set("strictQuery", true);
  mongoose.connect(
    "mongodb+srv://alina:alina@cluster0.3mj6m.mongodb.net/alina?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  console.log("DB connected!");
} catch (error) {
  console.log(error);
}

//Set up server
app.use(express.json());
app.use(cors());
app.use("/api/articles", articleRoutes);
app.use("/api/user", userRoutes);
app.listen(4000, () => console.log("Server up!"));

//Declarate fucntion for parsing articles
const getArticles = async () => {
  //Parsing all articles from site  
  let articles = await getParsedArticles();
  //Save articles to mongo
  await storeAllArtciles(articles);
};

//Set up cron task - call fucntion every hour
cron.schedule("*/60 * * * *", () => {
  console.log("Updating articles...");
  getArticles();
});
