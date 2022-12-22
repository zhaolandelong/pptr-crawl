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

exports.convert2XlsxByLine = (
  readName,
  writeName = readName.replace(/\.\w+$/, ".xlsx"),
  callback = (l) => l,
  shouldTrim = true
) =>
  new Promise((rev) => {
    const readStream = fs.createReadStream(readName);
    const writeStream = fs.createWriteStream(writeName);
    const readLine = rl.createInterface({
      input: readStream,
    });
    const data = [];
    let i = 0;
    readLine.on("line", (line) => {
      let rs;
      if (shouldTrim) {
        rs = callback(
          line.replace(/(,\s*)|(\s*,)/g, ",").replace(/(^\s*)|(\s*$)/g, ""),
          i
        );
      } else {
        rs = callback(line, i);
      }
      i += 1;
      data.push(rs.split(","));
    });
    readLine.on("close", function (line) {
      writeStream.write(xlsx.build([{ data }]));
      readStream.close();
      writeStream.close();
      rev(1);
    });
  });
