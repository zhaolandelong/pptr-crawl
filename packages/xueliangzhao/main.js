const puppeteer = require("puppeteer-core");
const moment = require("moment");
const { browserWSEndpoint } = require("../../tmp.json");
const {
  delay,
  clearAndInput,
  waitClickSelector,
  composeXlsx2Sheets,
} = require("../../utils");
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

  const suffix = `${moment().format("MMDDHHmm")}.xlsx`;
  const paths = [`activity_${suffix}`, `binding_${suffix}`, `agent_${suffix}`];

  // await orderExportAndDownload(page, ["2022-12-06", "2022-12-19"]);
  await activityOrderExportAndDownload(page, {
    id: "2391",
    stageIndex: 2,
    xlsxPath: paths[0],
  });
  await bindingExportAndDownload(page, {
    xlsxPath: paths[1],
  });
  await agentExportAndDownload(page, {
    xlsxPath: paths[2],
  });

  // composeXlsx2Sheets(paths, `summary_${suffix}`);

  // await demo(page);
  console.timeEnd("Total");
  await browser.disconnect();
})();
