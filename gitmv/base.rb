
require 'net/http'
require 'json'
require 'digest'
require 'base64'
require 'openssl'
require 'zlib'
require 'stringio'

class Music_Base
  RETRY = 3

  def initialize
    @temp = {}
    @site = ''
    @format = false
    @req_setting = {}
  end

  def format(fmt = true)
    @format = fmt
    return self
  end

  def with_format(fmt = true)
    @format = fmt
    return self
  end

  def without_format()
    @format = false
    return self
  end

  def fetch(api)
    if api['encode']
      api = send api['encode'], api
    end
    ip = '61.190.69.142'
    if api['method'] == 'POST'
      uri = URI api['url']
      api['body'] = URI.encode_www_form(api['body']) if api['body'].is_a? Hash
      req = Net::HTTP::Post.new uri
      req.body = api['body']
    elsif api['method'] == 'GET'
      uri = URI api['url']
      uri.query = URI.encode_www_form(api['body']) if api['body']
      req = Net::HTTP::Get.new uri
    end
    req['X-Real-IP'] = ip
    req['Accept-Encoding'] = 'gzip'
    req['Cookie'] = @req_setting['cookie']
    req['Referer'] = @req_setting['referer']
    req['User-Agent'] = @req_setting['useragent']
    # req.open_timeout = 40
    # req.read_timeout = 20
    data = nil
    error = nil
    info = nil
    RETRY.times do |i|
      res = Net::HTTP.start(uri.hostname, uri.port) {|http| http.request req }
      case res
      when Net::HTTPSuccess
        if res['Content-Encoding'] == 'gzip'
          gz = Zlib::GzipReader.new(StringIO.new(res.body.to_s))
          data = gz.read
        else
          data = res.body
        end
      else
        error = res.code
        info = res.message
      end
      break unless error
    end
    if error
      return {
          error: error,
          info: info
      }.to_json
    end
    data = (send api['decode'], data) if @format && api['decode']
    if @format && api['format']
      data = JSON.parse data
      data = (clean data, api['format']).to_json
    end
    data
  end

  def pickup(array, rule)
    rule.split('#').each do |value|
      return nil if array.nil?
      array = array[value]
    end
    array
  end

  def clean(raw, rule)
    raw = pickup(raw, rule) unless rule.empty?
    if raw.nil?
      raw = []
    elsif !raw[0] && raw.size
      raw = [raw]
    end
    raw.map {|e| send "format_#{@site}", e}
  end

  def search(keyword, page = 1, limit = 30)
  end

  def song(id)
  end

  def album(id)
  end

  def artist(id, limit = 50)
  end

  def playlist(id)
  end

  def url(id, br = 320)
  end

  def lyric(id)
  end

  def pic(id, size = 300)
  end

  def json_from(jsonp)
    jsonp[/{.+}/]
  end

end
