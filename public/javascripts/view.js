'use strict';

var socket = io();

// LED送信関連
let m = [];
let result = "";

let door_led_status = 0;
// let send = $('#sw_now').change(function (){
//     // m.shift();
//     m.push(result);
// });

function sub_send(){
  socket.emit("sw status", '');
  socket.emit("sw status", m);
}

let melo = $("#melo");
let door = $('#door');

// メロディ & 戸閉放送,再生処理
function on(){
  $(function(){
    melo.get(0).play();
    melo.get(0).loop = true;
    door.get(0).currentTime = 0;
    console.log("melody's loop is " + melo.get(0).loop);
    m.shift();
    m.push("led_2=True");
    sub_send();
    door_led_status = 2;
  });
}

function off(){
  $(function (){
      if(typeof($("#melo").get(0).currentTime) != 'undefined'){
      door.get(0).currentTime = 0;
      }
    melo.get(0).pause();
    melo.get(0).currentTime = 0;
    melo.get(0).loop = false;

    m.length = 0;
    m.push("led_2=False");
    sub_send();

    setTimeout(off_1, 1500);
      function off_1(){
        door.get(0).play();
        m.push("led_1=True");
        sub_send();
        door_led_status = 1;
      }
  });
}

// スイッチ操作の各種処理
// クライアント側クリック用
$('#on').on('click', function(e) {
  //on関数召喚
  on();
});

$('#off').on('click', function (){
  //off関数召喚
    off();
});

// ベルスイッチ用処理

// swページからjsonを読み取ってスイッチ入ったかの反応処理
$(document).ready(function () {
      setInterval(function(){
        $.getJSON("/sw", function(data){
          $("#sw_now").html(data.sw);
  			});
      }, 10);
		});

var bell_status = 1;
var door_status = 1;
setInterval(function(){
// $('#sw_now').change(function() {
  if (bell_status === 1 && $('#sw_now').text() === "True"){
      on();
      // console.log("ON");
      $("#on").removeClass().addClass("btn btn-danger btn-lg  text-center");
      $("#off").removeClass().addClass("btn btn-default btn-lg  text-center");
      bell_status = 0;
      door_status = 1;
  };
  if(door_status === 1 && $('#sw_now').text() === "False"){
      $("#on").removeClass().addClass("btn btn-default btn-lg");
      $("#off").removeClass().addClass("btn btn-success btn-lg");
      off();
      // console.log("OFF");
      bell_status = 1;
      door_status = 0;
  };
}, 10);

setInterval(function() {
  if (door.get(0).currentTime === door.get(0).duration && door_led_status === 1) {
    m.pop();
    m.push("led_1=False");
    sub_send();
    door_led_status = 0;
  }else if(door.get(0).currentTime === door.get(0).duration && door_led_status === 2){
    m.shift();
    m.unshift("led_1=False");
    sub_send();
  }

}, 10);

// メロディ時間 & 合計時間表示
function time(){
    $(function (){
      setInterval(function(){
        let m = ('0' + Math.floor( $("#melo").get(0).currentTime / 60 )) .slice( -2 );
        let s = ( '0' + Math.floor( $("#melo").get(0).currentTime % 60 )) .slice( -2 );
        let dm = ( '0' + Math.floor( $("#melo").get(0).duration / 60 ) ) .slice( -2 );
        let ds = ( '0' + Math.floor( $("#melo").get(0).duration % 60 ) ) .slice( -2 );
            $("#time").html(m + ":" + s + " / " + dm + ":" + ds);

          }, 1);

    });
}
// 定義後、即実行
time();
