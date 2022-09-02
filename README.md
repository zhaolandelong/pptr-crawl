# Node 爬虫

## 使用说明

为方便调试，请按一下操作先把浏览器启动起来。其它脚本通过 `wsEndpoint` 的方式连接到已有的浏览器进行操作。

> 注：`wsEndpoint` 会在 `start.js` 运行后，存储在 `tmp.json` 临时文件中，其它脚本从此处读取。

## 使用步骤

1. 在根目录执行 `npm install`；
2. **修改** `start.js` 中的 `executablePath` 变量为你电脑中 chrome 的地址；
3. 命令行中运行 `node start.js &`，如果成功会启动一个浏览器。如果关闭了这个浏览器，还需要重新运行此命令启动；
4. 操作浏览器，进行登录、进入知识空间等操作，使浏览器处于想要的初始状态；
5. 运行其它脚本即可，如 `node packages/feishu/wiki-info.js`。该脚本可随时退出；
