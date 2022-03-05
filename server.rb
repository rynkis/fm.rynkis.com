#encoding=utf-8
#
#  FM.GITMV: GITMV = get my way
#  https://fm.gitmv.com
#  Version 1.0.0
#
#  Copyright 2017, Rynki <gernischt@gmail.com>
#  Released under the MIT license
#
require './lib/netease'
require 'sinatra'

set :public_folder, File.dirname(__FILE__) + '/static'

$api = Netease.new

before do
  if request.request_method == 'OPTIONS'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET'
    response.headers['Access-Control-Allow-Headers'] = 'x-access-token'
    halt 200
  end
end

html =<<__TEXT__
<!DOCTYPE HTML>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>FM.GITMV - get my way</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="keywords" content="FM.GITMV">
  <meta name="description" content="get my way">
  <link rel="shortcut icon" href="/icons/favicon.ico">
  <base href="./">
</head>
<body>
<article>
  <div id="backdrop"></div>
  <div id="showcase">
    <div id="surface">
      <div class="cover"><canvas class="album" width="100" height="100"></canvas></div>
      <div class="magic"><i class="fa fa-play"></i></div>
    </div>
    <div id="thread">
      <div class="buffered"></div>
      <div class="elapsed"></div>
    </div>
    <div id="detail">
      <div class="title"></div>
      <div class="artists"></div>
    </div>
    <div id="lyric">
      <div class="lrc"></div>
      <div class="tlrc"></div>
    </div>
  </div>
  <div id="controller">
    <div class="item" data-id="fa-home"><a class="fa-button"><i class="fa fa-home" title="Home"></i></a></div>
    <div class="item" data-id="fa-back"><a class="fa-button"><i class="fa fa-chevron-up" title="Prev"></i></a></div>
    <div class="item" data-id="fa-over"><a class="fa-button"><i class="fa fa-chevron-down" title="Next"></i></a></div>
    <div class="item" data-id="fa-mode"><a class="fa-button"><i class="fa fa-random" title="Random"></i></a></div>
  </div>
</article>
<script src="assets/app.js"></script>
</body>
</html>
__TEXT__

get('/') do
  html
end

get('/playlist') do
  data = %w{7320208569}.inject([]) do |mem, id|
    result = $api.with_format.playlist id
    mem + (JSON.parse result)
  end
  data = data.map {|e|e['id']}
  headers 'Access-Control-Allow-Origin' => '*'
  headers 'Content-type' => 'application/json; charset=UTF-8'
  data.to_json
end

get('/music/:id') do |id|
  det_info = JSON.parse $api.with_format.song id
  cov_info = JSON.parse $api.with_format.pic det_info[0]['pic_id']
  lrc_info = JSON.parse $api.with_format.lyric id

  play_info = JSON.parse $api.with_format.url id
  play_info['id'] = id
  play_info['lrc'] = {}
  play_info['tlrc'] = {}
  play_info['cover'] = cov_info['url']
  play_info['title'] = det_info[0]['name']
  play_info['url'] = play_info['url'].gsub /https:/, 'http:' #/http??:\/\/m8/, 'http://m7'
  play_info['artists'] = det_info[0]['artist'].join ', '

  { 'lyric' => ['lrc', 'No Lyrics'],
    'tlyric' => ['tlrc', ''] }.each do |lyric, value|
    if lrc_info[lyric] != ''
      lrc = lrc_info[lyric].split "\n"
      # lrc.pop
      lrc.each do |rows|
        times = []
        rows.scan(/\[[^\[\]]*\]/) { |match| times << match }
        if times.size.zero?
          play_info[value[0]][0] = value[1]
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

  headers 'Access-Control-Allow-Origin' => '*'
  headers 'Content-type' => 'application/json; charset=UTF-8'
  play_info.to_json
end
