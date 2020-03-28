# bilibiliVtuberLiveTool
b站(bilibili) vtuber直播，同传字幕绑定器--油猴脚本。关注同传man后，可以将同传评论显示在视频底部

## 目录
[脚本特性](#脚本特性)  
[使用方法](#使用方法)  
[更新计划](#更新计划)  
[问题反馈](#问题反馈)  

## 脚本特性
### 脚本可以自动捕获同传man发表的评论，并以类似底部弹幕的形式显示在屏幕上。
![软件特性](https://github.com/manakanemu/bilibiliVtuberLiveTool/blob/master/web/1.png)  
### 全屏后可以正常显示
![全屏幕](https://github.com/manakanemu/bilibiliVtuberLiveTool/blob/master/web/2.png)


## 使用方法
* 前往油猴安装脚本,[点击此处](https://greasyfork.org/zh-CN/scripts/398879-b%E7%AB%99vtuber%E7%9B%B4%E6%92%AD%E5%90%8C%E4%BC%A0%E8%AF%84%E8%AE%BA%E8%BD%AC%E5%AD%97%E5%B9%95)
* 打开直播页面后，点击评论区同传man用户名，在弹出菜单中点击最下方的 **添加字幕特别关注**  ![](https://github.com/manakanemu/bilibiliVtuberLiveTool/blob/master/web/3.png)
* 设置完毕，等同传man发表新评论是，就会自动捕获并更新到播放器底部。
* 注：脚本可以添加多个同传man，重复上一步操作即可。

如果您希望更改字幕颜色或字幕大小，可以前往脚本代码页面，您在脚本的第18行可以看到如下内容：  
```  
const widgeConfig = {
    color:'white',
    fontSize:'50px'
  }
 ```  
 若要修改字幕大小，请修改```50px```字样为您需要的大小，50px表示50像素，修改大小请不要删除```px```两个字母。如果希望修改颜色，可以将color后的```'white'```改成您需要的颜色，可以使用html标准颜色如```'yellow'```或16进制颜色值```'#0f0f0f'```或rgb颜色值```'rgb(0,0,0)'```。未来计划添加修改字幕颜色大小位置的可视化交互面板。
 
 ## 更新计划
 * 目前成功添加同传man后菜单不会消失，也不会有反馈，下个版本会解决这个问题。
 * 计划添加可视化的字幕颜色、大小修改面板。
 * 计划添加自由拖动字幕位置的功能。
 * 计划添加同传man管理面板，无需每次添加，并可以对不同关注对象设定不同字幕颜色。
 * 目前字幕不会自动消失，下个版本将会解决这个问题，当同传man长时间不发言后自动隐藏字幕。
 
 ## 问题反馈
如果您有任何问题、意见或建议，请直接发issue。  
请不要在greasyfork发反馈，gf的反馈看不到。
