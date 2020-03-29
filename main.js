// ==UserScript==
// @name         b站vtuber直播同传评论转字幕
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.staticfile.org/vue/2.6.11/vue.min.js
// @description  将vtuber直播时同传man的评论，以类似底部弹幕的形式展现在播放器窗口，免去在众多快速刷过的评论中找同传man的痛苦。


// ==/UserScript==


(function () {
// 字幕样式配置
  const widgeConfig = {
    color: 'white',
    fontSize: '50px',
    bottom: '10px',
  }


  const removeBracket = true

  window.attentionModul = {}
  window.attentionModul.app = null
  window.attentionModul.users = []
  window.attentionModul.observe = {}


  // 测试用组件
  window.attentionModul.debug = {}
  window.attentionModul.debug.setComment = function (index, comment) {
    setComment(index, comment)
  }
  window.attentionModul.debug.addAttentionUser = addAttentionUser
  window.attentionModul.debug.showDOM = function () {
    return [document.getElementById('comment-container')]
  }


  // 添加关注用户
  function addAttentionUser(uid) {
    console.log('add subscribe:', uid)
    $('textarea:eq(0)').click()
    if (window.attentionModul.users.indexOf(uid) < 0) {
      window.attentionModul.users.push(uid)
      window.attentionModul.app.comments.push(null)
    }
  }

  // 移除关注用户
  function removeAttentionUser() {

  }

  // 移除括号
  function removeBreaket(comment) {
    let r = comment.match(/^[ 【]*(.*?)[ 】]*$/i)[1]
    return r
  }

  //将匹配评论添加到vue变量中对应的字幕DOM
  function setComment(index, comment) {
    console.log('comment', comment)
    window.attentionModul.app.comments.splice(index, 1, comment)
  }

  //匹配评论发出者与关注用户
  function chatFilter(nodeList) {
    for (let item of nodeList) {
      const uid = item.getAttribute('data-uid')
      const comment = item.getAttribute('data-danmaku')
      const index = window.attentionModul.users.indexOf(uid)
      if (index > -1) {
        if (removeBreaket) {
          setComment(index, removeBreaket(comment))
        } else {
          setComment(index, comment)
        }
      }
    }
  }

  // DOM突变事件回调函数
  function mutationListener(mutationList) {
    window.attentionModul.observe.message = mutationList

    if (window.attentionModul.observe.message[0].addedNodes.length > 0) {
      chatFilter(window.attentionModul.observe.message[0].addedNodes)
    }
  }

  // 注入字幕组件
  ;(function insertCommentWidget() {
    const container = $('.bilibili-live-player-video-danmaku')
    if (container.length > 0) {
      const commentWidget = $('<div id="comment-container" :style="widgetStyle"><div v-for="(comment,index) in comments" :style="boxStyle"><div v-show="comment" :style="commentStyle">{{comment}}</div></div></div>')

      let widgetStyle = 'z-index: 999;position:absolute;left:50%;transform:translateX(-50%);width:90%;'
      let boxStyle = ''
      let commentStyle = 'display:inline-block;backgroundColor:rgba(0,0,0,0.5);position:relative;left:50%;transform:translateX(-50%);word-break: break-all;padding:10px;'
      for (let key in widgeConfig) {
        widgetStyle += key + ':' + widgeConfig[key] + ';'
      }
      container.append(commentWidget)
      window.attentionModul.app = new Vue({
        el: '#comment-container',
        data() {
          return {
            widgetStyle: widgetStyle,
            boxStyle: boxStyle,
            comments: new Array(window.attentionModul.users.length),
            commentStyle: commentStyle
          }
        }
      })

    } else {
      requestAnimationFrame(function () {
        insertCommentWidget()
      })
    }
  })();
// 在用户名点击菜单注入关注选项
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

  // 监听评论DOM突变事件
  window.attentionModul.observe.observer = new MutationObserver(mutationListener)
  window.attentionModul.observe.config = {childList: true}
  ;(function openObserver() {
    window.attentionModul.observe.anchor = document.getElementsByClassName('chat-history-list')[0]
    if (window.attentionModul.observe.anchor) {
      window.attentionModul.observe.observer.observe(window.attentionModul.observe.anchor, window.attentionModul.observe.config)
    } else {
      requestAnimationFrame(function () {
          openObserver()
        }
      )
    }
  })();

})();
