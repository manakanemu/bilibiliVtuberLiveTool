// ==UserScript==
// @name         不知道有没有用的同传man辅助
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @description  在发送评论时自动加上【】


// ==/UserScript==


(function () {

  //debug用
  function showVm() {
    return [document.getElementsByClassName('control-panel-ctnr')[0].__vue__]
  }

  function addBraket() {
    let comment = window.translatorTool.vm.chatInput.match(/^[ 【]*(.*?)[ 】]*$/i)[1]
    window.translatorTool.vm.chatInput = '【' + comment + '】'
  }

  function removeBraket() {
    let comment = window.translatorTool.vm.chatInput.match(/^(.*?)[ 】]*$/i)[1]
    window.translatorTool.vm.chatInput = comment
  }

  function removeLastBracket() {
    let comment = window.translatorTool.vm.chatInput.match(/^(.*?)[ 】]*$/i)[1]
    window.translatorTool.vm.chatInput = comment.substring(0, comment.length - 1) + '】】'
  }

  // 定义translatortools对象
  window.translatorTool = {}
  window.translatorTool.showVm = showVm
  window.translatorTool.add = addBraket
  window.translatorTool.remove = removeBraket
  window.translatorTool.removeLast = removeLastBracket

  // 递归检索评论框存在性
  ;(function init() {
    const el = $('#chat-control-panel-vm textarea')
    if (el.length > 0) {
      window.translatorTool.vm = document.getElementsByClassName('control-panel-ctnr')[0].__vue__
      // 抬起按键添加括号
      el.bind('keyup', function (e) {
        window.translatorTool.add()
      })
      el.bind('keydown', function (e) {
        if (e.keyCode === 8) {
          window.translatorTool.removeLast()
        } else {
          window.translatorTool.remove()
        }
      })
    } else {
      requestAnimationFrame(function () {
        init()
      })
    }
  })();
})();
