FM.GITMV
========

### 私人电台  

如果您想更换歌单的话，请到 server.rb 里找到：  
`data = %w{314048981 314103108 736959900 474153888}.inject([]) do |mem, id|`  
将里面的数字改成您想播放的歌单的 id（当然，是 netease 的）。  

由于加入了 ~~fontawesome~~ iconfont，在使用的时候请您自行把index.html里面的  
`<link rel="stylesheet" href="//at.alicdn.com/t/font_nr7nxvzlhpzrrudi.css>`  
这一行改成您要引用字体的css文件。  

### Usage  

```
git clone https://github.com/Shy07/Musicoon.git
cd FM.GITMV
bundle install
ruby server.rb
```
Then open http://localhost:4567 in your web browser and enjoy!  

### Update log  
Rewrite API with Ruby and use Sinatra Server.  
Used iconfont.  
Used fontawesome
Changed background-image to Arai-san & Fennic.  
Changed API to Meting
