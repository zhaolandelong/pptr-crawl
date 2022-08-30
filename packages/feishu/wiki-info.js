const puppeteer = require("puppeteer-core");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");

const browserWSEndpoint =
  "ws://127.0.0.1:37665/devtools/browser/df5d130f-f3ab-4574-8b5d-76a22c919dc2";
const defaultViewport = {
  width: 1600,
  height: 900,
};
const START_INDEX = 1;

const waitClickSelector = async (page, selector) => {
  await page.waitForSelector(selector);
  await page.click(selector);
};

const delay = async (ms) => new Promise((rev) => setTimeout(() => rev(), ms));

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport,
  });
  const page = (await browser.pages())[0];

  let i = START_INDEX;
  let navs;
  let len = 99;

  const csvWriter = createCsvWriter({
    path: path.resolve(__dirname, `wiki${i}.csv`),
    header: [
      { id: "title", title: "title" },
      { id: "owner", title: "owner" },
      { id: "created", title: "created" },
      { id: "words", title: "words" },
      { id: "chars", title: "chars" },
      { id: "uv", title: "uv" },
      { id: "pv", title: "pv" },
      { id: "like", title: "like" },
      { id: "comments", title: "comments" },
    ],
  });
  while (i < len) {
    navs = await page.$$(".list-item-wrapper");
    len = navs.length;
    const title = await navs[i].$eval(".tree-node-wrapper", (ele) => ele.innerText);
    await navs[i].click();
    await delay(200);
    await navs[i].click();
    await waitClickSelector(page, "button.more-btn");
    await delay(100);
    await waitClickSelector(page, ".document_detail");
    await page.waitForSelector(".gpf-doc-detail-v2__detail-modal-v2");

    let [words, chars, uv, pv, like, comments] = [];

    const [owner, created] = await page.$$eval(
      ".gpf-doc-detail-v2__detail-label",
      (eles) => eles.map((el) => el.innerText)
    );
    const items = await page.$$eval(".gpf-doc-detail-v2__value", (eles) =>
      eles.map((el) => el.innerText)
    );

    if (items.length === 3) {
      // sheet
      [uv, pv, comments] = items;
    } else {
      // doc
      [words, chars, uv, pv, like, comments] = items;
    }

    const record = {
      title,
      owner,
      created,
      words,
      chars,
      uv,
      pv,
      like,
      comments,
    };
    console.log(i, record);
    await csvWriter.writeRecords([record]);
    await page.keyboard.press("Escape");
    i++;
  }
})();
