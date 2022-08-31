# 飞书文档爬虫

## 使用说明
请参考 [项目 README](../../README.md)，最后运行 `node wiki-info.js` 即可。

更多内容见：[如何用 puppeteer 爬取「飞书」wiki 知识库文档的数据？](https://juejin.cn/post/7137720787905019911)

> 注：\
> 当运行过程中出现异常中断时，命令行中会打印当前记录的 index。这时退出命令，修改 js 中的 `START_INDEX` 值为 index + 1，继续运行。会另外生成一份 csv，到时候手动拼接起来就好了。

