// ==UserScript==
// @name         Team+ Notification
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show Team+ Notification by browser
// @author       joysrr
// @match        http://tp.xxx.com.tw/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // 黑名單不顯示
    let bList = ['訊息情報'];

    let nList = [];
    let unreadcount = 0, title = '', msgContent = '', msgDate = '';
    setInterval(() => {
        // 當頁面不在前台時才跳出通知
        if (checkNotifyOn() && document.visibilityState === 'hidden') {
            const chatView = document.getElementById('divPersonalLogSideBar')
            if (chatView) {
                //chat page
                const unreadList = chatView.querySelectorAll('.unreadCount');
                unreadList.forEach(unread => {
                    unreadcount = unread.innerText;
                    title = unread.parentElement.querySelector('.chatName').title;
                    msgContent = unread.parentElement.querySelector('.content').innerText;
                    msgDate = unread.parentElement.querySelector('.sendTime').innerText;
                    if(checkNotifyCanPost(title)){
                        nList.push(showNotify(unreadcount, title, `${msgContent}\n${msgDate}`));
                    }
                })
            } else {
                // other page
                const notice = document.querySelectorAll('.noticeBadge')
                for (let i = 0; i < notice.length; i++) {
                    unreadcount = parseInt(notice[i].innerText);
                    if (unreadcount > 0) {
                        if(checkNotifyCanPost('Team+Notification')){
                            nList.push(showNotify(unreadcount));
                        }
                        break;
                    }
                }
            }
        }
    }, 10000)

    // close all notification when visible
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            nList.forEach(n=>n.close());
        }
    });

    function checkNotifyCanPost(tag){
        return !bList.some(b=>tag.includes(b)) && !nList.some(n=>n.tag === tag);
    }

    function checkNotifyOn() {
        if (window.Notification && Notification.permission === "granted") {
            return true;
        } else if (window.Notification && Notification.permission !== "denied") {
            Notification.requestPermission().then(status => {
                if (status === "granted") {
                    var n = new Notification("Team+ Notification", {
                        body: 'Congratulations! Now you can use Team+ Notification',
                        icon: '../Images/chatsbg.png',
                        tag: 'Team+Notification'
                    });
                    return true;
                } else {
                    alert("Oops! Plz grant Notification authority!");
                }
            }).catch(error => {
                console.log(error);
            })
        } else {
            alert("So sad! seems like your browser didn't support Notification QQ");
        }
    }

    // url要替換成自己Team+訊息的網址喔~
    function showNotify(unread = '*', tag = 'Team+Notification', content = '', url = 'http://tp.xxx.com.tw/EIM/Chat/ChatMain.aspx') {
        var notification = new Notification(`Team+[${tag=='Team+Notification'?unread:tag}]`, {
            body: `您有${unread}則新的訊息，請回覆!${content===''?'':'\n'+content}`, // 設定內容
            icon: '../Images/chatsbg.png', // 設定 icon
            tag: tag, // 標籤
            renotify: true, // 重新通知
            requireInteraction: true, // 持續顯示
        });

        notification.onclick = function(e) { // 點擊
            e.preventDefault();
            window.open(url); // 打開Team+訊息視窗
        };

        notification.onclose = function(e){ // 關閉
            nList.remove(e.target);
        };

        return notification;
    }
})();
