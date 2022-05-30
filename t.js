const puppeteer = require("puppeteer-core");
const executablePath = "/usr/bin/google-chrome";
const defaultViewport = {
  width: 1600,
  height: 900,
};
const loginBySMS = true;
const phone = "15810538391";
const DOUYIN_DOMAIN = "https://creator.douyin.com";
const DOUJIA_DOMAIN = "https://doujia.douyin.com";

const waitClickSelector = async (page, selector) => {
  await page.waitForSelector(selector);
  await page.click(selector);
};

const takeOverviewSS = async (page) => {
  await page.goto(`${DOUYIN_DOMAIN}/creator-micro/data/stats/overview`);
  await page.waitForSelector("canvas");
  await page.waitForTimeout(1000);
  await page.$eval(".analyse", (el) => {
    el.style.marginBottom = 0;
    el.style.padding = 0;
  });
  await page.$eval(".analyse+div", (el) => {
    el.style.padding = 0;
  });
  await page.$eval("#micro", (el) => {
    el.style.width = "870px";
  });
  await page.$eval(".semi-portal", (el) => {
    el.style.display = "none";
  });
  await page.screenshot({
    path: "overview.png",
    clip: {
      x: 460,
      y: 110,
      width: 870,
      height: 870,
    },
  });
  await page.screenshot({
    path: "overview.png",
    clip: {
      x: 460,
      y: 110,
      width: 870,
      height: 870,
    },
  });
};

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint:
      "ws://127.0.0.1:32935/devtools/browser/674c95ce-1923-4ec6-986f-cdbc324fbc87",
    defaultViewport,
  });
  const page = (await browser.pages())[1];
  await takeOverviewSS(page);
  // await page.$eval(".analyse", (el) => {
  //   el.style.marginBottom = 0;
  //   el.style.padding = 0;
  // });
  // await page.$eval(".analyse+div", (el) => {
  //   el.style.padding = 0;
  // });
  // await page.$eval("#micro", (el) => {
  //   el.style.width = "870px";
  // });
  // await page.$eval(".semi-portal", (el) => {
  //   el.style.display = "none";
  // });
  // await page.screenshot({
  //   path: "overview.png",
  //   clip: {
  //     x: 460,
  //     y: 110,
  //     width: 870,
  //     height: 870,
  //   },
  // });
  return;
  await page.goto(
    "https://creator.douyin.com/creator-micro/data/stats/overview"
  );
  console.log(1);
  // await page.waitForResponse(
  //   "https://creator.douyin.com/aweme/v1/creator/data/overview/option/"
  // );
  await page.waitForSelector("canvas");
  console.log(2);
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "overview.png",
    clip: {
      x: 480,
      y: 130,
      width: 895,
      height: 950,
    },
  });

  // await browser.close();
})();
