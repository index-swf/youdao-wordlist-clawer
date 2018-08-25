const puppeteer = require('puppeteer');
const fs = require('fs');

const PAGE_SIZE = 15;

puppeteer.launch({headless: false})
    .then(async browser => {
        const page = await browser.newPage();
        await clawWordlist(page);
        await browser.close();
    });

const clawWordlist = async (page) => {
    // 打开有道生词本
    await page.goto('http://dict.youdao.com/wordbook/wordlist');
    // 点击QQ授权登录
    await page.goto('http://dict.youdao.com/login/acc/login?app=web&product=DICT&tp=cqq&fr=1&cf=7&ru=http%3A%2F%2Fdict.youdao.com%2Fwordbook%2Fwordlist%3Fkeyfrom%3Dnull');
    // 点击头像登录
    await page.mainFrame().childFrames()[0].click('#qlogin_list a.face');
    // 等待页面加载
    await page.waitFor('#wordfoot > div.right > strong:nth-child(2)');
    // 获取单词总数
    const totalNumber = await page.$eval(
        '#wordfoot > div.right > strong:nth-child(2)',
        el => +el.innerText
    );
    console.log('totalNumber', totalNumber);
    // 获取总页数
    const totalPage = Math.ceil(totalNumber / PAGE_SIZE);
    console.log('totalPage', totalPage);
    // 获取生词本
    const wordlist = await getAllWordList(page, totalPage);
    // 写入文件
    fs.writeFileSync(`youdao-wordlist-${Math.random().toString(16).slice(-6)}.json`, JSON.stringify(wordlist));
}

const getAllWordList = async (page, totalPage) => {
    let result = [];
    for(let pageNumber = 0; pageNumber < totalPage; ++pageNumber){
        await page.goto(`http://dict.youdao.com/wordbook/wordlist?p=${pageNumber}&tags=`);
        const wordlist = await page.$$eval(
            '#wordlist > table > tbody > tr',
            trNodeArray => trNodeArray.map((trNode) => ({
                serialNumber: +trNode.querySelector('td:nth-child(1)').innerText,
                word: trNode.querySelector('td:nth-child(2) > div > a > strong').innerText,
                phonetic: trNode.querySelector('td:nth-child(3) > div').innerText,
                description: trNode.querySelector('td:nth-child(4) > div').innerText,
                createTime: trNode.querySelector('td:nth-child(5)').innerText,
                tags: trNode.querySelector('td:nth-child(6) > div').innerText,
            }))
        );
        result.push(wordlist);
    }
    return [].concat(...result);
}