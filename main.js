// ==UserScript==
// @name         b站vtuber直播同传评论转字幕
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.staticfile.org/vue/2.6.11/vue.min.js
// @description  将vtuber直播时同传man的评论，以类似底部弹幕的形式展现在播放器窗口，免去在众多快速刷过的评论中找同传man的痛苦。


// ==/UserScript==


(function () {
// 字幕样式配置


  const removeBracket = true

  window.attentionModul = {}
  window.attentionModul.commentApp = {}
  window.attentionModul.consoleApp = {}
  window.attentionModul.users = []
  window.attentionModul.observe = {}
  window.attentionModul.dom = []
  // 测试用组件
  window.attentionModul.debug = {}
  window.attentionModul.debug.setComment = function (index, comment) {
    setComment(index, comment)
  }
  window.attentionModul.debug.addAttentionUser = addAttentionUser
  window.attentionModul.debug.showDOM = function () {
    return [document.getElementById('comment-container'), document.getElementById('console-container')]
  }
  window.attentionModul.config = JSON.parse(localStorage.getItem('config')|| '{"color":"","vertical":"2","fontSize":40}')


  // 添加关注用户
  function addAttentionUser(uid) {
    console.log('add subscribe:', uid)
    $('textarea:eq(0)').click()
    if (window.attentionModul.users.indexOf(uid) < 0) {
      window.attentionModul.users.push(uid)
      window.attentionModul.commentApp.comments.push(null)
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
    window.attentionModul.commentApp.comments.splice(index, 1, comment)
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

  function saveConfig() {
    const config = {
      "color":window.attentionModul.consoleApp.color,
      "vertical":window.attentionModul.consoleApp.vertical,
      "fontSize":window.attentionModul.consoleApp.fontSize
    }
    localStorage.setItem('config',JSON.stringify(config))
  }

  // 注入控制台组件
  ;(function () {
    const consoleStyle = `
.att-col{
      display: flex;
      flex-flow: column nowrap;
      place-content: center start;
    }
    .att-row{
      display: flex;
      flex-flow: row nowrap;
      place-content: center start;
      margin:3px 0px 3px 0px;
    }
    .att-top{
      z-index: 999;
    }
    .att-input{
      outline: none;
    }
    #console-container{
      position: absolute;
      left: 50px;
      top: 300px;
      min-height: 48px;
      min-width: 48px;
    }
    .att-icon-container {
      position: absolute;
      left: 0px;
      top: 0px;
      height: 48px;
      width: 48px;
      background-color: #fb7299;
      border-radius: 4px;
    }
    .att-icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      height: 32px;
      width: 32px;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADFElEQVRYhe2XX2iPURjHP7+N0oYRWWObMZSUJjQKG/JnlCh/LkSaUG6URLlf8pNSciEX1AqzaEXKhdTMnVHmRogxtOZfG/m/r956Th3v791r7++nXPCt0znv8zznOd/3Oc95zvvyzyPlAiDpd7GYAywAioEioBd4BbQCd5MGMpVK/SoICAzQdku6p3i0S6qP8ZHRMhBhNN8c++iSdFVSk/UvQvo2SbP+BIGNIceNkhZKKgjZFUqqkXTOs/0maXUuBJZ4zh5KWjzIsC6T9NSbm5Y0NymBIknvzcEDSWOT7KukkhCJAGclTRwsgVM26Yuk8oSLu1Yp6WuIRI9tVSyBUm/CviwXd+2g+en3fP6QVB1HYK8ZvpGUnyOBYZJ6jUCDpFvmu9slskOex2GB9ZeAH5kUE+Ez0GKF7iOwxmTjgHSkI0mPjOX20NuMkTQlJJsRse/hhN1t/jrseZe3HSVRBD6ass5zEpyKZ5I+SJpnsrQl2RF7DuR9kp6bvZu71vy982TdLseitsCN/QwZBpQBhcAok00DhgJT7Xk0MBwoNXsHt40pz/dF62ujItBp7LaEQhkcn03ec7GkzXbmnSzQ14bm1XvFLGWybSZ7GkXgmimP5ngCXDtu/i57spUm+xS1BTetX5ck3WPg/LR5JvnW90cROG/9JGBDjotvASbY+IInL7e+K2OGhajFQtRlxy+b0Bd52d4U0rlbs3kgApV2bAIcypLADa/0loWIfTLdjoEIBO20GTUmXLhCUqtXbLaG9CddAkoaEUfghBmmvboefB1NHmDhCZL2S3odc5kt8nQH/LtgSEQCOdksoMESMig634ErQCfQZx+mlUCNFSpMvtNLaIcq698ChyPW/CUCZ5QcHXab+n7Ge+M15vGxk8VFoNcbtwPNViOCklwNzASWhuY8AV4C600/G1gO3AbOWLTcenl+HYiKQJC5eyRVxSRcUJ6vZxGp4HMtz49Akh+TKCwCVthPS4VdRj3AHeA+MB3YZBdWgA/AyGA592OSK4Ew8iM+ZgqAVUAd0AEcI+rP6D/+CoCf0HfCu9e1CkQAAAAASUVORK5CYII=');
    }
    #att-console{
      color: #23ade5;
      background-color: white;
      width: 250px;
      min-height: 48px;
      padding: 14px 8px 14px 8px;
      border-radius: 8px;
    }
    .att-console-title{
      margin:4px;
    }
    .att-input-range{
      width: 200px;
      margin-right: 10px;
      outline: none;
    }
    .att-input-value{
      width: 20px;
      text-align: center;
      border: 0px;
      border-bottom: 1px solid gray;
      outline: none;
    }
    `

    const consoleContainer = $('<div @mouseleave="consoleOut" @mouseover.stop="consoleIn" id="console-container" class="att-top"></div>')
    const widgetIcon = $('<div v-show="!isShowConsole"  class="att-icon-container att-top" ><div class="att-icon"></div></div>')
    const consoleWidget = $('<div v-show="isShowConsole" id="att-console" class="att-col"></div>')
    const verticalWidget = $('<div class="att-console-title">字幕水平高度</div><div class="att-row"><input @input="changeVertical" class="att-input-range" type="range" v-model:value="vertical"><input class="att-input-value" v-model:value="vertical" @change="changeVertical"></div>')
    const fontSizeWidget = $('<div class="att-console-title">字幕大小</div><div class="att-row"><input @input="changeFontsize" class="att-input-range" type="range" v-model:value="fontSize" min="1" max="500"  step="5"><input class="att-input-value" v-model:value="fontSize" @change="changeFontsize"></div>')
    const colorWidget = $('<div class="att-console-title">字幕颜色</div><div class="att-row"><input class="att-input-range" placeholder="示例:#030303" v-model:value="color" @change="changeColor" style="padding: 2px;border-radius: 2px;border: 0;border-bottom: 1px solid gray"><div @click="defualtColor" style="cursor:pointer;">默认</div></div>')
    consoleWidget.append(verticalWidget)
    consoleWidget.append(fontSizeWidget)
    consoleWidget.append(colorWidget)
    consoleContainer.append(widgetIcon)
    consoleContainer.append(consoleWidget)
    $('body').append($('<style></style>').text(consoleStyle))
    $('body').append(consoleContainer)

    const config = window.attentionModul.config
    window.attentionModul.consoleApp = new Vue({
      el: '#console-container',
      data() {
        return {
          isShowConsole: false,
          vertical:config['vertical'],
          fontSize:config['fontSize'],
          color:config['color']
        }
      },
      methods: {
        consoleIn() {
          this.isShowConsole = true
        },
        consoleOut() {
          this.isShowConsole = false
        },
        changeVertical(){
          this.vertical = Math.min(100,Math.max(0,this.vertical))
          $('#comment-container').css('bottom',this.vertical.toString()+'%')
          saveConfig()
        },
        changeFontsize(){
          this.fontSize = Math.min(500,Math.max(0,this.fontSize))
          $('#comment-container').css('fontSize',this.fontSize.toString()+'px')
          saveConfig()
        },
        changeColor(){
          $('#comment-container').css('color',this.color.toString())
          saveConfig()
        },
        defualtColor(){
          this.color = '#ffffff'
          $('#comment-container').css('color',this.color.toString())
          saveConfig()
        }
      }
    })
  })();
  // 注入字幕组件
  ;(function insertCommentWidget() {
    const container = $('.bilibili-live-player-video-danmaku')
    if (container.length > 0) {
      const commentWidget = $('<div id="comment-container" :style="widgetStyle"><div v-for="(comment,index) in comments" :style="boxStyle"><div v-show="comment" :style="commentStyle">{{comment}}</div></div></div>')
      let widgetStyle = 'z-index: 999;position:absolute;left:50%;transform:translateX(-50%);width:90%;'
      let boxStyle = ''
      let commentStyle = 'display:inline-block;backgroundColor:rgba(0,0,0,0.5);position:relative;left:50%;transform:translateX(-50%);word-break: break-all;padding:10px;'
      container.append(commentWidget)
      window.attentionModul.commentApp = new Vue({
        el: '#comment-container',
        data() {
          return {
            widgetStyle: widgetStyle,
            boxStyle: boxStyle,
            comments: new Array(window.attentionModul.users.length),
            commentStyle: commentStyle,
            dom:document.getElementById('comment-container')
          }
        }
      })
      window.attentionModul.consoleApp.changeVertical()
      window.attentionModul.consoleApp.changeColor()
      window.attentionModul.consoleApp.changeFontsize()

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
