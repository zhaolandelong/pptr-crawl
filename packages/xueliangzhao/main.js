const puppeteer = require("puppeteer-core");
const { browserWSEndpoint } = require("../../tmp.json");
const { delay, clearAndInput, waitClickSelector } = require("../../utils");
const {
  orderExportAndDownload,
  activityOrderExportAndDownload,
  bindingExportAndDownload,
} = require("./utils");

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
  console.time("Total");

  await orderExportAndDownload(page, ["2022-12-06", "2022-12-19"]);
  await activityOrderExportAndDownload(page, "2381", 2);
  await bindingExportAndDownload(page);

  console.timeEnd("Total");
  await browser.disconnect();
})();
