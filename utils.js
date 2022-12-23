const fs = require("fs");
const rl = require("readline");
const http = require("http");
const https = require("https");
const xlsx = require("node-xlsx").default;

exports.waitClickSelector = async (page, selector) => {
  await page.waitForSelector(selector);
  await page.click(selector);
};

exports.waitPathResponse = (page, path) =>
  page.waitForResponse(
    (response) => response.url().includes(path) && response.status() === 200
  );

exports.delay = async (ms) => new Promise((rev) => setTimeout(() => rev(), ms));

exports.clearAndInput = async (page, selector, text) => {
  await selector.focus();
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyA");
  await page.keyboard.up("Control");
  await selector.type(text);
};

exports.getCookie = async (page, key) => {
  const obj = (await page.cookies()).find(
    (cookieObj) => cookieObj.name === key
  );
  return obj ? obj.value : "";
};

exports.serviceDownload = (url, dist) => {
  const service = url.startsWith("https:") ? https : http;
  return new Promise((rev, rej) => {
    service
      .get(url, (res) => {
        const file = fs.createWriteStream(dist);
        // Write data into local file
        res.pipe(file);
        // Close the file
        file.on("finish", () => {
          file.close();
          rev(dist);
        });

        // res.pipe(fs.createWriteStream(dist));
      })
      .on("error", (err) => {
        rej(err);
        console.log("Error: ", err.message);
      });
  });
};

exports.convert2XlsxByLine = (readName, options = {}) => {
  const {
    writeName = readName.replace(/\.\w+$/, ".xlsx"),
    callback,
    sheetName = "Sheet1",
  } = options;

  return new Promise((rev) => {
    const readStream = fs.createReadStream(readName);
    const writeStream = fs.createWriteStream(writeName);
    const readLine = rl.createInterface({
      input: readStream,
    });
    const data = [];
    let i = 0;
    readLine.on("line", (line) => {
      const arr = line
        .replace(/(,\s*)|(\s*,)/g, ",")
        .replace(/(^\s*)|(\s*$)/g, "")
        .split(",");

      if (typeof callback === "function") {
        const arrRes = callback(arr, i);
        if (Array.isArray(arrRes)) {
          data.push(arrRes);
        }
      } else {
        data.push(arr);
      }
      i += 1;
    });
    readLine.on("close", function () {
      writeStream.write(xlsx.build([{ name: sheetName, data }]));
      readStream.close();
      writeStream.close();
      rev(1);
    });
  });
};
