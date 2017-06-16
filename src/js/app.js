/**
 *  FM.GITMV: GITMV = get my way
 *  https://fm.gitmv.com
 *  Version 1.0.0
 *
 *  Copyright 2017, Rynki <gernischt@gmail.com>
 *  Released under the MIT license
**/
import '../css/app.css'
import 'font-awesome/css/font-awesome.css'
import jQuery from 'jQuery'
import localAlbum from '../images/album.jpg'
window.$ = window.jQuery = jQuery

class FM_GITMV {
  constructor() {
    this.data = {}
    this.recursion = {
      currentTime: null,
      requestID: null
    }
    this.config = {
      volume: 1.0,
      expire: 1200,
      localName: 'FM.GITMV.logger',
      source: 'https://github.com/Shy07/FM.GITMV',
      player: 'player',
      playlist: 'playlist'
    }
    this.domNodes = {
      home: document.querySelector('#controller [data-id="fa-home"] .fa-button'),
      back: document.querySelector('#controller [data-id="fa-back"] .fa-button'),
      over: document.querySelector('#controller [data-id="fa-over"] .fa-button'),
      mode: document.querySelector('#controller [data-id="fa-mode"] .fa-button'),
      name: document.querySelector('#detail .name'),
      album: document.querySelector('#surface .album'),
      magic: document.querySelector('#surface .magic'),
      artists: document.querySelector('#detail .artists'),
      buffered: document.querySelector('#thread .buffered'),
      elapsed: document.querySelector('#thread .elapsed'),
      surface: document.querySelector('#surface'),
      faMagic: document.querySelector('#surface .magic .fa'),
      lyric: $('.lrc'),
      tLyric: $('.tlrc')
    }
    this.audio = document.createElement('audio')
    this.audio.volume = this.config.volume
    this.image = new Image()
    this.domNodes.name.textContent = 'Title'
    this.domNodes.artists.textContent = 'Artists'

    this.playingIndex = 0
    this.songNum = 0
    this.playList = null

    this.autoSkip = false
    this.touched = false  // for iOS

    $.getJSON(this.config.playlist, data => {
      this.playList = data
      this.songNum = data.length
      this.playingIndex = Math.round((this.songNum - 1) * Math.random() + 1)
      this.decorator()
    })
  }

  decorator() {
    this.createAlbum()
    this.addAlbumEvents()
    this.getLatestData()
    this.loadMusicInfo()
    this.addAudioEvents()
    this.addOtherEvents()
  }

  getLatestData() {
    let latestData = this.getLocalData()
    let dom = $('#mode')

    $.isPlainObject(latestData) && (this.data = latestData)
    this.data.lastID && (this.playingIndex = this.data.lastID)
    this.data.playMode && dom.attr('class', this.data.playMode)
    switch (this.data.playMode) {
    case 'fa fa-align-justify':
      this.audio.loop = false
      dom.attr({'class': 'fa fa-align-justify', 'title': 'List'})
      break
    case 'fa fa-repeat':
      this.audio.loop = true
      dom.attr({'class': 'fa fa-repeat', 'title': 'Single'})
      break
    case 'fa fa-random':
      this.audio.loop = false
      dom.attr({'class': 'fa fa-random', 'title': 'Random'})
      break
    }
  }

  getLocalData() {
    try {
      return JSON.parse(localStorage.getItem(this.config.localName))
    } catch (e) {
      console.warn(e.message)
      return null
    }
  }

  setLocalData() {
    this.data.lastID = this.playingIndex
    this.data.playMode = $('#mode').attr('class')
    try {
      localStorage.setItem(this.config.localName, JSON.stringify(this.data))
    } catch (e) {
      console.warn(e.message)
    }
  }

  nextTrack() {
    this.pauseAudio()
    if ($('#mode').attr('class') === 'fa fa-random') {
      this.playingIndex = Math.round((this.songNum - 1) * Math.random() + 1)
    } else {
      this.playingIndex += 1
      this.playingIndex === this.songNum && (this.playingIndex = 0)
    }
    this.loadMusicInfo()
  }

  prevTrack() {
    this.pauseAudio()
    this.playingIndex -= 1
    this.playingIndex === 0 && (this.playingIndex = this.songNum - 1)
    this.loadMusicInfo()
  }

  createAlbum(src) {
    this.image.src = typeof src === 'string' ? src : localAlbum
  }

