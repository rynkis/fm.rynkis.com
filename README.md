FM.GITMV
========

### 私人电台  

如果您想更换歌单的话，请到 server.rb 里找到：  
`data = %w{314048981 314103108 736959900 474153888 474169501 575981675 588510730}.inject([]) do |mem, id|`  
将里面的数字改成您想播放的歌单的 id（当然，是 netease 的）。  

### Usage  

```
git clone https://github.com/Shy07/Musicoon.git
cd FM.GITMV
bundle install
ruby server.rb
```
Then open http://localhost:4567 in your web browser and enjoy!  

### Update log  
Rewrite player with jQuery + ES6.  
Rewrite API with Ruby and use Sinatra Server.  
