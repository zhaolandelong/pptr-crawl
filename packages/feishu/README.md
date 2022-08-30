# 飞书爬虫

## Useage

1. 运行根目录的 start.js，启动 ptr 浏览器，记录命令行中的 wsEndpoint，复制下来；
2. 修改浏览器地址，进入自己想要操作的页面；
3. 修改 `packages/feishu/wiki-info.js` 中的 `browserWSEndpoint` 变量为 1 中复制的值；
4. 另起一个命令行窗口，运行 `wiki-info.js`，会生成 csv 文件；

> 注：\
> 当运行过程中出现异常中断时，命令行中会打印当前记录的 index。这时退出命令，修改 js 中的 `START_INDEX` 值为 index + 1，继续运行。会另外生成一份 csv，到时候手动拼接起来就好了。