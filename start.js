const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const { executablePath } = require("./config.json");

(async () => {
  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
    args: ["--start-maximized"],
  });
  console.log("Browser wsEndpoint is: ", browser.wsEndpoint());
  fs.writeFileSync(
    path.resolve(__dirname,'tmp.json'),
    JSON.stringify(
      {
        browserWSEndpoint: browser.wsEndpoint(),
      },
      null,
      2
    ),
    "utf8"
  );
})();
