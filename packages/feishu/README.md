# 飞书文档爬虫

## 使用说明

### 准备
1. 在根目录执行 `npm install`；
2. **修改** `start.js` 中的 `executablePath` 变量为你电脑中 chrome 的地址；
3. 运行 `start.js`，如果成功会启动一个浏览器，把命令行中的 `wsEndpoint` 复制下来；
4. 操作浏览器，进行登录、进入知识空间等操作，使浏览器处于想要的初始状态；

### 运行
1. 修改 `packages/feishu/wiki-info.js` 中的 `browserWSEndpoint` 变量为 1 中复制的值；
2. 另起一个命令行窗口，运行 `wiki-info.js`，就会生成 csv 文件了；

> 注：\
> 当运行过程中出现异常中断时，命令行中会打印当前记录的 index。这时退出命令，修改 js 中的 `START_INDEX` 值为 index + 1，继续运行。会另外生成一份 csv，到时候手动拼接起来就好了。

更多详情见：[如何用 puppeteer 爬取「飞书」wiki 知识库文档的数据？](https://juejin.cn/post/7137720787905019911)