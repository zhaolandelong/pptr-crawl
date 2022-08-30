const puppeteer = require("puppeteer-core");
const executablePath = "/usr/bin/google-chrome";

(async () => {
  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
    args: ["--start-maximized"],
  });
  console.log("Browser wsEndpoint is: ", browser.wsEndpoint());
})();