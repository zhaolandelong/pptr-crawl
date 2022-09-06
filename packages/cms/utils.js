const inquirer = require('inquirer');
const path = require('path');
const config = require("./config.json");
const { getCookie, delay, clearAndInput } = require("../../utils");
/**
 *
 * @param {*} type 1-sell，2-buy
 * @param {*} page
 * @param {*} token
 * @param {*} payload
 * gdzh: "0183916067", // 股东代码
 * zqdm: "000063", // 股票代码
 * wtsl: "200", // 数量
 * wtjg: "12.5", // 价格
 * sjwtbz: "0", // 报价 0-限价，1-对手方最优，2-本方最优，3-最优五档即时成交剩余撤销，4-即时成交剩余撤销，5-全额成交或撤销
 * @returns
 * {
  "content": {
    "applyResult": [
      {
        "dmzxsj": "5",
        "hth": "287",
        "bphth": "F10000005K",
        "xxbzc": "0",
        "sjjyrq": "20220902",
        "sfjsjyr": "Y"
      }
    ]
  },
  "success": true,
  "code": "000000",
  "message": "",
  "cookie": null,
  "cmst_bmps": null,
  "cmst_smps": null
}

 */
const tradeByRequest = (type, page, token, payload) => {
  let gdzh = config.gddm2;
  let scdm = 2;
  if (String(payload.zqdm).startsWith("6")) {
    gdzh = config.gddm1;
    scdm = 1;
  }
  return page.evaluate(
    (token, type, payload, gdzh, scdm) => {
      return fetch(
        `https://xtrade.newone.com.cn/capi/${
          type === 1 ? "gp_buy" : "gp_sell"
        }`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: Object.entries({
            // ywqrxx:
            // tjrdm:
            jytoken: token,
            scdm,
            gdzh,
            ...payload,
          })
            .map(([key, value]) => key + "=" + value)
            .join("&"),
        }
      ).then((res) => res.json());
    },
    token,
    type,
    payload,
    gdzh,
    scdm
  );
};

exports.buy = (page, token, payload) => tradeByRequest(1, page, token, payload);

exports.sell = (page, token, payload) =>
  tradeByRequest(2, page, token, payload);

exports.getToken = (page) => getCookie(page, "cms_token");

exports.login = async (page) => {
  await page.goto("https://xtrade.newone.com.cn/ssologin");
  await page.waitForSelector(".vcode-btn");
  await page.screenshot({
    path: path.resolve(__dirname, 'vcode-img.png'),
    clip: {
      x: 1350,
      y: 310,
      width: 150,
      height: 80,
    },
  });
  const inputs = await page.$$("input");
  await clearAndInput(page, inputs[0], config.id)
  await clearAndInput(page, inputs[1], config.pswd)
  await clearAndInput(page, inputs[3], config.phone)
  await page.click(".vcode-btn");
  const answers = await inquirer.prompt([{
    type: 'input',
    name: 'vcode',
    message: "Vcode: "
  },{
    type: 'input',
    name: 'sms',
    message: "Sms: "
  }]);
  await inputs[2].type(answers.vcode);
  await inputs[4].type(answers.sms);
  await page.click(".login-btn");
  await delay(5000);
  await page.screenshot({
    path: path.resolve(__dirname, 'check.png'),
    clip: {
      x: 0,
      y: 0,
      width: 1600,
      height: 900,
    },
  });
};
