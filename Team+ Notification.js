// ==UserScript==
// @name         Team+ Notification
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show Team+ Notification by browser
// @author       joysrr
// @match        *
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if (('Notification' in window)) {
        let currcount = 0;
        setInterval(()=>{
            const notice = document.querySelectorAll('.noticeBadge')
            for(let i = 0; i < notice.length;i++){
                currcount = parseInt(notice[i].innerText);
                if(currcount>0){
                    showNotify(currcount);
                    break;
                }
            }
        }, 10000)
    }

    const notifyConfig = {
        body: '您有新的訊息，請回復!', // 設定內容
        icon: '../Images/chatsbg.png', // 設定 icon
        tag:'Team+Notification',// 標籤
        renotify: true, // 重新通知
    };

    function showNotify(num = '*'){
        Notification.requestPermission(function(permission) {
            if (permission === 'granted') {
                // 使用者同意授權
                var notification = new Notification(`Team+ Message[${num.toString()}]`, notifyConfig); // 建立通知
            }
        });
    }
})();
