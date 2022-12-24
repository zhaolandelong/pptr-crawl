const puppeteer = require("puppeteer-core");
const moment = require("moment");
const fs = require("fs");
const xlsx = require("node-xlsx").default;
const { browserWSEndpoint } = require("../../tmp.json");
const { buffer2Xlsx } = require("../../utils");
const {
  demo,
  orderExportAndDownload,
  activityOrderExportAndDownload,
  bindingExportAndDownload,
  agentExportAndDownload,
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

  // await orderExportAndDownload(page, ["2022-12-06", "2022-12-19"]);
  const activityData = await activityOrderExportAndDownload(page, {
    id: "2391",
    stageIndex: 2,
  });
  const bindingData = await bindingExportAndDownload(page, {});
  const agentData = await agentExportAndDownload(page, {});

  buffer2Xlsx(`summary_${moment().format("MMDDHHmm")}.xlsx`, [
    activityData,
    bindingData,
    agentData,
  ]);

  // await demo(page);
  console.timeEnd("Total");
  await browser.disconnect();
})();
