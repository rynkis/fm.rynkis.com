#encoding=utf-8
#
#  Gitmv = get my way
#  https://gitmv.com
#  Version 1.0.0
#
#  Copyright 2017, Rynki <gernischt@gmail.com>
#  Released under the MIT license
#
require './gitmv/netease'
require 'sinatra'

set :public_folder, File.dirname(__FILE__)

$api = Netease.new

html =<<__TEXT__
<html>
    <header>
    </header>
    <body>
        <link rel="stylesheet" href="css/playlist.css">
        <link rel="stylesheet" href="//at.alicdn.com/t/font_nr7nxvzlhpzrrudi.css">
        <script src="js/jquery-3.2.1.min.js" type="text/javascript">
        </script>
        <link rel="stylesheet" href="css/player.css">
        <link rel="stylesheet" href="css/progressbar.css">
        <div class="back">
        </div>
        <div id="container">
            <div class="player">
                <div id="cd" class="cd">
                    <div class="out">
                    </div>
                    <div id="album" class="album">
                    </div>
                    <div id="in" class="in">
                    </div>
                </div>
		<div id="slider"></div>
                <div id="scrollBar">
                    <div id="scroll_Buffered">
                    </div>
                    <div id="scroll_Track">
                    </div>
                    <div id="scroll_Thumb" draggable="true">
                    </div>
                </div>
                <div class="toolBar">
                    <a href="javascript:rewindAudio()">
                        <i id="rewindAudio" class="fa fa-backward fa-lg" title="-10s" aria-hidden="true"></i>
                    </a>
                    <div id="scrollBarTxt">
                    </div>
                    <a href="javascript:forwardAudio()">
                        <i id="forwardAudio" class="fa fa-forward fa-lg" title="+10s" aria-hidden="true"></i>
                    </a>
                </div>
                <div class="action">
                    <a href="javascript:playMode()">
                        <i id="mode" class="fa fa-align-justify fa-lg" title="列表循环" aria-hidden="true"></i>
                    <a href="javascript:m_play()">
                        <i id="m_play" class="fa fa-play fa-lg" title="播放" aria-hidden="true"></i>
                    </a>
                    <a href="javascript:next_music()">
                        <i id="next_music" class="fa fa-step-forward fa-lg" title="下一首" aria-hidden="true"></i>
                    </a>
                    <a href="javascript:mute()">
                        <i id="vol" class="fa fa-volume-up fa-lg" title="点击即可静音" aria-hidden="true"></i>
                    </a>
                    <input id="range" type="range" min="0" max="100" value="50" onchange="volume(this.value)">
                </div>
                <div class="info">
                    <span id="music_name">
                    </span>
                    <span id="artist">
                    </span>
                </div>
                <div id="lrc" class="lrc">
                </div>
                <div id="tlrc" class="tlrc">
                </div>
            </div>
            <ul id="playList">
            </ul>
        </div>
        <audio id="player" preload="auto">
        </audio>
        <script src="js/player.js" type="text/javascript">
        </script>
        <script src="js/progressbar.js" type="text/javascript">
        </script>
    </body>
</html>
__TEXT__

get('/') do
  html
end

get('/src/playlist.php') do
  data = %w{314048981 314103108 736959900 474153888}.inject([]) do |mem, id|
    result = $api.with_format.playlist id
    mem + (JSON.parse result)
  end
  headers 'Content-type' => 'application/json; charset=UTF-8'
  data.to_json
end

get('/src/player.php') do
  id = params["id"]
  detail = $api.with_format.song id
  det_info = JSON.parse detail
  cover = $api.with_format.pic det_info[0]["pic_id"]
  cov_info = JSON.parse cover
  mp3 = $api.with_format.url id
  mp3_info = JSON.parse mp3
  lyric111 = $api.with_format.lyric id
  lrc_info = JSON.parse lyric111
  # 处理音乐信息
  play_info = {}
  play_info["id"] = id
  play_info["lrc"] = {}
  play_info["tlrc"] = {}
  play_info["cover"] = cov_info["url"]
  play_info["music_name"] = det_info[0]["name"]
  play_info["mp3"] = mp3_info["url"]
  play_info["mp3"] = play_info["mp3"].gsub('http://', 'https://')
  play_info["mp3"] = play_info["mp3"].gsub('https://m8', 'https://m7')
  det_info[0]["artist"].each do |key|
    unless play_info["artists"]
      play_info["artists"] = key
    else
      play_info["artists"] += "," + key
    end
  end
  if lrc_info["lyric"] != ""
    lrc = lrc_info["lyric"].split "\n"
    lrc.pop
    lrc.each do |rows|
      row = rows.split ']'
      if row.length == 1
        # play_info["lrc"][0] = "no"
        next
      else
        col_text = row.pop
        row.each do |key|
          time1 = key[1, key.length - 1].split ":"
          time1 = time1[0].to_i * 60 + time1[1].to_i;
          play_info["lrc"][time1] = col_text;
        end
      end
    end
  else
    time = "0"
    play_info["lrc"][0] = "No Lyrics / 很抱歉，這首曲子暫無歌詞"
  end
  # 翻译的歌词
  if lrc_info["tlyric"] != ""
    tlrc = lrc_info["tlyric"].split "\n"
    tlrc.pop
    tlrc.each do |rows|
      row = rows.split ']'
      if row.length == 1
        # play_info["tlrc"][0] = "no"
        next
      else
        col_text = row.pop
        row.each do |key|
          time = key[1, key.length - 1].split ":"
          time = time[0].to_i * 60 + time[1].to_i
          play_info["tlrc"][time] = col_text
        end
      end
    end
  else
    play_info["tlrc"][0] = ""
  end
  headers 'Content-type' => 'application/json; charset=UTF-8'
  play_info.to_json
end
