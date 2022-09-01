const puppeteer = require("puppeteer-core");
const { browserWSEndpoint } = require("../../tmp.json");
const { delay, clearAndInput, waitClickSelector } = require("../../utils");
const { buy, sell, getToken, login } = require("./utils");

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      width: 1600,
      height: 900,
    },
  });
  const page = (await browser.pages())[0];

  const token = await getToken(page);

  const res = await sell(page, token, {
    zqdm: "600703",
    // zqdm: "000063",
    wtsl: 100,
    wtjg: 12.5,
    sjwtbz: 0,
  });
  console.log(res);

  // await login(page, browser);

  await browser.disconnect();
})();
