import axios from 'axios'
import { isPlainObject } from 'lodash/fp'
import mobile from 'is-mobile'
import setTitle from './setTitle'
import speech from './speech'

const localAlbum = '/images/album.jpg'

const SIZES = [96, 128, 192, 256, 384, 512]

interface Song {
  id: string
  cover: string
  title: string
  album: string
  url: string
  artists: string
  expire: number
  timestamp: number
  lrc: string[] | string
  tlrc: string[] | string
}

interface Audio extends HTMLAudioElement {
  sourcePointer: Song
}

interface Speech {
  speechPrimed: boolean
  messages: any
  allVoices: any[]
  synth: SpeechSynthesis
}

class Player {
  data: any = {}
  recursion: any
  config: any
  domNodes: any
  audio: Audio
  image: HTMLImageElement
  playingIndex: number = 0
  songNum: number = 0
  listHash: string = ''
  playList: [] = []
  autoSkip: boolean = false
  prevFrameRadian: number = 0
  lrcInterval: any = null
  speech: Speech = {
    speechPrimed: false,
    messages: null,
    allVoices: [],
    synth: speechSynthesis
  }
  constructor() {
    this.recursion = {
      currentTime: null,
      requestID: null
    }
    this.config = {
      siteTitle: "Rynkis' FM",
      volume: 0.5,
      expire: 1200,
      localName: 'Rynkis.FM.logger',
      source: 'https://github.com/Shy07/fm.rynkis.com',
      music: '/api/music',
      lyrics: '/api/lyrics',
      playlist: '/api/playlist'
    }
    this.domNodes = {
      home: document.querySelector(
        '#controller [data-id="fa-home"] .fa-button'
      ),
      back: document.querySelector(
        '#controller [data-id="fa-back"] .fa-button'
      ),
      over: document.querySelector(
        '#controller [data-id="fa-over"] .fa-button'
      ),
      mode: document.querySelector(
        '#controller [data-id="fa-mode"] .fa-button i'
      ),
      title: document.querySelector('#detail .title'),
      album: document.querySelector('#surface .album'),
      magic: document.querySelector('#surface .magic'),
      artists: document.querySelector('#detail .artists'),
      buffered: document.querySelector('#thread .progress .buffered'),
      elapsed: document.querySelector('#thread .progress .elapsed'),
      volume: document.querySelector('#thread .volume i'),
      surface: document.querySelector('#surface'),
      faMagic: document.querySelector('#surface .magic .fa'),
      lyric: document.querySelector('#lyric .lrc'),
      tLyric: document.querySelector('#lyric .tlrc'),
      backdrop: document.querySelector('#backdrop'),
      fullscreenMask: document.querySelector('.fullscreen-mask'),
      fullscreenMaskMobile: document.querySelector('.fullscreen-mask-mobile')
    }
    this.audio = window.document.createElement('audio') as Audio
    this.audio.volume = this.config.volume
    this.image = new Image()
    this.image.crossOrigin = 'anonymous'
    this.domNodes.title.textContent = 'Title'
    this.domNodes.artists.textContent = 'Artists'
    this.speech.allVoices = this.speech.synth.getVoices()
    this.start()
  }

  private async start() {
    const { data } = await axios(this.config.playlist)
    if (!data) return
    this.speech.messages = speech.parseSpeech(data.msgs)
    this.listHash = data.hash
    this.playList = data.ids
    this.songNum = this.playList.length
    this.playingIndex = Math.floor(Math.random() * this.songNum)
    this.createAlbum()
    this.addAlbumEvents()
    this.getLatestData()
    this.loadMusicInfo('start')
    this.addAudioEvents()
    this.addOtherEvents()
  }

  private createAlbum(src: any = null) {
    this.image.src = typeof src === 'string' ? src : localAlbum
  }

  private addAlbumEvents() {
    this.image.addEventListener('load', () => {
      const ONE_TURN = Math.PI * 2
      const MAX_LENGTH = Math.max(this.image.width, this.image.height)
      const HALF_LENGTH = MAX_LENGTH / 2

      this.prevFrameRadian = 0
      this.domNodes.album.width = this.domNodes.album.height = MAX_LENGTH * 2
      const context = this.domNodes.album.getContext('2d')
      this.domNodes.album.pattern = context.createPattern(
        this.image,
        'no-repeat'
      )

      context.scale(2, 2)
      context.clearRect(0, 0, MAX_LENGTH, MAX_LENGTH)
      context.beginPath()
      context.fillStyle = this.domNodes.album.pattern
      context.arc(HALF_LENGTH, HALF_LENGTH, HALF_LENGTH, 0, ONE_TURN)
      context.fill()
      context.closePath()

      this.domNodes.backdrop.style[
        'background-image'
      ] = `url(${this.image.src})`
    })
    this.image.addEventListener('error', () => {
      if (this.image.src !== localAlbum) {
        this.createAlbum(localAlbum)
      }
    })
  }

