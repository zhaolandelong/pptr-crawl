const fs = require("fs");
const http = require("http");
const https = require("https");
const { convertCsvToXlsx } = require("@aternus/csv-to-xlsx");

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
      .request(url, (res) => {
        res.pipe(fs.createWriteStream(dist));

        res.on("end", () => {
          rev(dist);
        });

        res.on("error", (err) => {
          rej(err);
        });
      })
      .end();
  });
};

exports.csv2xlsx = (source, dist) => {
  let _dist = dist;
  if (typeof _dist === "undefined") {
    _dist = source.replace(".csv", ".xlsx");
  }
  convertCsvToXlsx(source, _dist);
};
