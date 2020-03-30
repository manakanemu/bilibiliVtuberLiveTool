// ==UserScript==
// @name         不知道有没有用的同传man辅助
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @description  在发送评论时自动加上【】


// ==/UserScript==


(function () {
  // 获取评论区内容
  function getText() {
    return window.translatorTool.vm.chatInput
  }
// 设置评论区内容
  function setText(text) {
    window.translatorTool.vm.chatInput = text
  }
  //debug用
  function showVm() {
    return [document.getElementsByClassName('control-panel-ctnr')[0].__vue__]
  }
  // 定义translatortools对象
  window.translatorTool = {}
  window.translatorTool.getText = getText
  window.translatorTool.setText = setText
  window.translatorTool.showVm = showVm

  // 递归检索评论框存在性
  ;(function init() {
    const el = $('#chat-control-panel-vm textarea')
    if (el.length > 0) {
      window.translatorTool.el = el
      window.translatorTool.vm = document.getElementsByClassName('control-panel-ctnr')[0].__vue__
      // 监听评论区失去焦点
      window.translatorTool.el.blur(function () {
        console.log('blur')
        let comment = window.translatorTool.getText()
        comment = comment.match(/^[ ]*(.+?)[ ]*$/i)[1]
        comment = '【' + comment + '】'
        window.translatorTool.setText(comment)
      })
      // 监听评论区获得焦点
      window.translatorTool.el.focus(function () {
        console.log('focus')
        let comment = window.translatorTool.getText()
        comment = comment.match(/^[ 【]*(.+?)[ 】]*$/i)[1]
        window.translatorTool.setText(comment)
      })
    } else {
      requestAnimationFrame(function () {
        init()
      })
    }
  })();
})();
