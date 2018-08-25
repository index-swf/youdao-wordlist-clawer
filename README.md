### 爬取有道生词本

使用方法，运行

```bash
npm install && npm start
```

执行完毕后 运行结果输出在当前目录的 **youdao-wordlist-xxxxxx.json** 文件中

运行演示
![demo](https://github.com/index-swf/youdao-wordlist-clawer/blob/master/demo.gif)

#### 注意事项

- 安装 puppeteer 可能需要翻墙，请自行查找相关文章
- 本脚本登录有道生词本的方式是 QQ授权登录，请在电脑端运行并保持 QQ 处于登录状态，有道词典绑定了QQ，并允许QQ登录
- 可以支持后台运行，把 launch options 改为 `{headless: true}` 就可以了

