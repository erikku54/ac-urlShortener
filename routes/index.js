const express = require('express');
const utility = require('./../public/js/utility');
const urlMappingModel = require('../models/urlMappingModel');

const router = express.Router(); // 引用express路由器

// (頁面)首頁
router.get('/', (req, res) => {
  res.render('index');
});

// (功能)產生短網址
router.post('/', (req, res) => {

  const originalURL = req.body.originalURL;

  urlMappingModel.findOne({ originalURL })
    .then(urlMapping => {

      // 若本來已存在mapping資料，把結果回傳給下一個then來產生畫面
      if (urlMapping !== null) {
        return urlMapping;
      }

      // 若本來不存在mapping資料，先產生5位數亂碼
      let code;

      // 底下是一個promise loop，會持續執行直到5位數亂碼並不存在於db中
      const generateCodeWhile = (mapping) => {
        if (mapping !== null) {
          code = utility.generateCode(5);
          return urlMappingModel.findOne({ shortCode: code }).then(generateCodeWhile);
        } else {
          return Promise.resolve(code);
        }
      }

      return generateCodeWhile(undefined).then(shortCode => urlMappingModel.create({ originalURL, shortCode }));

      // (NG)系統可能存在重複code
      // return urlMappingModel.create({ originalURL, shortCode: utility.generateCode(5) });

    }).then(urlMapping => res.render('index', { shortCode: urlMapping.shortCode }) // 產生畫面
    ).catch(err => res.status(500).json({ error: err }));

})

// (功能)短網址重新導向
router.get('/:id', (req, res) => {
  // TODO: redirect

  
  


  res.render('index');
});


module.exports = router; // 匯出設定的express路由器
