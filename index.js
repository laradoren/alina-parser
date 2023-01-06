const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const cron = require('node-cron');
const { getParsedArticles } = require("./helpers/parse");
const articleRoutes = require("./routes/article");
const { storeAllArtciles } = require('./helpers/mongo');

try {
    mongoose.set('strictQuery', true);
    mongoose.connect(
        "mongodb+srv://alina:alina@cluster0.3mj6m.mongodb.net/alina?retryWrites=true&w=majority",
        {useNewUrlParser: true, useUnifiedTopology: true}
    );    
    console.log("DB connected!")
} catch (error) {
    console.log(error);
}


app.use(express.json());
app.use(cors());
app.use("/api/articles", articleRoutes);
app.listen(4000, () => console.log("Server up!"));


const getArticles = async () => {
    let article = await getParsedArticles();
    return article;
}

const storeArticles = async () => {
    return await storeAllArtciles();
}

//parse every hour
cron.schedule('*/60 * * * *', () => {
    console.log("EVERY MINUte??");
    let articles = getArticles();
    storeArticles(articles);
});
