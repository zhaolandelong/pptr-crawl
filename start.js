const fs = require("fs");
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      os.platform() === "linux"
        ? "/usr/bin/google-chrome"
        : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    headless: false,
    args: ["--start-maximized"],
  });
  console.log("Browser wsEndpoint is: ", browser.wsEndpoint());
  fs.writeFileSync(
    path.resolve(__dirname, "tmp.json"),
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
