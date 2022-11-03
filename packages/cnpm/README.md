# cnpm 下载量爬虫

根据[线索](https://github.com/cnpm/cnpmjs.org/blob/45408450465281d4298108f090a5807d141b7c6d/routes/registry.js#L107)，发现 cnpm downloads API 的格式如下：

```
https://registry.npmmirror.com/downloads/range/2022-11-01:2022-11-02/vue
```