  private setLocalData() {
    this.data.lastHash = this.listHash
    this.data.lastID = this.playingIndex
    this.data.playMode = this.domNodes.mode.getAttribute('class')
    this.data.volume = this.audio.volume
    try {
      localStorage.setItem(this.config.localName, JSON.stringify(this.data))
    } catch (e) {
      console.warn(e)
    }
  }

  private getLocalData() {
    try {
      return JSON.parse(localStorage.getItem(this.config.localName) as any)
    } catch (e) {
      console.warn(e)
      return null
    }
  }

  private getLatestData() {
    const latestData = this.getLocalData()
    if (isPlainObject(latestData)) {
      this.data = latestData
    }
    if (this.listHash === this.data.lastHash) {
      if (this.data.lastID >= 0) this.playingIndex = this.data.lastID
    } else {
      this.playingIndex = 0 // start from 0 if playlist changed
    }
    if (this.data.playMode)
      this.domNodes.mode.setAttribute('class', this.data.playMode)
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
    if (this.data.volume || this.data.volume === 0) {
      this.audio.volume = this.data.volume
      this.renderVolume()
    }
  }

  private async loadMusicInfo(caller: any = null) {
    if (this.playingIndex >= this.songNum) {
      this.playingIndex = 0
    }
    if (this.playingIndex < 0) {
      this.playingIndex = this.songNum - 1
    }
    const sid = this.playList[this.playingIndex]
    const { data: result } = await axios.get(`${this.config.music}/${sid}`)
    if (!result) return
    const { data: lyrics } = await axios.get(`${this.config.lyrics}/${sid}`)
    const song: Song = {
      ...result,
      ...lyrics
    }
    if (song.url === '' && this.autoSkip) {
      await this.nextTrack()
    } else {
      await this.renderAudio(song)
    }
  }

  private renderVolume () {
    let icon = 'fa fa-volume-down'
    if (this.audio.volume === 0) icon = 'fa fa-volume-off'
    if (this.audio.volume === 1) icon = 'fa fa-volume-up'
    const title = `Volume (${this.audio.volume * 100}%)`
    this.domNodes.volume.setAttribute('class', icon)
    this.domNodes.volume.setAttribute('title', title)
  }

  async playAudio() {
    if (this.audio.sourcePointer.url === '') return

    const time = Math.ceil(Date.now() / 1000)
    const song = this.audio.sourcePointer
    const rest = this.audio.duration - this.audio.currentTime // Maybe `NaN`
    const minExpire = this.audio.duration || 120
    const expire = song.expire < minExpire ? this.config.expire : song.expire
    const isExpire =
      Math.ceil(rest) < expire &&
      time - song.timestamp + Math.ceil(rest || 0) > expire
    // NO risk of recursion
    if (isExpire) {
      this.recursion.currentTime = this.audio.currentTime
      const { data: song } = await axios.get(
        `${this.config.music}/${this.playList[this.playingIndex]}`
      )
      this.audio.src = song.url
      this.audio.sourcePointer = song
      this.playAudio()
    } else {
      if (this.recursion.currentTime) {
        this.audio.currentTime = this.recursion.currentTime
        this.recursion.currentTime = null
      }
      setTitle([this.config.siteTitle, song.title].join(' | '))
      try {
        this.audio.play()
      } catch (e) {}
    }
  }

  pauseAudio() {
    this.audio.pause()
  }

  private async nextTrack() {
    this.pauseAudio()
    if (this.domNodes.mode.getAttribute('class') === 'fa fa-random') {
      while (true) {
        const idx = Math.floor(Math.random() * this.songNum)
        if (this.playingIndex !== idx) {
          this.playingIndex = idx
          break
        }
      }
    } else {
      this.playingIndex += 1
    }
    await this.loadMusicInfo('next')
  }

  private prevTrack() {
    this.pauseAudio()
    this.playingIndex -= 1
    this.loadMusicInfo('prev')
  }

