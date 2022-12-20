const puppeteer = require("puppeteer-core");
const { browserWSEndpoint } = require("../../tmp.json");
const { delay, clearAndInput, waitClickSelector } = require("../../utils");
const { bindingExportAndDownload } = require("./utils");

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

  await bindingExportAndDownload(page);

  await browser.disconnect();
})();
