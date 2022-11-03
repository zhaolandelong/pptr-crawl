const https = require("https");

/**
 * 
 * [
    { "day": "2022-11-01", "downloads": 77721 },
    { "day": "2022-11-02", "downloads": 79027 },
    { "day": "2022-11-03", "downloads": 36330 }
  ]
 */
const parseDownloadsData = (str) => JSON.parse(str).downloads;

const totalDownloads = (arr) =>
  arr.reduce((prev, curr) => {
    return prev + curr.downloads;
  }, 0);

const downloadsPromise = (name, range) => {
  let rangeStr; // YYYY-MM-DD:YYYY-MM-DD
  if (range) {
    rangeStr = range;
  } else {
    const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const year = new Date().getFullYear();
    const lastYearDate = todayDate.replace(year, year - 1);
    rangeStr = `${lastYearDate}:${todayDate}`;
  }

  return new Promise((rev, rej) => {
    https
      .request(
        {
          host: "registry.npmmirror.com",
          path: `/downloads/range/${rangeStr}/${name}`,
        },
        (response) => {
          let str = "";

          //another chunk of data has been received, so append it to `str`
          response.on("data", (chunk) => {
            str += chunk;
          });

          //the whole response has been received, so we just print it out here
          response.on("end", () => {
            rev(str);
          });

          response.on("error", (err) => {
            rej(err);
          });
        }
      )
      .end();
  });
};

const getPackagesDownloads = (pkgs) => {
  const result = {};
  return Promise.all(
    pkgs.map((pkg) =>
      downloadsPromise(pkg).then((res) => {
        result[pkg] = totalDownloads(parseDownloadsData(res));
      })
    )
  ).then(() => result);
};

/**
 * Usage:
 *
getPackagesDownloads(["react", "vue", "@angular/core", "angular"]).then(
  (res) => {
    console.log(res); // { vue: 17856466, react: 41737825 }
  }
);
 * 
 */
