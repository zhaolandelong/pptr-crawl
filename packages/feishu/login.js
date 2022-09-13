const puppeteer = require("puppeteer-core");
const path = require("path");
const { waitClickSelector, delay } = require("../../utils");
const { browserWSEndpoint } = require("../../tmp.json");

const START_INDEX = 1;

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      width: 1600,
      height: 900,
    },
  });
  const page = (await browser.pages())[0];

  await page.goto("https://tusen.feishu.cn/wiki/wikcnHgaGHrLP5Inm4sZ5u0w0Qh");
  await page.screenshot({
    path: path.resolve(__dirname, 'qr.png'),
    clip: {
      x: 442,
      y: 395,
      width: 200,
      height: 200,
    },
  });
  
  await browser.disconnect();
})();
