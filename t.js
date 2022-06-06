const puppeteer = require("puppeteer-core");
const moment = require("moment");
const executablePath = "/usr/bin/google-chrome";
const defaultViewport = {
  width: 1600,
  height: 900,
};
const loginBySMS = true;
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
  /*
  $(".analyse")[0].style.marginBottom = 0;
  $(".analyse")[0].style.padding = 0;
  $(".analyse+div")[0].style.padding = 0;
  $("#micro")[0].style.width = "870px";
  $(".semi-portal")[0].style.display = "none";
  */
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
  /*
  
  */
};

const takeVideoSS = async (page) => {
  const path = await page.goto(
    `${DOUYIN_DOMAIN}/creator-micro/data/stats/video`
  );
  await page.waitForSelector(".semi-table-wrapper");
  await page.waitForTimeout(1000);
  await page.$eval("#micro #root>div>div+div", (el) => {
    el.style.marginBottom = 0;
    el.style.padding = 0;
  });

  /*
  $(".creator-sidebar").hide();
  $("#micro")[0].style.width = "1280px";

  $("#micro #root>div>div").forEach((dom, i) => {
    dom.style.margin = 0;
    dom.style.padding = 0;
    if (i === 0) {
      dom.style.display = "none";
    }
    if (i === 1) {
      console.log(dom.children[1].children);
      dom.children[1].style.justifyContent = "normal";
      Array.prototype.forEach.call(dom.children[1].children, (card) => {
        card.style.margin = 0;
        card.style.height = "80px";
        card.children[0].style.padding = 0;
      });
    }
    if (i === 2) {
      dom.children[1].style.display = "none";
      dom.children[2].style.margin = 0;
      dom.children[2].style.width = "auto";
    }
  });

  $("table th, table td div").forEach((dom) => {
    dom.style.padding = 0;
  });
  */
  await page.screenshot({
    path: `${DATE_PREV}-video.png`,
    clip: {
      x: 190,
      y: 105,
      width: 1190,
      height: 720,
    },
  });
};

const takeVideoDetailSS = async (page) => {
  /*
  $(".semi-tabs-top").hide();

  $(".semi-spin-children>div").forEach((dom, i) => {
    dom.style.padding = 0;
    dom.style.margin = 0;
    if (i === 2) {
      console.log(dom.children[0]);
      dom.children[0].style.height = "56px";
      dom.children[0].style.marginTop = "-15px";
      dom.children[0].style.overflow = "hidden";
    }
    if (i === 3 || i === 4) {
      dom.children[1].style.margin = 0;
    }
    if (i === 4) {
      dom.style.zIndex = 1;
      dom.style.marginTop = "-100px";
      dom.children[1].children[1].style.marginTop = "-55px";
    }
  });
  */

  await page.screenshot({
    path: `${DATE_PREV}-video-7103.png`,
    clip: {
      x: 480,
      y: 105,
      width: 875,
      height: 800,
    },
  });
};

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint:
      "ws://127.0.0.1:32769/devtools/browser/0ba0a855-95d6-45da-9ea2-e1beb1b82913",
    defaultViewport,
  });
  const page = (await browser.pages())[2];
  // await takeOverviewSS(page);
  // await takeVideoSS(page);

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
