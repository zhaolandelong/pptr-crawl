const {
  getDate,
  delay,
  clearAndInput,
  waitPathResponse,
} = require("../../utils");

exports.login = async (page) => {
  await page.goto("https://edu.xlzhao.com/new-login/login");
  await page.waitForSelector(".loginBtn");
  const inputs = await page.$$(".el-input__inner");
  await clearAndInput(page, inputs[1], "");
  await page.click(".loginBtn");
};

// 订单导出
exports.orderExport = async (page) => {
  const timeRange = ["2022-12-15", "2022-12-15"];
  const typeLabels = [0];

  await page.goto("https://edu.xlzhao.com/student/order-export");

  await Promise.all([
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

exports.bindingExport = async (page) => {
  await page.goto("https://edu.xlzhao.com/nexus/binding-export");
  await waitPathResponse(
    page,
    "/api/mechanismapi/order/data/export/index/binDing"
  );

  // 绑定时间
  const timeInputs = await page.$$(".el-range-input");
  await timeInputs[0].focus();
  await page.keyboard.type("2021-7-1");
  await timeInputs[1].focus();
  await page.keyboard.type(getDate());
  await page.keyboard.press("Enter");

  // 全部
  await page.click(".exportBtn>button");
  await page.waitForSelector(".couponAlert");
  await page.click(".fieldCon>label");
  const alertBtns = await page.$$(".couponAlert button");
  await alertBtns[1].click();
};

exports.activityOrder = async (page) => {
  const id = "2381";
  const stageIndex = 2;
  await page.goto(`https://edu.xlzhao.com/activity/export-order?id=${id}`);
  await Promise.all([
    waitPathResponse(page, "/api/mechanismapi/teacher_stage/api_list"),
    waitPathResponse(page, "/api/mechanismapi/teacher_class_type/api_list"),
    waitPathResponse(
      page,
      "/api/mechanismapi/order/data/export/index/activityOrder"
    ),
  ]);

  const filterStages = await page.$$("#stageId>li");
  await filterStages[stageIndex].click();

  await page.click(".exportBtn>button");
  await page.waitForSelector(".couponAlert");
  await page.click(".fieldCon>label");
  const alertBtns = await page.$$(".couponAlert button");
  await alertBtns[1].click();
};
