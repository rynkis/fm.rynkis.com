/**
 *  FM.GITMV: GITMV = get my way
 *  https://fm.gitmv.com
 *  Version 1.0.0
 *
 *  Copyright 2017, Rynki <gernischt@gmail.com>
 *  Released under the MIT license
 **/
import '../css/app.sass'
import 'font-awesome/css/font-awesome.css'
import jQuery from 'jquery'
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
      music: 'music',
      playlist: 'playlist'
    }
    this.domNodes = {
      home: document.querySelector('#controller [data-id="fa-home"] .fa-button'),
      back: document.querySelector('#controller [data-id="fa-back"] .fa-button'),
      over: document.querySelector('#controller [data-id="fa-over"] .fa-button'),
      mode: document.querySelector('#controller [data-id="fa-mode"] .fa-button i'),
      title: document.querySelector('#detail .title'),
      album: document.querySelector('#surface .album'),
      magic: document.querySelector('#surface .magic'),
      artists: document.querySelector('#detail .artists'),
      buffered: document.querySelector('#thread .buffered'),
      elapsed: document.querySelector('#thread .elapsed'),
      surface: document.querySelector('#surface'),
      faMagic: document.querySelector('#surface .magic .fa'),
      lyric: document.querySelector('#lyric .lrc'),
      tLyric: document.querySelector('#lyric .tlrc')
    }
    this.audio = document.createElement('audio')
    this.audio.volume = this.config.volume
    this.image = new Image()
    this.domNodes.title.textContent = 'Title'
    this.domNodes.artists.textContent = 'Artists'
    this.playingIndex = 0
    this.songNum = 0
    this.playList = null
    this.autoSkip = false
    this.prevFrameRadian = 0
    this.lrcInterval = null
    this.start()
  }

  start() {
    $.getJSON(this.config.playlist, data => {
      this.playList = data
      this.songNum = data.length
      this.playingIndex = Math.round((this.songNum - 1) * Math.random() + 1)
      this.createAlbum()
      this.addAlbumEvents()
      this.getLatestData()
      this.loadMusicInfo()
      this.addAudioEvents()
      this.addOtherEvents()
    })
  }

  getLatestData() {
    let latestData = this.getLocalData()
    $.isPlainObject(latestData) && (this.data = latestData)
    this.data.lastID && (this.playingIndex = this.data.lastID)
    this.data.playMode && this.domNodes.mode.setAttribute('class', this.data.playMode)
    switch (this.data.playMode) {
      case 'fa fa-align-justify':
        this.audio.loop = false
        this.domNodes.mode.setAttribute('class', 'fa fa-align-justify')
        this.domNodes.mode.setAttribute('title', 'List')
        break
      case 'fa fa-repeat':
        this.audio.loop = true
        this.domNodes.mode.setAttribute('class', 'fa fa-repeat')
        this.domNodes.mode.setAttribute('title', 'Single')
        break
      case 'fa fa-random':
        this.audio.loop = false
        this.domNodes.mode.setAttribute('class', 'fa fa-random')
        this.domNodes.mode.setAttribute('title', 'Random')
        break
    }
  }

  getLocalData() {
    try {
      return JSON.parse(localStorage.getItem(this.config.localName))
    } catch (e) {
      console.warn(e)
      return null
    }
  }

  setLocalData() {
    this.data.lastID = this.playingIndex
    this.data.playMode = this.domNodes.mode.getAttribute('class')
    try {
      localStorage.setItem(this.config.localName, JSON.stringify(this.data))
    } catch (e) {
      console.warn(e)
    }
  }

  nextTrack() {
    this.pauseAudio()
    if (this.domNodes.mode.getAttribute('class') === 'fa fa-random') {
      this.playingIndex = Math.round((this.songNum - 1) * Math.random() + 1)
    } else {
      this.playingIndex += 1
    }
    this.loadMusicInfo()
  }

  prevTrack() {
    this.pauseAudio()
    this.playingIndex -= 1
    this.loadMusicInfo()
  }

  loadMusicInfo() {
    this.playingIndex >= this.songNum && (this.playingIndex = 0)
    this.playingIndex < 0 && (this.playingIndex = this.songNum - 1)
    $.getJSON(`${this.config.music}/${this.playList[this.playingIndex].id}`, song => {
      song.url === '' && this.autoSkip ? this.nextTrack() : this.renderAudio(song)
    })
  }

  renderAudio(song) {
    let size = $(this.domNodes.album).width() * 2
    this.image.src = song.cover.replace(/\d+y\d+/, `${size}y${size}`)
    this.domNodes.title.textContent = song.title
    this.domNodes.artists.textContent = song.artists
    this.domNodes.lyric.textContent = ''
    this.domNodes.tLyric.textContent = ''
    this.audio.sourcePointer = song
    if (song.url === '') {
      this.domNodes.lyric.textContent = "Can't be played because of Copyright"
      this.domNodes.tLyric.textContent = '因版权原因暂时无法播放'
    } else {
      this.audio.src = song.url
      this.playAudio()
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
      $.getJSON(`${this.config.music}/${this.playList[this.playingIndex].id}`, song => {
        this.audio.src = song.url
        this.audio.sourcePointer = song
        this.playAudio()
      })
    } else {
      if (this.recursion.currentTime) {
        this.audio.currentTime = this.recursion.currentTime
        this.recursion.currentTime = null
      }
      this.audio.play()
    }
  }

  pauseAudio() {
    this.audio.pause()
  }

  displayLrc() {
    let playTime = Math.floor(this.audio.currentTime)
    if (typeof this.audio.sourcePointer.lrc[playTime] !== 'string') return
    this.domNodes.lyric.textContent = this.audio.sourcePointer.lrc[playTime]
    if (this.audio.sourcePointer.lrc[playTime] === '') {
      return this.domNodes.tLyric.textContent = ''
    }
    if (typeof this.audio.sourcePointer.tlrc[playTime] !== 'string') return
    this.domNodes.tLyric.textContent = this.audio.sourcePointer.tlrc[playTime]
  }

  createAlbum(src) {
    this.image.src = typeof src === 'string' ? src : localAlbum
  }

  updateAlbumRotateCSS(deg) {
    let album = $(this.domNodes.album)
    let value = `rotate(${deg}deg)`
    const prefixes = ['', '-ms-', '-moz-', '-webkit-', '-o-']
    for (let prefix of prefixes) album.css(`${prefix}transform`, value)
  }

  requestAlbumRotate() {
    const ANIMATION_FPS = 60
    const ONE_TURN_TIME = 30
    const ONE_TURN = 360 //Math.PI * 2
    const MAX_EACH_FRAME_TIME = 1000 / 50
    const EACH_FRAME_RADIAN = 1 / (ANIMATION_FPS * ONE_TURN_TIME) * ONE_TURN

    let prevTimestamp = 0
    let loopAnimation = timestamp => {
      // prevTimestamp && timestamp - prevTimestamp > MAX_EACH_FRAME_TIME && console.warn(timestamp - prevTimestamp)
      prevTimestamp = timestamp

      this.prevFrameRadian += EACH_FRAME_RADIAN
      this.prevFrameRadian >= ONE_TURN && (this.prevFrameRadian -= ONE_TURN)
      this.updateAlbumRotateCSS(this.prevFrameRadian)

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

        this.prevFrameRadian = 0
        this.domNodes.album.width = this.domNodes.album.height = MAX_LENGTH * 2
        let context = this.domNodes.album.getContext('2d')
        this.domNodes.album.pattern = context.createPattern(this.image, 'no-repeat')

        context.scale(2, 2)
        context.clearRect(0, 0, MAX_LENGTH, MAX_LENGTH)
        context.beginPath()
        context.fillStyle = this.domNodes.album.pattern
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

  addAudioEvents() {
    $(this.audio).on({
      'playing': e => {
        this.requestAlbumRotate()
        this.lrcInterval !== null && clearInterval(this.lrcInterval) && (this.lrcInterval = null)
        this.audio.sourcePointer.lrc !== '' && (this.lrcInterval = setInterval(this.displayLrc.bind(this), 500))
      },
      'waiting': e => {
        this.cancelAlbumRotate()
        this.lrcInterval !== null && clearInterval(this.lrcInterval) && (this.lrcInterval = null)
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
        $(this.domNodes.elapsed).css('width', `${
          (this.audio.currentTime / this.audio.duration).toFixed(5) * 100}%`)
      },
      'error': e => {
        console.warn(e)
        // this.recursion.currentTime = this.audio.currentTime
        // this.pauseAudio()
        // this.audio.src = this.audio.sourcePointer.url
        // this.audio.load()
        // this.playAudio()
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
    $(window).on('unload', e => this.setLocalData())

    $(document).on('keydown', e => {
      switch (e.which) {
        case 32: // Space
          e.preventDefault()
          this.audio.paused ? this.playAudio() : this.pauseAudio()
          break
        case 37: // Left
          e.preventDefault()
          this.autoSkip = false
          this.prevTrack()
          break
        case 39: // Right
          e.preventDefault()
          this.autoSkip = false
          this.nextTrack()
          break
      }
    })

    $(this.domNodes.home).on('click', e => window.open(this.config.source))

    $(this.domNodes.back).on('click', e => {
      this.autoSkip = false
      this.prevTrack()
    })

    $(this.domNodes.over).on('click', e => {
      this.autoSkip = false
      this.nextTrack()
    })

    $(this.domNodes.mode).on('click', e => {
      switch (this.domNodes.mode.getAttribute('class')) {
        case 'fa fa-align-justify':
          this.audio.loop = true
          this.domNodes.mode.setAttribute('class', 'fa fa-repeat')
          this.domNodes.mode.setAttribute('title', 'Single')
          break
        case 'fa fa-repeat':
          this.audio.loop = false
          this.domNodes.mode.setAttribute('class', 'fa fa-random')
          this.domNodes.mode.setAttribute('title', 'Random')
          break
        case 'fa fa-random':
          this.audio.loop = false
          this.domNodes.mode.setAttribute('class', 'fa fa-align-justify')
          this.domNodes.mode.setAttribute('title', 'List')
          break
      }
    })

    $(this.domNodes.magic).on('click', e => {
      this.audio.paused ? this.playAudio() : this.pauseAudio()
    })
  }
}

$(document).ready(() => new FM_GITMV())
