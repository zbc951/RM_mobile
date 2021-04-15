'use strict';
var machine, root;
if (location.host.indexOf('big59') > -1) {
    machine = false;
     root = 'http://big59-web.sog88.net';
} else {
    machine = true;
    root = 'https://168801.net';// 'http://gf1788.net';'http://localhost:7777'
}

var url = {
    gateway: '../pub/gateway.php',
    //(zh-cn / zh-tw / en-us / th)
    lang: 'zh-cn',
    ballType: 'FT',
    registUrl: root + '/app/spread/registered.php'
};


var slides = [
    './assets/homepage/nac1.jpg',
    './assets/homepage/nac2.jpg',
    './assets/homepage/nac3.jpg',
    './assets/homepage/nac4.jpg',
    // './assets/homepage/nac5.jpg',
    './assets/homepage/nac6.jpg',
  ];
//讀不到外層資料 預設測試
  var QQ = '---';

  var Platform_id=58;

  var  Customer_url='https://chatlink.mstatik.com/widget/standalone.html?eid=196275&groupid=2aa518a8d9db8ecb8f6e2713f0cbbea3';
// 讀取站台config檔案資料

try {
    QQ = c_QQid;
} catch (e) {}
try {
    Platform_id = P_id;
} catch (e) {}

try {
    Customer_url = C_URL;
} catch (e) {}

//偵測瀏覽器是否支援 Storage
var _storageMode = true;
if (typeof localStorage === 'object') {
    try {
        localStorage.setItem('storageTest', 1);
        localStorage.removeItem('storageTest');
        _storageMode = true;
    } catch (e) {
        Storage.prototype._setItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function() {};
        _storageMode = false;
        alert('您的浏览器版本可能较旧，或正在使用无痕模式浏览，建议更新您的浏览器，以达到更好的使用体验。Your browser version may be older, or you are browsing in incognito mode. It is recommended to update your browser to achieve a better user experience.');
    }
}

//轉跳電腦版
// var userAgent = navigator.userAgent;
// if (/Windows/i.test(userAgent) || /iPad/i.test(userAgent)) {
//     location.href = root + '/app';
// }

//客服模組
// var _cservice = function(m, ei, q, i, a, j, s) {
// 	m[i] = m[i] || function() {
// 		(m[i].a = m[i].a || []).push(arguments)
// 	};
// 	j = ei.createElement(q),
// 	s = ei.getElementsByTagName(q)[0];
// 	j.async = true;
// 	j.charset = 'UTF-8';
// 	j.src = '//static.meiqia.com/dist/meiqia.js?_=t';
// 	s.parentNode.insertBefore(j, s);
// 	_MEIQIA('entId', 57591);
// }
