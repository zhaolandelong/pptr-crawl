const puppeteer = require("puppeteer-core");
const { browserWSEndpoint } = require("../../tmp.json");
const { delay, clearAndInput, waitClickSelector } = require("../../utils");
const { activityOrder } = require("./utils");

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

  await activityOrder(page);

  await browser.disconnect();
})();
