import axios from 'axios'
import { isPlainObject } from 'lodash/fp'
import { toast } from 'sonner'
import mobile from 'is-mobile'
import setTitle from './helper/setTitle'
import { parseSpeech, speakMessage } from './helper/speech'
import DOMController, { Song } from './dom-controller'
import globalInfo from '../package.json'

// Constants
const DEFAULT_EXPIRE_TIME = 1200

interface PlaylistResponse {
  hash: string
  ids: string[]
  msgs: string
}

interface RecursionState {
  currentTime: number | null
}

interface SpeechState {
  speechPrimed: boolean
  messages: {} | null
  allVoices?: SpeechSynthesisVoice[]
  synth?: SpeechSynthesis
}

interface LocalData {
  version?: string
  lastHash?: string
  lastID?: number
  playMode?: string
  volume?: number
  spoken?: { [key: number]: boolean }
}

class Player {
  private data: LocalData = {}
  private recursion: RecursionState = { currentTime: null }
  private config: ReturnType<typeof Player.prototype.initializeConfig>
  private dom: DOMController
  private audio: HTMLAudioElement & { sourcePointer?: Song }
  private playingIndex: number = 0
  private songNum: number = 0
  private listHash: string = ''
  private playList: string[] = []
  private autoSkip: boolean = false
  private lrcInterval: number | null = null
  private spoken: { [key: number]: boolean } = {}
  private speech: SpeechState

  constructor() {
    this.config = this.initializeConfig()
    this.dom = new DOMController(this.config)
    this.audio = this.dom.audio
    this.speech = this.initializeSpeech()

    this.dom.setInitialContent()
    this.start()
  }

  /**
   * 初始化配置
   */
  private initializeConfig() {
    return {
      siteTitle: "Rynkis' FM",
      volume: mobile() ? 1 : 0.5,
      expire: DEFAULT_EXPIRE_TIME,
      localName: 'Rynkis.FM.logger',
      source: 'https://github.com/Shy07/fm.rynkis.com',
      music: '/api/music',
      lyrics: '/api/lyrics',
      playlist: `/api/playlist${window.location.search}`
    }
  }

  /**
   * 初始化语音配置
   */
  private initializeSpeech(): SpeechState {
    return {
      speechPrimed: false,
      messages: null,
      allVoices:
        typeof speechSynthesis !== 'undefined'
          ? speechSynthesis.getVoices()
          : [],
      synth:
        typeof speechSynthesis !== 'undefined' ? speechSynthesis : undefined
    }
  }

  /**
   * 启动播放器
   */
  private async start(): Promise<void> {
    try {
      const { data } = await axios.get<PlaylistResponse>(this.config.playlist)
      if (!data) return

      this.speech.messages = parseSpeech(data.msgs)
      this.listHash = data.hash
      this.playList = data.ids
      this.songNum = this.playList.length
      this.playingIndex = Math.floor(Math.random() * this.songNum)

      this.dom.createAlbum()
      this.dom.addAlbumEvents()
      this.getLatestData()
      this.loadMusicInfo('start')
      this.addAudioEvents()
      this.addOtherEvents()
    } catch (error) {
      console.error('Failed to start player:', error)
      toast.error('Failed to load playlist')
    }
  }

  /**
   * 设置本地数据
   */
  private setLocalData(): void {
    this.data.version = globalInfo.version
    this.data.lastHash = this.listHash
    this.data.lastID = this.playingIndex
    this.data.playMode = this.dom.getPlayMode()
    this.data.volume = this.audio.volume
    this.data.spoken = this.spoken

    try {
      localStorage.setItem(this.config.localName, JSON.stringify(this.data))
    } catch (error) {
      console.warn('Failed to save data to localStorage:', error)
    }
  }

  /**
   * 获取本地数据
   */
  private getLocalData(): LocalData | null {
    try {
      const data = localStorage.getItem(this.config.localName)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.warn('Failed to get data from localStorage:', error)
      return null
    }
  }

  /**
   * 获取最新数据
   */
  private getLatestData(): void {
    const latestData = this.getLocalData()

    if (isPlainObject(latestData)) {
      this.data = latestData as LocalData
    }

    if (
      this.listHash === this.data.lastHash &&
      this.data.lastID !== undefined
    ) {
      if (this.data.lastID >= 0) this.playingIndex = this.data.lastID
      this.spoken = this.data.spoken || {}
    } else {
      this.playingIndex = 0
      this.spoken = {}
    }

    this.applyPlayMode()
    this.setVolume()
  }