  requestAlbumRotate() {
    const ANIMATION_FPS = 60
    const ONE_TURN_TIME = 30
    const ONE_TURN = Math.PI * 2
    const MAX_EACH_FRAME_TIME = 1000 / 50
    const EACH_FRAME_RADIAN = 1 / (ANIMATION_FPS * ONE_TURN_TIME) * ONE_TURN

    let context = this.domNodes.album.getContext('2d')

    let prevTimestamp = 0
    let loopAnimation = timestamp => {
      const MAX_LENGTH = Math.max(this.domNodes.album.width, this.domNodes.album.height) / 2
      const HALF_LENGTH = MAX_LENGTH / 2

      // prevTimestamp && timestamp - prevTimestamp > MAX_EACH_FRAME_TIME && console.warn(timestamp - prevTimestamp)
      prevTimestamp = timestamp

      context.translate(HALF_LENGTH, HALF_LENGTH)
      context.rotate(EACH_FRAME_RADIAN)
      context.translate(-HALF_LENGTH, -HALF_LENGTH)
      context.clearRect(0, 0, MAX_LENGTH, MAX_LENGTH)

      context.beginPath()
      context.fillStyle = context.createPattern(this.image, 'no-repeat')
      context.arc(HALF_LENGTH, HALF_LENGTH, HALF_LENGTH, 0, ONE_TURN)
      context.fill()
      context.closePath()

      context.beginPath()
      context.fillStyle = '#FFF'
      context.arc(HALF_LENGTH, HALF_LENGTH, HALF_LENGTH / 8, 0, ONE_TURN)
      context.fill()
      context.closePath()

      if (this.audio.paused) {
        this.cancelAlbumRotate()
      } else {
        this.recursion.requestID = window.requestAnimationFrame(loopAnimation);
      }
    }

    // In slow network, `this.requestAlbumRotate` will be trigger many times.
    // So we should run `cancelAnimationFrame` firstly.
    this.cancelAlbumRotate()
    this.recursion.requestID = window.requestAnimationFrame(loopAnimation)
  }

  cancelAlbumRotate() {
    this.recursion.requestID && window.cancelAnimationFrame(this.recursion.requestID)
  }

  addAlbumEvents() {
    $(this.image).on({
      'load': e => {
        const ONE_TURN = Math.PI * 2
        const MAX_LENGTH = Math.max(this.image.width, this.image.height)
        const HALF_LENGTH = MAX_LENGTH / 2

        this.domNodes.album.width = this.domNodes.album.height = MAX_LENGTH * 2

        let context = this.domNodes.album.getContext('2d')
        context.scale(2, 2)

        context.clearRect(0, 0, MAX_LENGTH, MAX_LENGTH)
        context.beginPath()
        context.fillStyle = context.createPattern(this.image, 'no-repeat')
        context.arc(HALF_LENGTH, HALF_LENGTH, HALF_LENGTH, 0, ONE_TURN)
        context.fill()
        context.closePath()

        context.beginPath()
        context.fillStyle = '#FFF'
        context.arc(HALF_LENGTH, HALF_LENGTH, HALF_LENGTH / 8, 0, ONE_TURN)
        context.fill()
        context.closePath()
      },
      'error': e => {
        this.src !== localAlbum && this.createAlbum(localAlbum)
      }
    })
  }

  loadMusicInfo() {
    $.getJSON(`${this.config.player}?id=${
      this.playList[this.playingIndex].id
    }`, song => {
      if (song.url === '' && this.autoSkip) {
        this.nextTrack()
      } else {
        this.renderAudio(song)
      }
    })
  }

  renderAudio(song) {
    let size = $(this.domNodes.album).width() * 2
    this.image.src = song.cover.replace(/\d+y\d+/, `${size}y${size}`)
    this.domNodes.name.textContent = song.music_name
    this.domNodes.artists.textContent = song.artists
    this.domNodes.lyric.html('')
    this.domNodes.tLyric.html('')
    this.audio.sourcePointer = song
    if (song.url === '') {
      this.domNodes.lyric.html("Can't be played because of Copyright")
      this.domNodes.tLyric.html('因版权原因暂时无法播放')
    } else {
      this.audio.src = song.url
      this.touched && this.playAudio()
    }
  }

