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
    //Set up puppeteer
    const browser = await puppeteer.launch(LAUNCH_PUPPETER_OPTIONS);
    const page = await browser.newPage();
    await page.goto(BASE_URI, PAGE_PUPPETER_OPTIONS);
    const content = await page.content();
    browser.close();
    //Loading all contest
    const $ = cherio.load(content);
    //Fing all article content
    $("article").each((i, header) => {
      let item = {};
      //Preparing data
      item.image = $("img", header).attr("srcset");
      if(!item.image) {
        item.image = $("img", header).attr("data-srcset");
      }
      item.tag = $(".sc-1hjwdsc-0", header).text();
      item.title = $("h4", header).text();
      item.author = $(".sc-1mep9y1-0", header).text();
      if(item.title && item.tag) {
        //Push data to array if this data don`t already exist in articles
        let articlesAlreadyExist = articles.find(article => article.title === item.title); 
        if(!articlesAlreadyExist) {
            articles.push(item);
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
  return articles;
}

module.exports = {
  getParsedArticles,
};