  /**
   * 应用播放模式
   */
  private applyPlayMode(): void {
    if (!this.data.playMode) return
    this.dom.applyPlayMode(this.data.playMode)
  }

  /**
   * 设置音量
   */
  private setVolume(): void {
    if (this.data.volume !== undefined) {
      this.audio.volume = this.data.volume
    }
  }

  /**
   * 加载音乐信息
   */
  private async loadMusicInfo(caller: string | null = null): Promise<void> {
    this.adjustPlayingIndex()

    const sid = this.playList[this.playingIndex]
    if (!sid) return

    try {
      const { data: result } = await axios.get<Song>(
        `${this.config.music}/${sid}`
      )
      if (!result) return

      let lyrics = null
      if (typeof sid === 'string' && sid.startsWith('r')) {
        lyrics = result.lyrics
      } else {
        const { data } = await axios.get(`${this.config.lyrics}/${sid}`)
        lyrics = data
      }

      const song: Song = {
        ...result,
        ...lyrics
      }

      if (song.url === '' && this.autoSkip) {
        await this.nextTrack()
      } else {
        await this.renderAudio(song)
      }
    } catch (error) {
      console.error('Failed to load music info:', error)
      toast.error('Failed to load song')
    }
  }

  /**
   * 调整播放索引
   */
  private adjustPlayingIndex(): void {
    if (this.playingIndex >= this.songNum) {
      this.playingIndex = 0
    }
    if (this.playingIndex < 0) {
      this.playingIndex = this.songNum - 1
    }
  }

  /**
   * 播放音频
   */
  private async playAudio(): Promise<void> {
    if (
      !this.audio.sourcePointer ||
      (this.audio.sourcePointer as Song).url === ''
    )
      return

    const time = Math.ceil(Date.now() / 1000)
    const song = this.audio.sourcePointer as Song
    const rest = this.audio.duration - this.audio.currentTime
    const minExpire = this.audio.duration || 120
    const expire = song.expire < minExpire ? this.config.expire : song.expire
    const isExpire =
      Math.ceil(rest) < expire &&
      time - song.timestamp + Math.ceil(rest || 0) > expire

    if (isExpire) {
      this.recursion.currentTime = this.audio.currentTime
      const { data: song } = await axios.get<Song>(
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
        await this.dom.playAudio()
      } catch (error) {
        console.error('Failed to play audio:', error)
      }
    }
  }

  /**
   * 暂停音频
   */
  private pauseAudio(): void {
    this.audio.pause()
  }

  /**
   * 下一首
   */
  private async nextTrack(): Promise<void> {
    this.pauseAudio()

    if (this.dom.isShuffle()) {
      this.playingIndex = this.getRandomIndex()
    } else {
      this.playingIndex += 1
    }

    await this.loadMusicInfo('next')
  }

  /**
   * 获取随机索引
   */
  private getRandomIndex(): number {
    while (true) {
      const idx = Math.floor(Math.random() * this.songNum)
      if (this.playingIndex !== idx) {
        return idx
      }
    }
  }

  /**
   * 上一首
   */
  private prevTrack(): void {
    this.pauseAudio()
    this.playingIndex -= 1
    this.loadMusicInfo('prev')
  }

  /**
   * 渲染音频
   */
  private async renderAudio(song: Song): Promise<void> {
    this.dom.renderAudio(song)

    await this.handleMobileSpeechPriming()
    await this.handleSpeechMessage()

    this.spoken[this.playingIndex] = true
    this.dom.updateMediaSession(song)

    if (song.url !== '') this.playAudio()
  }

  /**
   * 处理移动端语音提示
   */
  private async handleMobileSpeechPriming(): Promise<void> {
    if (!this.speech.speechPrimed && mobile()) {
      await this.dom.handleMobileSpeechPriming()
      this.speech.speechPrimed = true
    }
  }

  /**
   * 处理语音消息
   */
  private async handleSpeechMessage(): Promise<void> {
    const speechMessage =
      this.speech.messages && (this.speech.messages as any)[this.playingIndex]

    if (speechMessage && !this.spoken[this.playingIndex]) {
      this.dom.showFullscreenMaskMobile()
      this.dom.createSpeechMessageElement(speechMessage, () =>
        speechSynthesis.cancel()
      )

      await speakMessage(speechMessage)
      this.dom.hideFullscreenMaskMobile()
    }
  }

  /**
   * 显示歌词
   */
  private displayLrc(): void {
    const playTime = Math.floor(this.audio.currentTime)
    const lrc = (this.audio.sourcePointer as Song).lrc
    const tlrc = (this.audio.sourcePointer as Song).tlrc

    this.dom.displayLrc(playTime, lrc, tlrc)
  }

