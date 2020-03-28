// ==UserScript==
// @name         b站vtuber直播同传评论转字幕
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.staticfile.org/vue/2.6.11/vue.min.js
// @description  将vtuber直播时同传man的评论，以类似底部弹幕的形式展现在播放器窗口，免去在众多快速刷过的评论中找同传man的痛苦。


// ==/UserScript==


(function () {

  const widgeConfig = {
    color:'white',
    fontSize:'50px',
    bottom:'0px'
  }

  window.attensionModul = {}
  window.attensionModul.app = null
  window.attensionModul.users = []
  window.attensionModul.observe = {}


  // 添加关注用户
  function addAttentionUser(uid) {
    console.log('add subscribe:', uid)
    $('textarea:eq(0)').click()
    if(window.attensionModul.users.indexOf(uid) < 0){
      window.attensionModul.users.push(uid)
    }
  }

  // 移除关注用户
  function removeAttentionUser() {

  }

  //将匹配评论添加到vue变量中对应的字幕dom
  function setComment(index, comment) {
    console.log('comment',comment)
    window.attensionModul.app.comments.splice(index,1,comment)
  }

  //评论内容筛选
  function chatFilter(nodeList) {
    for (let item of nodeList) {
      const uid = item.getAttribute('data-uid')
      const comment = item.getAttribute('data-danmaku')
      const index = window.attensionModul.users.indexOf(uid)
      if (index > -1) {
        setComment(index, comment)
      }
    }
  }

  // DOM突变时间监听回调函数
  function mutationListener(mutationList) {
    window.attensionModul.observe.message = mutationList

    if (window.attensionModul.observe.message[0].addedNodes.length > 0) {
      chatFilter(window.attensionModul.observe.message[0].addedNodes)
    }
  }
  // 添加字幕组件
  ;(function insertCommentWidget() {
    const container = $('.bilibili-live-player-video-danmaku')
    if (container.length > 0) {
      const commentWidget = $('<div id="comment-container" ><div :style="commentStyle" v-for="(comment,index) in comments" v-show="comment">{{comment}}</div></div>')
      let style = 'z-index: 999;position: absolute;margin: 10px;left: 50%;transform: translateX(-50%);width:100%;display: flex;flex-flow: column;place-content: end center;'
      for(let key in widgeConfig){
        style += key+':'+widgeConfig[key]+';'
      }
      commentWidget.attr('style',style)
      container.append(commentWidget)
      window.attensionModul.app = new Vue({
        el:'#comment-container',
        data(){
          return {
            comments:new Array(window.attensionModul.users.length),
            commentStyle:'display: flex;flex-flow: row;place-content: center center;'
          }
        }
      })

    } else {
      requestAnimationFrame(function () {
        insertCommentWidget()
      })
    }
  })();
// 在用户名点击菜单添加关注组件
  ;(function insertMenuWidget() {
      const menu = $('.danmaku-menu')
      const menuItem = menu.find('.report-this-guy')
      if (menuItem.length > 0) {
        let a = $('<a href="javascript:;" class="bili-link pointer" style="display: block">添加字幕特别关注</a>')
        menuItem.append(a)
        // 添加点击函数，获取用户uid，调用add函数添加到关注用户列表
        a.click(function () {
          const uid = menu[0].__vue__.uid
          addAttentionUser(uid.toString())
        })
      } else {
        requestAnimationFrame(function () {
          insertMenuWidget()
        })
      }
    }
  )();
  //

  // 监听评论变化
  window.attensionModul.observe.observer = new MutationObserver(mutationListener)
  window.attensionModul.observe.config = {childList: true}
  ;(function openObserver() {
    window.attensionModul.observe.anchor = document.getElementsByClassName('chat-history-list')[0]
    if (window.attensionModul.observe.anchor) {
      window.attensionModul.observe.observer.observe( window.attensionModul.observe.anchor, window.attensionModul.observe.config)
    } else {
      requestAnimationFrame(function () {
          openObserver()
        }
      )
    }
  })();

})();
