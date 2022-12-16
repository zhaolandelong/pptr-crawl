const puppeteer = require("puppeteer-core");
const { browserWSEndpoint } = require("../../tmp.json");
const { delay, clearAndInput, waitClickSelector } = require("../../utils");
const { orderExport } = require("./utils");

(async () => {
  console.log("Time is:", Date());
  const browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      width: 1600,
      height: 900,
    },
  });
  const page = (await browser.pages())[0];

  await orderExport(page);

  // while (true) {
  //   await page.goto("https://xtrade.newone.com.cn/npctrade#/trade/ptjy/mm");
  //   await delay(60000);
  //   await page.goto("https://xtrade.newone.com.cn/npctrade#/trade/ptjy/zjgf");
  //   await delay(60000);
  // }

  // const token = await getToken(page);

  

  await browser.disconnect();
})();