  /**
   * 添加音频事件
   */
  private addAudioEvents(): void {
    this.audio.addEventListener('playing', () => this.handleAudioPlaying())
    this.audio.addEventListener('waiting', () => this.handleAudioWaiting())
    this.audio.addEventListener('play', () => this.dom.handleAudioPlay())
    this.audio.addEventListener('pause', () => this.dom.handleAudioPause())
    this.audio.addEventListener('ended', () => this.handleAudioEnded())
    this.audio.addEventListener('timeupdate', () =>
      this.dom.handleAudioTimeUpdate()
    )
    this.audio.addEventListener('error', () => this.handleAudioError())

    setInterval(() => this.dom.updateBufferedProgress(), 60)
  }

  /**
   * 处理音频播放中事件
   */
  private handleAudioPlaying(): void {
    this.dom.requestAlbumRotate()

    if (this.lrcInterval !== null) {
      clearInterval(this.lrcInterval)
      this.lrcInterval = null
    }

    if ((this.audio.sourcePointer as Song).lrc !== '') {
      this.lrcInterval = window.setInterval(() => this.displayLrc(), 500)
    }
  }

  /**
   * 处理音频等待事件
   */
  private handleAudioWaiting(): void {
    this.dom.cancelAlbumRotate()

    if (this.lrcInterval !== null) {
      clearInterval(this.lrcInterval)
      this.lrcInterval = null
    }
  }

  /**
   * 处理音频结束事件
   */
  private handleAudioEnded(): void {
    this.autoSkip = true
    this.nextTrack()
  }

  /**
   * 处理音频错误事件
   */
  private handleAudioError(): void {
    this.recursion.currentTime = this.audio.currentTime
    this.pauseAudio()
    this.audio.src = (this.audio.sourcePointer as Song).url
    this.audio.load()
    this.playAudio()
  }

  /**
   * 添加其他事件
   */
  private addOtherEvents(): void {
    window.addEventListener('unload', e => this.handleWindowUnload(e))
    document.addEventListener('keydown', e => this.handleKeyDown(e))

    this.dom.nodes.home.addEventListener('click', () =>
      window.open(this.config.source)
    )
    this.dom.nodes.back.addEventListener('click', (e: any) =>
      this.handleBackClick(e)
    )
    this.dom.nodes.play.addEventListener('click', (e: any) =>
      this.handlePlayClick(e)
    )
    this.dom.nodes.over.addEventListener('click', (e: any) =>
      this.handleOverClick(e)
    )
    this.dom.nodes.mode.addEventListener('click', () =>
      this.dom.handleModeClick()
    )
    this.dom.nodes.magic.addEventListener('click', (e: any) =>
      this.handleMagicClick(e)
    )
  }

  /**
   * 处理窗口卸载事件
   */
  private handleWindowUnload(e: BeforeUnloadEvent): void {
    this.setLocalData()
    speechSynthesis.cancel()
  }

  /**
   * 处理键盘按下事件
   */
  private handleKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case ' ':
        e.preventDefault()
        this.audio.paused ? this.playAudio() : this.pauseAudio()
        break
      case 'ArrowLeft':
        e.preventDefault()
        this.autoSkip = false
        this.prevTrack()
        break
      case 'ArrowRight':
        e.preventDefault()
        this.autoSkip = false
        this.nextTrack()
        break
      case 'ArrowUp':
        e.preventDefault()
        this.adjustVolume(0.1)
        break
      case 'ArrowDown':
        e.preventDefault()
        this.adjustVolume(-0.1)
        break
    }
  }

  /**
   * 调整音量
   */
  private adjustVolume(delta: number): void {
    const volume = Math.max(0, Math.min(1, this.audio.volume + delta))
    this.audio.volume = volume
    this.dom.renderVolume()
  }

  /**
   * 处理后退点击事件
   */
  private handleBackClick(e: MouseEvent): void {
    this.autoSkip = false
    this.prevTrack()
  }

  /**
   * 处理播放点击事件
   */
  private handlePlayClick(e: MouseEvent): void {
    this.audio.paused ? this.playAudio() : this.pauseAudio()
  }

  /**
   * 处理跳过点击事件
   */
  private handleOverClick(e: MouseEvent): void {
    this.autoSkip = false
    this.nextTrack()
  }

  /**
   * 处理Magic点击事件
   */
  private handleMagicClick(e: MouseEvent): void {
    this.audio.paused ? this.playAudio() : this.pauseAudio()
  }
}

export default Player