  private async renderAudio(song: Song) {
    const size = this.domNodes.album.clientWidth * 2
    this.image.src = song.cover.replace(/\d+y\d+/, `${size}y${size}`)
    this.domNodes.title.textContent = song.title
    this.domNodes.artists.textContent = song.artists
    this.domNodes.lyric.textContent = ''
    this.domNodes.tLyric.textContent = ''
    this.audio.sourcePointer = song
    if (!this.speech.speechPrimed && mobile()) {
      this.domNodes.fullscreenMaskMobile.style.display = 'flex'
      const promise = new Promise(resolve => {
        this.domNodes.fullscreenMaskMobile.addEventListener('click', () => {
          resolve(true)
        })
      })
      await promise
      this.domNodes.fullscreenMaskMobile.style.display = 'none'
      this.speech.speechPrimed = true
    }
    const speechMessage = this.speech.messages[this.playingIndex]
    if (speechMessage) {
      this.domNodes.fullscreenMask.style.display = 'flex'
      const child = document.createElement('span')
      speechMessage.split('\n').forEach((s: string) => {
        const el = document.createElement('p')
        el.textContent = s
        child.appendChild(el)
      })
      const skipBtn = document.createElement('button')
      skipBtn.textContent = '跳过'
      skipBtn.addEventListener('click', () => {
        this.speech.synth.cancel()
        this.domNodes.fullscreenMask.style.display = 'none'
      })
      child.appendChild(skipBtn)
      this.domNodes.fullscreenMask.replaceChild(
        child,
        this.domNodes.fullscreenMask.firstChild
      )
      await this.speakMessage(speechMessage)
      this.domNodes.fullscreenMask.style.display = 'none'
    }
    this.updateMediaSession(song)
    if (song.url === '') {
      this.domNodes.lyric.textContent = "Can't be played because of Copyright"
      this.domNodes.tLyric.textContent = '因版权原因暂时无法播放'
    } else {
      this.audio.src = song.url
      this.playAudio()
    }
  }

  private displayLrc() {
    const playTime = Math.floor(this.audio.currentTime)
    if (typeof this.audio.sourcePointer.lrc[playTime] !== 'string') return
    this.domNodes.lyric.textContent = this.audio.sourcePointer.lrc[playTime]
    if (this.audio.sourcePointer.lrc[playTime] === '') {
      return (this.domNodes.tLyric.textContent = '')
    }
    if (typeof this.audio.sourcePointer.tlrc[playTime] !== 'string') return
    this.domNodes.tLyric.textContent = this.audio.sourcePointer.tlrc[playTime]
  }

  private requestAlbumRotate() {
    const ANIMATION_FPS = 60
    const ONE_TURN_TIME = 30
    const ONE_TURN = 360 //Math.PI * 2
    const MAX_EACH_FRAME_TIME = 1000 / 50
    const EACH_FRAME_RADIAN = (1 / (ANIMATION_FPS * ONE_TURN_TIME)) * ONE_TURN

    let prevTimestamp = 0
    const loopAnimation = (timestamp: any) => {
      // prevTimestamp && timestamp - prevTimestamp > MAX_EACH_FRAME_TIME && console.warn(timestamp - prevTimestamp)
      prevTimestamp = timestamp

      this.prevFrameRadian += EACH_FRAME_RADIAN
      this.prevFrameRadian >= ONE_TURN && (this.prevFrameRadian -= ONE_TURN)
      this.updateAlbumRotateCSS(this.prevFrameRadian)

      if (this.audio.paused) {
        this.cancelAlbumRotate()
      } else {
        this.recursion.requestID = window.requestAnimationFrame(loopAnimation)
      }
    }

    // In slow network, `this.requestAlbumRotate` will be trigger many times.
    // So we should run `cancelAnimationFrame` firstly.
    this.cancelAlbumRotate()
    this.recursion.requestID = window.requestAnimationFrame(loopAnimation)
  }

  private updateAlbumRotateCSS(deg: number) {
    const { album } = this.domNodes
    const value = `rotate(${deg}deg)`
    const prefixes = ['', '-ms-', '-moz-', '-webkit-', '-o-']
    for (const prefix of prefixes) {
      album.style[`${prefix}transform`] = value
    }
  }

  private cancelAlbumRotate() {
    if (this.recursion.requestID) {
      window.cancelAnimationFrame(this.recursion.requestID)
    }
  }

  private updateMediaSession(song: Song) {
    if ('mediaSession' in navigator) {
      const { title, artists: artist, album, cover } = song
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        album,
        artwork: SIZES.map(x => ({
          src: cover.replace(/\d+y\d+/, `${x}y${x}`),
          sizes: `${x}x${x}`,
          type: 'image/png'
        }))
      })

