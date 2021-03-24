// ==UserScript==
// @name         Team+ Notification
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show Team+ Notification by browser
// @author       joysrr
// @match        http://tp.cht-pt.com.tw/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if (('Notification' in window)) {
        let unreadcount = 0, title = '';
        setInterval(()=>{
            const chatView = document.getElementById('divPersonalLogSideBar')
            if(chatView){
                //chat page
                const unreadList = chatView.querySelectorAll('.unreadCount');
                unreadList.forEach(unread=>{
                    unreadcount = unread.innerText;
                    title = unread.parentElement.querySelector('.chatName').title;
                    showNotify(unreadcount, title);
                })
            }else{
                // other page
                const notice = document.querySelectorAll('.noticeBadge')
                for(let i = 0; i < notice.length;i++){
                    unreadcount = parseInt(notice[i].innerText);
                    if(unreadcount>0){
                        showNotify(unreadcount);
                        break;
                    }
                }
            }
        }, 10000)
    }

    function showNotify(unread = '*', tag = 'default'){
        // 使用者同意授權
        Notification.requestPermission(function(permission) {
            if (permission === 'granted') {
                // 建立通知
                var notification = new Notification(`Team+[${tag=='default'?unread:tag}]`,{
                    body: `您有${unread}則新的訊息，請回覆!`, // 設定內容
                    icon: '../Images/chatsbg.png', // 設定 icon
                    tag:tag, // 標籤
                    renotify: true, // 重新通知
                }).onclick = function(e) { // 點擊
                    e.preventDefault();
                    window.open('http://tp.cht-pt.com.tw/EIM/Chat/ChatMain.aspx'); // 打開Team+訊息視窗
                };
            }
        });
    }
})();
