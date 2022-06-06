const puppeteer = require("puppeteer-core");
const moment = require("moment");
const executablePath = "/usr/bin/google-chrome";
const defaultViewport = {
  width: 1600,
  height: 900,
};
const loginBySMS = false;
const phone = "15810538391";
const DOUYIN_DOMAIN = "https://creator.douyin.com";
const DOUJIA_DOMAIN = "https://doujia.douyin.com";
const DATE_PREV = moment().format("YYMMDD");

const waitClickSelector = async (page, selector) => {
  await page.waitForSelector(selector);
  await page.click(selector);
};

const takeOverviewSS = async (page) => {
  const path = await page.goto(
    `${DOUYIN_DOMAIN}/creator-micro/data/stats/overview`
  );
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
    path: `${DATE_PREV}-overview.png`,
    clip: {
      x: 455,
      y: 105,
      width: 880,
      height: 880,
    },
  });
};

const takeFansSS = async (page) => {
  await page.goto(
    `${DOUYIN_DOMAIN}/creator-micro/data/stats/follower/portrait`
  );
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "fans.png",
    clip: {
      x: 480,
      y: 130,
      width: 895,
      height: 950,
    },
  });
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
    defaultViewport,
    args: ["--start-maximized"],
  });
  console.log("Browser wsEndpoint is: ", browser.wsEndpoint());
  const page = await browser.newPage();
  await page.goto(DOUYIN_DOMAIN);
  await waitClickSelector(page, ".login");
  await waitClickSelector(page, ".semi-button-primary");
  if (loginBySMS) {
    await waitClickSelector(page, ".semi-tabs-tab[aria-selected=false]");
    await page.type(".semi-input-large", phone);
    await waitClickSelector(page, ".agreement>img");
    await waitClickSelector(page, ".semi-input-suffix");
  }

  // goto home page
  await page.waitForNavigation({ timeout: 0 });
  // start modal
  await waitClickSelector(page, ".semi-modal-body>button");
  // guide
  await waitClickSelector(page, "#root");
  await waitClickSelector(page, "#root");

  // overview screenshot
  await takeOverviewSS(page);
  // fans screenshot
  await takeFansSS(page);
  return;
  // videos screenshot
  await page.goto(`${DOUYIN_DOMAIN}/creator-micro/data/stats/video`);
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "videos.png",
    clip: {
      x: 480,
      y: 130,
      width: 895,
      height: 950,
    },
  });

  // DOU+
  await page.goto(`${DOUJIA_DOMAIN}/login`);
})();
