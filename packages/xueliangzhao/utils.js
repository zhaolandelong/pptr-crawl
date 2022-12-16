const { getCookie, delay, clearAndInput } = require("../../utils");

exports.login = async (page) => {
  await page.goto("https://edu.xlzhao.com/new-login/login");
  await page.waitForSelector(".loginBtn");
  const inputs = await page.$$(".el-input__inner");
  await clearAndInput(page, inputs[1], "15810538391");
  await page.click(".loginBtn");
};

// 订单导出
exports.orderExport = async (page) => {
  const timeRange = ["2022-12-15", "2022-12-15"];
  const typeLabels = [0];

  await page.goto("https://edu.xlzhao.com/student/order-export");

  await Promise.all([
    page.waitForResponse(
      "https://i.xlzhao.com/api/mechanismapi/order/data/export/tag"
    ),
    page.waitForResponse(
      "https://i.xlzhao.com/api/mechanismapi/shop_api_list/agent_administrator_list"
    ),
  ]);
  await delay(100);

  // 导出类型选择
  const filterLabels = await (await page.$$(".publicScreenLi"))[0].$$("li");
  console.log(filterLabels.length);
  for (let i = 0; i < typeLabels.length; i++) {
    await filterLabels[typeLabels[i]].click();
  }

  // 购买时间
  const timeInputs = await page.$$(".el-range-input");
  await timeInputs[0].focus();
  await page.keyboard.type(timeRange[0]);
  await timeInputs[1].focus();
  await page.keyboard.type(timeRange[1]);
  await page.keyboard.type("Enter");

  // 导出按钮
  await page.click("span.dis_inB");

  // 全部
  await page.click(".fieldCon>label");
  const alertBtns = await page.$$(".couponAlert button");
  await alertBtns[1].click();
};