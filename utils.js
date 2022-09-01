exports.waitClickSelector = async (page, selector) => {
  await page.waitForSelector(selector);
  await page.click(selector);
};

exports.delay = async (ms) => new Promise((rev) => setTimeout(() => rev(), ms));
