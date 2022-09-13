const fs = require("fs");
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer-core");

(async () => {
  const tmpFile = path.resolve(__dirname, "tmp.json");
  const browser = await puppeteer.launch({
    executablePath:
      os.platform() === "linux"
        ? "/usr/bin/google-chrome"
        : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ["--start-maximized", "--no-sandbox"],
  });
  console.log("Browser wsEndpoint is: ", browser.wsEndpoint());
  fs.writeFileSync(
    tmpFile,
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
