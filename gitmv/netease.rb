
$LOAD_PATH << File.dirname(__FILE__)

require 'base'

class Netease < Music_Base
  def initialize
    super
    @site = 'netease'
    @req_setting = {
        'referer' => 'https://music.163.com/',
        'cookie' => 'os=linux; appver=1.0.0.1026; osver=Ubuntu%2016.10; MUSIC_U=78d411095f4b022667bc8ec49e9a44cca088df057d987f5feaf066d37458e41c4a7d9447977352cf27ea9fee03f6ec4441049cea1c6bb9b6; __remember_me=true',
        'useragent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }
  end

  def search(keyword, page = 1, limit = 30)
    fetch({
      'method' => 'POST',
      'url' => 'http://music.163.com/api/linux/forward',
      'body' => {
        'method' => 'POST',
        'params' => {
          's' => keyword,
          'type' => 1,
          'limit' => limit,
          'total' => 'true',
          'offset' => page - 1
        },
        'url' => 'http://music.163.com/api/cloudsearch/pc'
      },
      'encode' => 'netease_AESECB',
      'format' => 'result#songs'
    })
  end

  def song(id)
    fetch({
      'method' => 'POST',
      'url' => 'http://music.163.com/api/linux/forward',
      'body' => {
        'method' => 'POST',
        'params' => {
          'c' => "[{\"id\":#{id}}]"
        },
        'url' => 'http://music.163.com/api/v3/song/detail'
      },
      'encode' => 'netease_AESECB',
      'format' => 'songs'
    })
  end

  def album(id)
    fetch({
      'method' => 'POST',
      'url' => 'http://music.163.com/api/linux/forward',
      'body' => {
        'method' => 'GET',
        'params' => { 'id' => id },
        'url' => 'http://music.163.com/api/v1/album/' + id
      },
      'encode' => 'netease_AESECB',
      'format' => 'songs'
    })
  end

  def artist(id, limit = 50)
    fetch({
      'method' => 'POST',
      'url' => 'http://music.163.com/api/linux/forward',
      'body' => {
        'method' => 'GET',
        'params' => {
          'top' => limit,
          "id" => id,
          "ext" => "true"
        },
        'url' => 'http://music.163.com/api/v1/artist/' + id
      },
      'encode' => 'netease_AESECB',
      'format' => 'hotSongs'
    })
  end

  def playlist(id)
    fetch({
      'method' => 'POST',
      'url' => 'http://music.163.com/api/linux/forward',
      'body' => {
        'method' => 'POST',
        'params' => {
          'id' => id,
          'n' => 1000
        },
        'url' => 'http://music.163.com/api/v3/playlist/detail',
      },
      'encode' => 'netease_AESECB',
      'format' => 'playlist#tracks'
    })
  end

  def url(id, br = 320)
    @temp['br'] = br
    fetch({
      'method' => 'POST',
      'url' => 'http://music.163.com/api/linux/forward',
      'body' => {
        'method' => 'POST',
        'params' => {
          'ids' => [id],
          'br' => br * 1000
        },
        'url' => 'http://music.163.com/api/song/enhance/player/url'
      },
      'encode' => 'netease_AESECB',
      'decode' => 'netease_url'
    })
  end

  def lyric(id)
    fetch({
      'method' => 'POST',
      'url' => 'http://music.163.com/api/linux/forward',
      'body' => {
        'method' => 'POST',
        'params' => {
          'id' => id,
          'os' => 'linux',
          'lv' => -1,
          'kv' => -1,
          'tv' => -1
        },
        'url' => 'http://music.163.com/api/song/lyric',
      },
      'encode' => 'netease_AESECB',
      'decode' => 'netease_lyric'
    })
  end

  def pic(id, size = 300)
    url = "https://p3.music.126.net/#{netease_pickey id}/#{id}.jpg?param=#{size}y#{size}"
    {url: url}.to_json
  end

  def netease_AESECB(api)
    key = '7246674226682325323F5E6544673A51'
    body = api['body'].to_json
    cipher = OpenSSL::Cipher.new("aes-128-ecb")
    cipher.encrypt
    cipher.key = key.hex2bin
    encrypted = cipher.update(body) + cipher.final
    body = (encrypted.unpack 'H*').join.upcase
    api['body'] = { eparams: body }
    api
  end

  def netease_pickey(id)
    magic = '3go8&$8*3*3h0k(2)2'.split ''
    song_id = "#{id}".split ''
    song_id.length.times do |i|
      song_id[i] = (song_id[i].ord ^ magic[i % magic.length].ord).chr
    end
    result = Base64.encode64 (Digest::MD5.hexdigest song_id.join).hex2bin
    result.rstrip.gsub('/', '_').gsub('+', '-')
  end
  #
  # => URL - 歌曲地址转换函数
  #     用于返回不高于指定 bitRate 的歌曲地址（默认规范化）
  #
  def netease_url(result)
    data = JSON.parse result
    url = if data['data'] && data['data'][0] && data['data'][0]['uf'] && data['data'][0]['uf']['url']
      {
        'size' => data['data'][0]['size'],
        'url' => data['data'][0]['uf']['url'],
        'br'  => data['data'][0]['uf']['br'] / 1000,
        'expire' => data['data'][0]['expi'],
        'timestamp' => Time.now.to_i
      }
    elsif data['data'] && data['data'][0] && data['data'][0]['url']
      {
        'size' => data['data'][0]['size'],
        'url' => data['data'][0]['url'],
        'br'  => data['data'][0]['br'] / 1000,
        'expire' => data['data'][0]['expi'],
        'timestamp' => Time.now.to_i
      }
    else
      {
        'url' => '',
        'br'  => -1
      }
    end
    url.to_json
  end
  #
  # =>  歌词处理模块
  #     用于规范化歌词输出
  #
  def netease_lyric(result)
    return result unless @format
    result = JSON.parse result
    data = {
      'lyric'  => result['lrc'] && result['lrc']['lyric'] ? result['lrc']['lyric'] : '',
      'tlyric' => result['tlyric'] && result['tlyric']['lyric'] ? result['tlyric']['lyric'] : ''
    }
    data.to_json
  end
  #
  # =>  Format - 规范化函数
  #     用于统一返回的参数，可用 .format() 一次性开关开启
  #
  def format_netease(data)
    result = {
      'id'    => data['id'],
      'name'    => data['name'],
      'artist'  => [],
      'pic_id'  => data['al'] && data['al']['pic_str'] ? data['al']['pic_str'] : data['al']['pic'],
      'url_id'  => data['id'],
      'lyric_id'  => data['id'],
      'source'  => 'netease'
    }
    if data['al'] && data['al']['picUrl']
      match = data['al']['picUrl'].match /\/(\d+)\./
      result['pic_id'] = match[1]
    end
    data['ar'].each {|value| result['artist'] << value['name']}
    result
  end
end
