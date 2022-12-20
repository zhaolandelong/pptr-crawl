const puppeteer = require("puppeteer-core");
const { browserWSEndpoint } = require("../../tmp.json");
const { delay, clearAndInput, waitClickSelector } = require("../../utils");
const { orderExportAndDownload } = require("./utils");

(async () => {
  console.log("Time is:", Date());
  const browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      width: 1200,
      height: 675,
    },
  });
  const page = (await browser.pages())[0];

  await orderExportAndDownload(page);

  await browser.disconnect();
})();