      navigator.mediaSession.setActionHandler('play', () => this.playAudio())
      navigator.mediaSession.setActionHandler('pause', () => this.pauseAudio())
      navigator.mediaSession.setActionHandler('previoustrack', () =>
        this.prevTrack()
      )
      navigator.mediaSession.setActionHandler('nexttrack', () =>
        this.nextTrack()
      )
    }
  }

  private addAudioEvents() {
    this.audio.addEventListener('playing', () => {
      this.requestAlbumRotate()
      if (this.lrcInterval !== null) {
        clearInterval(this.lrcInterval)
        this.lrcInterval = null
      }
      if (this.audio.sourcePointer.lrc !== '') {
        this.lrcInterval = setInterval(() => this.displayLrc(), 500)
      }
    })
    this.audio.addEventListener('waiting', () => {
      this.cancelAlbumRotate()
      if (this.lrcInterval !== null) {
        clearInterval(this.lrcInterval)
        this.lrcInterval = null
      }
    })
    this.audio.addEventListener('play', () => {
      const list = this.domNodes.faMagic.className
        .split(' ')
        .filter((val: string) => val !== 'fa-play')
      this.domNodes.faMagic.className = [...list, 'fa-pause'].join(' ')
    })
    this.audio.addEventListener('pause', () => {
      const list = this.domNodes.faMagic.className
        .split(' ')
        .filter((val: string) => val !== 'fa-pause')
      this.domNodes.faMagic.className = [...list, 'fa-play'].join(' ')
    })
    this.audio.addEventListener('ended', () => {
      // HTML5 video/audio doesn't become paused after playback ends on IE
      // Bug: https://connect.microsoft.com/IE/feedback/details/810454/html5-video-audio-doesnt-become-paused-after-playback-ends
      this.autoSkip = true
      this.nextTrack()
    })
    this.audio.addEventListener('timeupdate', () => {
      const val: any = this.audio.currentTime / this.audio.duration
      this.domNodes.elapsed.style.width = `${val.toFixed(5) * 100}%`
    })
    this.audio.addEventListener('error', () => {
      this.recursion.currentTime = this.audio.currentTime
      this.pauseAudio()
      this.audio.src = this.audio.sourcePointer.url
      this.audio.load()
      this.playAudio()
    })

    setInterval(() => {
      this.domNodes.buffered.style.width = `${
        this.audio.buffered.length > 0
          ? (Math.round(this.audio.buffered.end(0)) /
              Math.round(this.audio.duration)) *
            100
          : 0
      }%`
    }, 60)
  }

  private speakMessage (message: string) {
    if (typeof SpeechSynthesisUtterance !== undefined) {
      const speechInstance = new SpeechSynthesisUtterance(message)
      speechInstance.voice = this.speech.allVoices.find(x => x.lang === 'zh-CN')
      speechInstance.lang = 'zh-CN'
      this.speech.synth.speak(speechInstance)
      return new Promise(resolve => {
        speechInstance.onend = resolve
        speechInstance.onerror = resolve
      })
    } else {
      return false
    }
  }

  private addOtherEvents() {
    window.addEventListener('unload', () => {
      this.setLocalData()
      this.speech.synth.cancel()
    })

    document.addEventListener('keydown', e => {
      // `which` and `keyCode` maybe deprecated, so keep both here
      if (e.keyCode === 32 || e.key === ' ') {
        e.preventDefault()
        this.audio.paused ? this.playAudio() : this.pauseAudio()
      } else if (e.keyCode === 37 || e.key === 'ArrowLeft') {
        e.preventDefault()
        this.autoSkip = false
        this.prevTrack()
      } else if (e.keyCode === 39 || e.key === 'ArrowRight') {
        e.preventDefault()
        this.autoSkip = false
        this.nextTrack()
      } else if (e.keyCode === 38 || e.key === 'ArrowUp') {
        e.preventDefault()
        const volume = (this.audio.volume * 100 + 10) / 100
        this.audio.volume = Math.min(1, volume)
        this.renderVolume()
      } else if (e.keyCode === 40 || e.key === 'ArrowDown') {
        e.preventDefault()
        const volume = (this.audio.volume * 100 - 10) / 100
        this.audio.volume = Math.max(0, volume)
        this.renderVolume()
      }
    })

    this.domNodes.home.addEventListener('click', () =>
      window.open(this.config.source)
    )

    this.domNodes.back.addEventListener('click', () => {
      this.autoSkip = false
      this.prevTrack()
    })

    this.domNodes.over.addEventListener('click', () => {
      this.autoSkip = false
      this.nextTrack()
    })

    this.domNodes.mode.addEventListener('click', () => {
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

    this.domNodes.magic.addEventListener('click', () => {
      this.audio.paused ? this.playAudio() : this.pauseAudio()
    })
  }
}

export default Player
