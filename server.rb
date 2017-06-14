#encoding=utf-8
#
#  FM.GITMV: GITMV = get my way
#  https://fm.gitmv.com
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
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>FM.GITMV - get my way</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="keywords" content="FM.GITMV">
  <meta name="description" content="get my way">
  <link rel="stylesheet" href="//at.alicdn.com/t/font_nr7nxvzlhpzrrudi.css">
  <link rel="stylesheet" href="css/playlist.css">
  <link rel="stylesheet" href="css/player.css">
  <link rel="stylesheet" href="css/progressbar.css">
  <script src="js/jquery-3.2.1.min.js"></script>
</head>
<body>
  <div class="back"></div>
  <div id="container">
    <div class="player">
      <div id="cd" class="cd">
        <div class="out"></div>
        <div id="album" class="album"></div>
        <div id="in" class="in"></div>
      </div>
      <div id="slider"></div>
      <div id="scrollBar">
        <div id="scroll_Buffered"></div>
        <div id="scroll_Track"></div>
        <div id="scroll_Thumb" draggable="true"></div>
      </div>
      <div class="toolBar">
        <a href="javascript:rewindAudio()">
          <i id="rewindAudio" class="fa fa-backward fa-lg" title="-10s" aria-hidden="true"></i>
        </a>
        <div id="scrollBarTxt"></div>
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
        <span id="music_name"></span>
        <span id="artist"></span>
      </div>
      <div id="lrc" class="lrc"></div>
      <div id="tlrc" class="tlrc"></div>
    </div>
    <ul id="playList"></ul>
  </div>
  <audio id="player" preload="auto"></audio>
  <script src="js/player.js"></script>
  <script src="js/progressbar.js"></script>
</body>
</html>
__TEXT__

get('/') do
  html
end

get('/playlist') do
  data = %w{314048981 314103108 736959900 474153888}.inject([]) do |mem, id|
    result = $api.with_format.playlist id
    mem + (JSON.parse result)
  end
  headers 'Content-type' => 'application/json; charset=UTF-8'
  data.to_json
end

get('/player') do
  id = params['id']
  det_info = JSON.parse $api.with_format.song id
  cov_info = JSON.parse $api.with_format.pic det_info[0]['pic_id']
  mp3_info = JSON.parse $api.with_format.url id
  lrc_info = JSON.parse $api.with_format.lyric id

  play_info = {}
  play_info['id'] = id
  play_info['lrc'] = {}
  play_info['tlrc'] = {}
  play_info['cover'] = cov_info['url']
  play_info['music_name'] = det_info[0]['name']
  play_info['mp3'] = mp3_info['url']
  play_info['mp3'] = play_info['mp3'].gsub('http://', 'https://')
                                     .gsub('https://m8', 'https://m7')
  play_info['artists'] = det_info[0]['artist'].join ', '

  { 'lyric' => ['lrc', 'No Lyrics / 很抱歉，這首曲子暫無歌詞'],
    'tlyric' => ['tlrc', ''] }.each do |lyric, value|
    if lrc_info[lyric] != ''
      lrc = lrc_info[lyric].split "\n"
      # lrc.pop
      lrc.each do |rows|
        times = []
        rows.scan(/\[[^\[\]]*\]/) { |match| times << match }
        if times.size.zero?
          play_info[value[0]][0] = 'no'
          break
        end
        col_text = rows.gsub(/\[[^\[\]]*\]/, '')
        times.each do |key|
          time = key[1, key.length - 1].split ':'
          time = time[0].to_i * 60 + time[1].to_i
          play_info[value[0]][time] = col_text
        end
      end
    else
      play_info[value[0]][0] = value[1]
    end
  end

  headers 'Content-type' => 'application/json; charset=UTF-8'
  play_info.to_json
end
