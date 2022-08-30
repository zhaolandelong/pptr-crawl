const aid = "xxx";
const signMap = {
  "/aweme/v1/creator/data/overview/account/": "xxx",
  "/web/api/creator/data/item/summarize/": "xxx",
  "/aweme/janus/creator/data/overview/all/": "xxx",
  "/aweme/v1/creator/data/week/report/": "xxx",
  "/web/api/creator/data/item/top/": "xxx",
  "/web/api/creator/data/item/compare/": "xxx",
};

const baseConfig = {
  aid,
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

const baseFetch = (path, option) =>
  fetch(
    `https://creator.douyin.com${path}?${Object.entries({
      ...baseConfig,
      _signature: signMap[path],
      ...option,
    })
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join("&")}`
  ).then((res) => res.json());

/**
 * 数据总览
 */
const fetchOverview = baseFetch("/aweme/v1/creator/data/overview/account/", {
  // referer: "https://creator.douyin.com/weekly?query_date=2022-05-15",
}).then((res) =>
  ["fans", "finish", "interaction", "play", "publish"].reduce((prev, key) => {
    const { general_rank, general_value, label, user_rank, user_value } =
      res[key];
    prev[key] = {
      general_rank,
      general_value, // 同类作者数据
      label,
      user_rank, // 高于同类作者 xx%
      user_value, // 自己数据
    };
    return prev;
  }, {})
);

// statistics: {
//   comment_count, // 评论量
//   digg_count, // 点赞量
//   forward_count,
//   live_watch_count,
//   play_count, // 播放量
//   share_count, // 分享量
// },
// summarize_data: {
//   home_page_view_count, // 主页访问量
//   interact_index,
//   new_fans_count, // 粉丝增量
//   play_avg_time, // 均播时长，单位 s
//   play_finish_ratio, // 完播率
// },
const fetchVidoes = baseFetch("/web/api/creator/data/item/summarize/", {}).then(
  (res) =>
    res.item_list.map(
      ({ create_time, desc, duration, statistics, summarize_data }) => ({
        desc,
        create_time,
        duration,
        statistics,
        summarize_data,
      })
    )
);

const fetchSummary = baseFetch("/aweme/janus/creator/data/overview/all/", {
  last_days_type: "1",
  device_id: "1750078721389672",
}).then((res) =>
  [
    "account_search",
    "cancel_fans",
    "comment", // 评论
    "digg", // 点赞
    "fans",
    "music_create",
    "new_fans", // 净增粉丝
    "play", // 播放量
    "post_search",
    "profile", // 主页访问
    "share", // 分享
  ].reduce((prev, key) => {
    const { current_count, last_period_incr } = res.data[key];
    prev[key] = {
      current_count,
      last_period_incr,
    };
    return prev;
  }, {})
);

const fetchWeekReport = baseFetch("/aweme/v1/creator/data/week/report/", {
  // referer: "https://creator.douyin.com/creator-micro/data/stats/weekly",
  query_date: "2022-05-15",
}).then((res) => {
  const {
    best_item,
    report_period_time, // 周期
    week_cate_percent,
    week_fans_mom, // 百分比，%
    week_fans_num, // 新增粉丝量
    week_like_cnt, // 新增点赞量
    week_like_mom,
    week_live_user_mom,
    week_live_user_num, // 直播人次
    week_play_cnt, // 新增播放量
    week_play_mom,
    week_publish_cnt, // 发表作品量
    week_publish_mom,
    week_score_percent, // 超过了 xx% 的同级创作者
    week_vv_score_percent, // 视频播放量超过了 xx% 的抖音用户
  } = res.week_report;
  const {
    comment_cnt, // 评论量
    cover_image_url,
    create_time,
    duration,
    item_id,
    item_link,
    like_cnt, // 点赞
    play_cnt, // 播放量
    title,
  } = best_item;
});

const fetchTopList = baseFetch("/web/api/creator/data/item/top/", {
  // referer: "https://creator.douyin.com/weekly?query_date=2022-05-15",
}).then((res) =>
  res.top_list.map((vd) => ({
    desc: vd.desc,
    labels: vd.summarize_data.top_count_label, // 1-点赞最高 2-播放最高 3-吸粉最多 4-完播率最高
  }))
);

// 同类作者平均值
// CommentBaseValue
// GetFansBaseValue
// LikeBaseValue
// PlayBaseValue
// PlayFinishBaseValue
// ShareBaseValue
const fetchAvgData = baseFetch("/web/api/creator/data/item/compare/", {
  // referer: "https://creator.douyin.com/weekly?query_date=2022-05-15",
}).then((res) => res.base_value);
