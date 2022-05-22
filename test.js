const qs = require("qs");

const baseConfig = {
  aid: "2906",
  app_name: "aweme_creator_platform",
  device_platform: "web",
  referer: "https://creator.douyin.com/",
  user_agent:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36",
  cookie_enabled: "true",
  screen_width: "1920",
  screen_height: "1080",
  browser_language: "en-US",
  browser_platform: "Linux x86_64",
  browser_name: "Mozilla",
  browser_version:
    "5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36",
  browser_online: "true",
  timezone_name: "Asia/Shanghai",
  // _signature:
};

const obj = qs.parse(
  "aid=2906&app_name=aweme_creator_platform&device_platform=web&referer=https:%2F%2Fcreator.douyin.com%2Fweekly%3Fquery_date%3D2022-05-15&user_agent=Mozilla%2F5.0+(X11%3B+Linux+x86_64)+AppleWebKit%2F537.36+(KHTML,+like+Gecko)+Chrome%2F101.0.0.0+Safari%2F537.36&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=en-US&browser_platform=Linux+x86_64&browser_name=Mozilla&browser_version=5.0+(X11%3B+Linux+x86_64)+AppleWebKit%2F537.36+(KHTML,+like+Gecko)+Chrome%2F101.0.0.0+Safari%2F537.36&browser_online=true&timezone_name=Asia%2FShanghai&_signature=_02B4Z6wo00901pp1X3QAAIDAHv7vtTPDNEKacVvAAMQgq9LRd0B16UeajLMHypWTz989uwlssds9IUT7Rls2E7c8fWqJm3Tyy9gs8rkN-IdZQ1paQnAd-Zadl.BPqaX0QhHGz6bQnaujNB0Z70"
);

const all = { ...baseConfig, ...obj };

const diff = {};

Object.keys(all).forEach((key) => {
  if (all[key] !== baseConfig[key]) {
    diff[key] = all[key];
  }
});
// console.log(diff);

const data = ["fans", "finish", "interaction", "play", "publish"].reduce((prev, key) => {
  prev[key] = key;
  return prev
}, {})

console.log(data);