// ==UserScript==
// @name         不知道有没有用的同传man辅助
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @description  在发送评论时自动加上【】


// ==/UserScript==


(function () {
    // left 和 right 可以改成自己需要的包裹符号，默认使用中文括号
    const left = '【'
    const right= '】'
    



    // 业务逻辑
    function inject(){    
        const chatPanel =  document.getElementsByClassName('control-panel-ctnr')[0]
        if(chatPanel){
            const vChatPanel = chatPanel.__vue__
            if(vChatPanel != undefined){
                const sendDanmaku = vChatPanel.sendDanmaku
                vChatPanel.sendDanmaku = function(n){
                    vChatPanel.chatInput = left+vChatPanel.chatInput+right
                    sendDanmaku(n)
                }
            }else{
                requestAnimationFrame(inject)
            }
        }else{
            requestAnimationFrame(inject)
        }
    }
    inject()
  })();
  
