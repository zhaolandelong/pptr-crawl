const config = require("./config.json");
const { getCookie } = require("../../utils");
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
  const inputs = await page.$$("input");
  await inputs[0].type(config.id);
  await inputs[1].type(config.pswd);
  await inputs[3].type(config.phone);
  await page.click(".vcode-btn");
};
