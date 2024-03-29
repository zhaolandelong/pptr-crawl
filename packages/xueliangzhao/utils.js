const moment = require("moment");
const {
  delay,
  clearAndInput,
  waitPathResponse,
  serviceDownload,
  convert2XlsxBuffer,
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
  const downloadPath = `order_${moment(timeRange[0]).format("MMDD")}_${moment(
    timeRange[1]
  ).format("MMDD")}_${moment().format("MMDDHHmm")}.csv`;
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
  // await alertBtns[0].click(); // cancel

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

  await serviceDownload(fileUrl, downloadPath);

  return {
    name: `order_${moment(timeRange[0]).format("MMDD")}_${moment(
      timeRange[1]
    ).format("MMDD")}`,
    data: await convert2XlsxBuffer(downloadPath, {
      callback: (arr, i) => {
        // if (i > 0) {
        //   arr[10] = moment(arr[10]).subtract(43, "s").toDate();
        // }
        return arr;
      },
    }),
  };
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
  // await alertBtns[0].click(); // cancel
};

exports.bindingExportAndDownload = async (page, options = {}) => {
  const {
    downloadPath = `binding_${moment().format("MMDDHHmm")}.csv`,
    xlsxPath = downloadPath.replace(/\.\w+$/, ".xlsx"),
    timeRange = ["2021-07-01", moment().format("YYYY-MM-DD")],
  } = options;

  const headLabels = [0, 6, 12];

  await Promise.all([
    page.goto("https://edu.xlzhao.com/nexus/binding-export"),
    waitPathResponse(page, "/api/mechanismapi/order/data/export/index/binDing"),
  ]);

  // 绑定时间
  const timeInputs = await page.$$(".ivu-input-with-suffix");
  await timeInputs[0].focus();
  await page.keyboard.type(`${timeRange[0]} - ${timeRange[1]}`);
  await page.keyboard.press("Enter");
  
  const radios = await page.$$(".el-radio__original");
  await radios[0].click();
  
  // 全部
  await page.click(".exportBtn>button");
  await page.waitForSelector(".couponAlert");

  const labels = await page.$$(".fieldCon label");

  for (let i = 0; i < headLabels.length; i++) {
    await labels[headLabels[i]].click();
  }

  const alertBtns = await page.$$(".couponAlert button");
  await alertBtns[1].click();
  // await alertBtns[0].click(); // cancel

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

  await serviceDownload(fileUrl, downloadPath);

  return {
    name: `binding_${moment(timeRange[0]).format("MMDD")}_${moment(
      timeRange[1]
    ).format("MMDD")}`,
    data: await convert2XlsxBuffer(downloadPath, {
      callback: (arr, i) => {
        if (i > 0) {
          arr[10] = moment(arr[10]).subtract(43, "s").toDate();
        }
        return arr;
      },
    }),
  };
};

exports.activityOrderExportAndDownload = async (page, options = {}) => {
  const {
    id = "2381",
    stageIndex = 2,
    downloadPath = `activity_${moment().format("MMDDHHmm")}.csv`,
    xlsxPath = downloadPath.replace(/\.\w+$/, ".xlsx"),
  } = options;
  const headLabels = [0, 8, 9, 12, 13, 14, 22, 23, 24, 25, 26, 27, 28, 29];

  const [, res] = await Promise.all([
    page.goto(`https://edu.xlzhao.com/activity/export-order?id=${id}`),
    waitPathResponse(page, "/api/mechanismapi/teacher_stage/api_list"),
    waitPathResponse(page, "/api/mechanismapi/teacher_class_type/api_list"),
  ]);

  const stageRes = await res.json();
  const stage = stageRes.data[stageIndex - 1].stage;

  const filterStages = await page.$$("#stageId>li");
  await filterStages[stageIndex].click();

  await page.click(".exportBtn>button");
  await page.waitForSelector(".couponAlert");

  const labels = await page.$$(".fieldCon label");

  for (let i = 0; i < headLabels.length; i++) {
    await labels[headLabels[i]].click();
  }

  const alertBtns = await page.$$(".couponAlert button");
  await alertBtns[1].click();
  // await alertBtns[0].click(); // cancel

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

  await serviceDownload(fileUrl, downloadPath);

  return {
    name: `activity_${id}_${stage}`,
    data: await convert2XlsxBuffer(downloadPath, {
      callback: (arr, i) => {
        if (i > 0) {
          arr[0] = moment(arr[0]).subtract(43, "s").toDate();
        }
        return arr;
      },
    }),
  };
};

exports.agentExportAndDownload = async (page, options = {}) => {
  const {
    downloadPath = `agent_${moment().format("MMDDHHmm")}.csv`,
    xlsxPath = downloadPath.replace(/\.\w+$/, ".xlsx"),
    timeRange = ["2021-07-01", moment().format("YYYY-MM-DD")],
  } = options;
  await Promise.all([
    page.goto("https://edu.xlzhao.com/agent/agent-export"),
    waitPathResponse(page, "/api/mechanismapi/mechanism_agent_config/api_list"),
    waitPathResponse(
      page,
      "/api/mechanismapi/order/data/export/index/mechanismAgent"
    ),
  ]);

  // 绑定时间
  const timeInputs = await page.$$(".ivu-input-with-suffix");
  await timeInputs[0].focus();
  await page.keyboard.type(`${timeRange[0]} - ${timeRange[1]}`);
  await page.keyboard.press("Enter");
  await delay(200);
  // 未冻结
  const lis = await page.$$(".publicScreenLi");
  const statLabels = await lis[2].$$("li");
  await statLabels[1].click();
  await delay(200);
  await page.click(".exportBtn");

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
      "/api/mechanismapi/order/data/export/index/mechanismAgent"
    );
    const data = await res.json();
    if (data.data.data[0].status === 1) {
      canDownload = true;
      fileUrl = data.data.data[0].file_url;
    }
  }

  await serviceDownload(fileUrl, downloadPath);

  return {
    name: `agent_${moment(timeRange[0]).format("MMDD")}_${moment(
      timeRange[1]
    ).format("MMDD")}`,
    data: await convert2XlsxBuffer(downloadPath, {
      callback: (arr, i) => {
        if (arr[15] === "冻结") {
          return null;
        }
        arr.splice(5, 2);
        arr.splice(8, 4);
        if (i > 0) {
          arr[8] = moment(arr[8]).subtract(43, "s").toDate();
        }
        return arr;
      },
    }),
  };
};

exports.demo = async (page) => {};