  playAudio() {
    if (this.audio.sourcePointer.url === '') return

    let time = Math.ceil(Date.now() / 1000)
    let song = this.audio.sourcePointer
    let rest = this.audio.duration - this.audio.currentTime // Maybe `NaN`
    let minExpire = this.audio.duration || 120
    let expire = song.expire < minExpire ? this.config.expire : song.expire
    let isExpire = Math.ceil(rest) < expire && time - song.timestamp + Math.ceil(rest || 0) > expire

    // NO risk of recursion
    if (isExpire) {
      this.recursion.currentTime = this.audio.currentTime

      $.getJSON(`${this.config.player}?id=${
        this.playList[this.playingIndex].id
      }`, song => {
        this.audio.src = song.url
        this.audio.sourcePointer = song
        this.touched && this.playAudio()
      })
    } else {
      if (this.recursion.currentTime) {
        this.audio.currentTime = this.recursion.currentTime
        this.recursion.currentTime = null
      }
      this.audio.play()
      if (this.audio.sourcePointer.lrc != '') {
        this.lrcInterval = setInterval(this.displayLrc.bind(this), 500)
      }
      if (this.audio.sourcePointer.tlrc != '') {
        this.tlrcInterval = setInterval(this.displayTlrc.bind(this), 500)
      }
    }
  }

  pauseAudio() {
    this.audio.pause()
    this.audio.sourcePointer.lrc != '' &&  clearInterval(this.lrcInterval)
    this.audio.sourcePointer.tlrc != '' && clearInterval(this.tlrcInterval)
  }

  displayLrc() {
    let playTime = Math.floor(this.audio.currentTime).toString()
    this.domNodes.lyric.html(this.audio.sourcePointer.lrc[playTime])
  }

  displayTlrc() {
    let playTime = Math.floor(this.audio.currentTime).toString()
    this.domNodes.tLyric.html(this.audio.sourcePointer.tlrc[playTime])
  }

  addAudioEvents() {
    $(this.audio).on({
      'playing': e => {
        this.requestAlbumRotate()
      },
      'waiting': e => {
        this.cancelAlbumRotate()
      },
      'play': e => {
        $(this.domNodes.faMagic).removeClass('fa-play').addClass('fa-pause')
      },
      'pause': e => {
        $(this.domNodes.faMagic).removeClass('fa-pause').addClass('fa-play')
      },
      'ended': e => {
        // HTML5 video/audio doesn't become paused after playback ends on IE
        // Bug: https://connect.microsoft.com/IE/feedback/details/810454/html5-video-audio-doesnt-become-paused-after-playback-ends
        this.autoSkip = true
        this.nextTrack()
      },
      'timeupdate': e => {
        $(this.domNodes.elapsed).css('width', (this.audio.currentTime / this.audio.duration).toFixed(5) * 100 + '%');
      },
      'error': e => {
        // console.warn(e.message)
        this.recursion.currentTime = this.audio.currentTime
        this.pauseAudio()
        this.audio.src = this.audio.src
        this.audio.load()
        this.playAudio()
      }
    })

    setInterval(() => {
      this.domNodes.buffered.style.width = `${
        this.audio.buffered.length > 0
        ? Math.round(this.audio.buffered.end(0)) / Math.round(this.audio.duration) * 100
        : 0
      }%`
    }, 60)
  }

  addOtherEvents() {
    $(window).on('unload', e => {
      this.setLocalData()
    })

    $(document).on('keydown', e => {
      switch (e.which) {
      case 32: // Space
        e.preventDefault()
        this.touched = true
        this.audio.paused ? this.playAudio() : this.pauseAudio()
        break
      case 37:// Left
        e.preventDefault()
        this.touched = true
        this.autoSkip = false
        this.prevTrack()
        break
      case 39:// Right
        e.preventDefault()
        this.touched = true
        this.autoSkip = false
        this.nextTrack()
        break
      }
    })

    $(this.domNodes.home).on('click', e => {
      window.open(this.config.source)
    })

    $(this.domNodes.back).on('click', e => {
      this.touched = true
      this.autoSkip = false
      this.prevTrack()
    })

    $(this.domNodes.over).on('click', e => {
      this.touched = true
      this.autoSkip = false
      this.nextTrack()
    })

    $(this.domNodes.mode).on('click', e => {
      let dom = $('#mode')
      switch (dom.attr('class')) {
      case 'fa fa-align-justify':
        this.audio.loop = true
        dom.attr({'class': 'fa fa-repeat', 'title': 'Single'})
        break
      case 'fa fa-repeat':
        this.audio.loop = false
        dom.attr({'class': 'fa fa-random', 'title': 'Random'})
        break
      case 'fa fa-random':
        this.audio.loop = false
        dom.attr({'class': 'fa fa-align-justify', 'title': 'List'})
        break
      }
    })

    $(this.domNodes.magic).on('click', e => {
      this.touched = true
      this.audio.paused ? this.playAudio() : this.pauseAudio()
    })
  }
}

$(document).ready(() => new FM_GITMV())
