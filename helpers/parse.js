const cherio = require("cherio");
const puppeteer = require("puppeteer");
const BASE_URI = "https://lifehacker.com";

const LAUNCH_PUPPETER_OPTIONS = {
  args: [
    "--no-sandbox",
    "--disable-setupid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--disable-setupid-sandbox",
    "--disable-gpu",
    "--windows-size=1920x1000",
  ],
};

const PAGE_PUPPETER_OPTIONS = {
  networkIdle2Timeout: 5000,
  waitUntil: "networkidle2",
  timeout: 3000000,
};

async function getParsedArticles() {
  const articles = [];
  try {
    const browser = await puppeteer.launch(LAUNCH_PUPPETER_OPTIONS);
    const page = await browser.newPage();
    await page.goto(BASE_URI, PAGE_PUPPETER_OPTIONS);
    const content = await page.content();
    browser.close();
    const $ = cherio.load(content);
    $("article").each((i, header) => {
      let item = {};
      item.image = $("img", header).attr("data-srcset");
      item.tag = $(".sc-1hjwdsc-0", header).text();
      item.title = $(".sc-1pw4fyi-5", header).text();
      item.author = $(".sc-1mep9y1-0", header).text();
      articles.push(item);
    });
    // articles.map(async (article) => {
    //     let newArticle = await Article.create({
    //         id: article.id,
    //         image: article.image,
    //         tag: article.tag,
    //         title: article.title,
    //         author: article.author
    //     });
    // });
    //console.log(articles);
  } catch (e) {
    console.log(e);
  }
  return articles;
}

module.exports = {
  getParsedArticles,
};
