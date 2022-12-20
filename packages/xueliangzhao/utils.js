const fs = require("fs");
const moment = require("moment");
const {
  delay,
  clearAndInput,
  waitPathResponse,
  serviceDownload,
  csv2xlsx,
  readWriteFileByLineWithProcess,
} = require("../../utils");

exports.login = async (page) => {
  await page.goto("https://edu.xlzhao.com/new-login/login");
  await page.waitForSelector(".loginBtn");
  const inputs = await page.$$(".el-input__inner");
  await clearAndInput(page, inputs[1], "");
  await page.click(".loginBtn");
};

// 导出订单并下载
exports.orderExportAndDownload = async (
  page,
  timeRange = [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
) => {
  const filePath = `order_${timeRange.join("_").replaceAll("-", "")}.csv`;
  const typeLabels = [0];

  await Promise.all([
    page.goto("https://edu.xlzhao.com/student/order-export"),
    waitPathResponse(page, "/api/mechanismapi/order/data/export/tag"),
    waitPathResponse(
      page,
      "/api/mechanismapi/shop_api_list/agent_administrator_list"
    ),
  ]);
  await delay(100);

  // 导出类型选择
  const filterLabels = await (await page.$$(".publicScreenLi"))[0].$$("li");
  for (let i = 0; i < typeLabels.length; i++) {
    await filterLabels[typeLabels[i]].click();
  }

  // 购买时间
  const timeInputs = await page.$$(".el-range-input");
  await timeInputs[0].focus();
  await page.keyboard.type(timeRange[0]);
  await timeInputs[1].focus();
  await page.keyboard.type(timeRange[1]);
  await page.keyboard.press("Enter");

  // 导出按钮
  await page.click("span.dis_inB");

  // 全部
  await page.click(".fieldCon>label");
  const alertBtns = await page.$$(".couponAlert button");
  await alertBtns[1].click();

  // Download
  let canDownload = false;
  const pageBtns = await page.$$(".pagination_page");

  let fileUrl;
  while (!canDownload) {
    await pageBtns[3].click();
    await delay(2000);
    await pageBtns[2].click();
    const res = await waitPathResponse(
      page,
      "/api/mechanismapi/order/data/export/index/order"
    );
    const data = await res.json();
    if (data.data.data[0].status === 1) {
      canDownload = true;
      fileUrl = data.data.data[0].file_url;
    }
  }

  await serviceDownload(fileUrl, filePath);

  csv2xlsx(filePath);
};

// 调整订单
exports.orderTrim = async (page) => {
  const timeRange = ["2022-12-15", "2022-12-15"];

  await page.goto("https://edu.xlzhao.com/student/order-trim-export");
  await waitPathResponse(
    page,
    "/api/mechanismapi/order/data/export/index/adjustment"
  );

  // 导出时间
  const timeInputs = await page.$$(".el-range-input");
  await timeInputs[0].focus();
  await page.keyboard.type(timeRange[0]);
  await timeInputs[1].focus();
  await page.keyboard.type(timeRange[1]);
  await page.keyboard.press("Enter");

  await page.click(".publicInputBtn button");

  // 全部
  await page.waitForSelector(".couponAlert");
  await page.click(".fieldCon>label");
  const alertBtns = await page.$$(".couponAlert button");
  await alertBtns[1].click();
};

exports.bindingExportAndDownload = async (
  page,
  timeRange = ["2021-07-01", moment().format("YYYY-MM-DD")]
) => {
  const filePath = `binding_${timeRange.join("_").replaceAll("-", "")}.csv`;
  const tmpFilePath = `tmp_${filePath}`;
  await Promise.all([
    page.goto("https://edu.xlzhao.com/nexus/binding-export"),
    waitPathResponse(page, "/api/mechanismapi/order/data/export/index/binDing"),
  ]);

  // 绑定时间
  const timeInputs = await page.$$(".el-range-input");
  await timeInputs[0].focus();
  await page.keyboard.type(timeRange[0]);
  await timeInputs[1].focus();
  await page.keyboard.type(timeRange[1]);
  await page.keyboard.press("Enter");

  // 全部
  await page.click(".exportBtn>button");
  await page.waitForSelector(".couponAlert");
  await page.click(".fieldCon>label");
  const alertBtns = await page.$$(".couponAlert button");
  await alertBtns[1].click();

  // Download
  let canDownload = false;
  const pageBtns = await page.$$(".pagination_page");

  let fileUrl;
  while (!canDownload) {
    await pageBtns[3].click();
    await delay(2000);
    await pageBtns[2].click();
    const res = await waitPathResponse(
      page,
      "/api/mechanismapi/order/data/export/index/binDing"
    );
    const data = await res.json();
    if (data.data.data[0].status === 1) {
      canDownload = true;
      fileUrl = data.data.data[0].file_url;
    }
  }

  await serviceDownload(fileUrl, tmpFilePath);

  await readWriteFileByLineWithProcess(tmpFilePath, filePath, (line, i) => {
    if (i === 0) {
      return line.slice(0, -1);
    }
    return line;
  });

  fs.unlinkSync(tmpFilePath);

  csv2xlsx(filePath);
};

exports.activityOrder = async (page, id = "2381", stageIndex = 2) => {
  const [, res] = await Promise.all([
    page.goto(`https://edu.xlzhao.com/activity/export-order?id=${id}`),
    waitPathResponse(page, "/api/mechanismapi/teacher_stage/api_list"),
    waitPathResponse(page, "/api/mechanismapi/teacher_class_type/api_list"),
  ]);

  const stageRes = await res.json();
  const stage = stageRes.data[stageIndex - 1].stage;

  const filePath = `activity_${id}_${stage}.csv`;

  const filterStages = await page.$$("#stageId>li");
  await filterStages[stageIndex].click();

  await page.click(".exportBtn>button");
  await page.waitForSelector(".couponAlert");
  await page.click(".fieldCon>label");
  const alertBtns = await page.$$(".couponAlert button");
  await alertBtns[1].click();

  // Download
  let canDownload = false;
  const pageBtns = await page.$$(".pagination_page");

  let fileUrl;
  while (!canDownload) {
    await pageBtns[3].click();
    await delay(2000);
    await pageBtns[2].click();
    const res = await waitPathResponse(
      page,
      "/api/mechanismapi/order/data/export/index/activityOrder"
    );
    const data = await res.json();
    if (data.data.data[0].status === 1) {
      canDownload = true;
      fileUrl = data.data.data[0].file_url;
    }
  }

  await serviceDownload(fileUrl, filePath);

  csv2xlsx(filePath);
};

exports.demo = async (page) => {
  await readWriteFileByLineWithProcess(
    "./test.csv",
    "./test.csv",
    (line, i) => {
      if (i === 0) {
        return line.slice(0, -1);
      }
      return line;
    }
  );
  // csv2xlsx("./binding_20200701_20221221.csv");
};
