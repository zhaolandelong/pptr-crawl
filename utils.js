exports.waitClickSelector = async (page, selector) => {
  await page.waitForSelector(selector);
  await page.click(selector);
};

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
