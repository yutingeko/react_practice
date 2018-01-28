const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const superagent = require('superagent');
const cheerio = require('cheerio');
// const fs = require('fs');

/**
 * 處理空格＆換行 & encodeURIComponent
 * @param text
 * @returns {string}
 */
function encodeText(text) {
    return encodeURIComponent(text.replace(/\n/g, "").replace(/\s/g, ""));
}
/**
 * 核心
 * send request, data parse, get data
 */
function sendRequest(reptileUrl, success, error) {
  return superagent.get(reptileUrl).then(success).catch(error);
}
router.use(bodyParser.json());

router.post('/', function(req, res, next) {
  let searchText = encodeText(req.body.searchword || '面白い');
  let reptileUrl = `https://dict.hjenglish.com/jp/jc/${ searchText }`
  
  sendRequest(reptileUrl, (crawlerRes)=>{
    // 解析data
    let $ = cheerio.load(crawlerRes.text);
    // 存放data
    let data = [];
    $('.jp_word_comment').each((idx, elem)=> {
      let $elem = $(elem);
      let content = {
        title: $elem.find('.jpword').text(),
        hiragana: $elem.find('.trs_jp').text().replace('【','').replace('】',''),
        type: $elem.find('.flag.big_type.tip_content_item').attr('title'),
        definition: [],
      };
      $elem.find('li.flag').each((idx, elem)=> {
        let flagData = {};
        flagData.explain = $(elem).find('.jp_explain').text();
        content.definition.push(flagData);
      })
      data.push(content)
    })
    res.json({ data});
  });
});

module.exports = router;
