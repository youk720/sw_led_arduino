var express = require('express');
var router = express.Router();

let sw = '';

// スイッチ側からのPOST処理

router.post('/', function(req, res){
  // 上で定義した変数に、postされたjsonデータを代入
  sw = req.body.sw;
});

// メインページのGET処理
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ベルスイッチ_LED動作テスト' });
});

// swページへjsonを送る処理
router.get('/sw', function(req, res, next){
  res.json({
    sw: sw
  });
});

// ledページへledの状態を入れる処理
router.get('/led', function(req, res, next){
  res.send(global_val);
});

module.exports = router;
