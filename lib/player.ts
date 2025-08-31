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
const LOCAL_STORAGE_KEY = 'Rynkis.FM.logger'
const PLAY_MODES = {
  NORMAL: 'normal',
  SHUFFLE: 'shuffle',
  LOOP: 'loop'
} as const

export interface PlaylistResponse {
  hash: string
  name: string
  cover: string
  ids: string[]
  msgs: string
}

interface RecursionState {
  currentTime: number | null
}

interface SpeechState {
  speechPrimed: boolean
  messages: Record<string, any> | null
  allVoices: SpeechSynthesisVoice[]
  synth: SpeechSynthesis | null
}

interface LocalData {
  version?: string
  lastHash?: string
  lastID?: number
  playMode?: string
  volume?: number
  spoken?: Record<number, boolean>
  history?: PlaylistResponse[]
}

class Player {
  private data: LocalData = {}
  private recursion: RecursionState = { currentTime: null }
  private readonly config: ReturnType<typeof Player.prototype.initializeConfig>
  private readonly dom: DOMController
  private readonly audio: HTMLAudioElement & { sourcePointer?: Song }
  private playingIndex = 0
  private songNum = 0
  public listHash = ''
  private playlist: string[] = []
  private playlistData: PlaylistResponse | null = null
  private autoSkip = false
  private lrcInterval: number | null = null
  private spoken: Record<number, boolean> = {}
  private speech: SpeechState

  constructor() {
    this.config = this.initializeConfig()
    this.dom = new DOMController(this.config)
    this.audio = this.dom.audio
    this.speech = this.initializeSpeech()

    this.dom.setInitialContent()
    this.initializePlayer()
  }

  private initializeConfig() {
    return {
      siteTitle: "Rynkis' FM",
      volume: mobile() ? 1 : 0.5,
      expire: DEFAULT_EXPIRE_TIME,
      localName: LOCAL_STORAGE_KEY,
      source: 'https://github.com/Shy07/fm.rynkis.com',
      music: '/api/music',
      lyrics: '/api/lyrics',
      playlist: '/api/playlist'
    }
  }

  private initializeSpeech(): SpeechState {
    return {
      speechPrimed: false,
      messages: null,
      allVoices: typeof speechSynthesis !== 'undefined' ? speechSynthesis.getVoices() : [],
      synth: typeof speechSynthesis !== 'undefined' ? speechSynthesis : null
    }
  }

  private async initializePlayer(): Promise<void> {
    try {
      await this.loadPlaylist()
      this.setupPlayer()
    } catch (error) {
      this.handleError('Failed to initialize player', error)
    }
  }

  private async loadPlaylist(): Promise<void> {
    const { data } = await axios.get<PlaylistResponse>(`${this.config.playlist}${window.location.search}`)

    if (!data) throw new Error('No playlist data received')

    this.speech.messages = parseSpeech(data.msgs)
    this.playlistData = data
    this.listHash = data.hash
    this.playlist = data.ids
    this.songNum = this.playlist.length
    this.playingIndex = Math.floor(Math.random() * this.songNum)
  }

  private setupPlayer(): void {
    this.dom.createAlbum()
    this.dom.addAlbumEvents()
    this.loadUserData()
    this.loadMusicInfo('start')
    this.setupAudioEvents()
    this.setupUIEvents()
  }

  private loadUserData(): void {
    const latestData = this.getLocalData()

    if (isPlainObject(latestData)) {
      this.data = latestData as LocalData
    }

    if (this.listHash === this.data.lastHash && this.data.lastID !== undefined) {
      if (this.data.lastID >= 0) this.playingIndex = this.data.lastID
      this.spoken = this.data.spoken || {}
    } else {
      this.playingIndex = 0
      this.spoken = {}
    }

    this.applyPlayMode()
    this.setVolume()
  }

  private applyPlayMode(): void {
    if (this.data.playMode) {
      this.dom.applyPlayMode(this.data.playMode)
    }
  }

  private setVolume(): void {
    if (this.data.volume !== undefined) {
      this.audio.volume = this.data.volume
    }
  }

  private async loadMusicInfo(caller: string | null = null): Promise<void> {
    this.adjustPlayingIndex()

    const sid = this.playlist[this.playingIndex]
    if (!sid) return

    try {
      const song = await this.fetchSongData(sid)

      if (song.url === '' && this.autoSkip) {
        await this.nextTrack()
      } else {
        await this.renderAudio(song)
      }
    } catch (error) {
      this.handleError('Failed to load music info', error)
    }
  }

  private async fetchSongData(sid: string | number): Promise<Song> {
    const { data: result } = await axios.get<Song>(`${this.config.music}/${sid}`)

    let lyrics = null
    if (typeof sid === 'string' && sid.startsWith('r')) {
      lyrics = result.lyrics
    } else {
      const { data } = await axios.get(`${this.config.lyrics}/${sid}`)
      lyrics = data
    }

    return {
      ...result,
      ...lyrics
    }
  }

  private adjustPlayingIndex(): void {
    if (this.playingIndex >= this.songNum) this.playingIndex = 0
    if (this.playingIndex < 0) this.playingIndex = this.songNum - 1
  }

  private async playAudio(): Promise<void> {
    if (!this.audio.sourcePointer || this.audio.sourcePointer.url === '') return

    const time = Math.ceil(Date.now() / 1000)
    const song = this.audio.sourcePointer
    const rest = this.audio.duration - this.audio.currentTime
    const minExpire = this.audio.duration || 120
    const expire = song.expire < minExpire ? this.config.expire : song.expire
    const isExpire = Math.ceil(rest) < expire && time - song.timestamp + Math.ceil(rest || 0) > expire

    if (isExpire) {
      await this.refreshAudioSource()
    } else {
      if (this.recursion.currentTime) {
        this.audio.currentTime = this.recursion.currentTime
        this.recursion.currentTime = null
      }

      setTitle(`${this.config.siteTitle} | ${song.title}`)
      await this.dom.playAudio()
    }
  }

  private async refreshAudioSource(): Promise<void> {
    this.recursion.currentTime = this.audio.currentTime
    const { data: song } = await axios.get<Song>(`${this.config.music}/${this.playlist[this.playingIndex]}`)
    this.audio.src = song.url
    this.audio.sourcePointer = song
    this.playAudio()
  }

  private pauseAudio(): void {
    this.audio.pause()
  }

  private async nextTrack(): Promise<void> {
    this.pauseAudio()
    this.playingIndex = this.dom.isShuffle() ? this.getRandomIndex() : this.playingIndex + 1
    await this.loadMusicInfo('next')
  }

  private getRandomIndex(): number {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songNum)
    } while (newIndex === this.playingIndex)

    return newIndex
  }

  private async prevTrack(): Promise<void> {
    this.pauseAudio()
    this.playingIndex -= 1
    await this.loadMusicInfo('prev')
  }

  private async renderAudio(song: Song): Promise<void> {
    this.dom.renderAudio(song)

    await this.handleMobileSpeechPriming()
    await this.handleSpeechMessage()

    this.spoken[this.playingIndex] = true
    this.dom.updateMediaSession(song)

    if (song.url !== '') this.playAudio()
  }

  private async handleMobileSpeechPriming(): Promise<void> {
    if (!this.speech.speechPrimed && mobile()) {
      await this.dom.handleMobileSpeechPriming()
      this.speech.speechPrimed = true
    }
  }

  private async handleSpeechMessage(): Promise<void> {
    const speechMessage = this.speech.messages?.[this.playingIndex]

    if (speechMessage && !this.spoken[this.playingIndex]) {
      this.dom.showFullscreenMaskMobile()
      this.dom.createSpeechMessageElement(speechMessage, () => speechSynthesis.cancel())

      await speakMessage(speechMessage)
      this.dom.hideFullscreenMaskMobile()
    }
  }

  private displayLrc(): void {
    const playTime = Math.floor(this.audio.currentTime)
    const lrc = this.audio.sourcePointer?.lrc || ''
    const tlrc = this.audio.sourcePointer?.tlrc || ''

    this.dom.displayLrc(playTime, lrc, tlrc)
  }

  private setupAudioEvents(): void {
    this.audio.addEventListener('playing', () => this.handleAudioPlaying())
    this.audio.addEventListener('waiting', () => this.handleAudioWaiting())
    this.audio.addEventListener('play', () => this.dom.handleAudioPlay())
    this.audio.addEventListener('pause', () => this.dom.handleAudioPause())
    this.audio.addEventListener('ended', () => this.handleAudioEnded())
    this.audio.addEventListener('timeupdate', () => this.dom.handleAudioTimeUpdate())
    this.audio.addEventListener('error', () => this.handleAudioError())

    setInterval(() => this.dom.updateBufferedProgress(), 60)
  }

  private handleAudioPlaying(): void {
    this.dom.requestAlbumRotate()

    if (this.lrcInterval !== null) {
      clearInterval(this.lrcInterval)
      this.lrcInterval = null
    }

    if (this.audio.sourcePointer?.lrc) {
      this.lrcInterval = window.setInterval(() => this.displayLrc(), 500)
    }
  }

  private handleAudioWaiting(): void {
    this.dom.cancelAlbumRotate()

    if (this.lrcInterval !== null) {
      clearInterval(this.lrcInterval)
      this.lrcInterval = null
    }
  }

  private handleAudioEnded(): void {
    this.autoSkip = true
    this.nextTrack()
  }

  private handleAudioError(): void {
    this.recursion.currentTime = this.audio.currentTime
    this.pauseAudio()
    this.audio.src = this.audio.sourcePointer?.url || ''
    this.audio.load()
    this.playAudio()
  }

  private setupUIEvents(): void {
    window.addEventListener('unload', () => this.handleWindowUnload())
    document.addEventListener('keydown', e => this.handleKeyDown(e))

    this.dom.nodes.home.addEventListener('click', () => window.open(this.config.source))
    this.dom.nodes.back.addEventListener('click', () => this.handleBackClick())
    this.dom.nodes.play.addEventListener('click', () => this.handlePlayClick())
    this.dom.nodes.over.addEventListener('click', () => this.handleOverClick())
    this.dom.nodes.mode.addEventListener('click', () => this.dom.handleModeClick())
    this.dom.nodes.magic.addEventListener('click', () => this.handleMagicClick())
  }

  private handleWindowUnload(): void {
    this.setLocalData()
    speechSynthesis.cancel()
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const keyHandlers: Record<string, () => void> = {
      ' ': () => {
        e.preventDefault()
        this.audio.paused ? this.playAudio() : this.pauseAudio()
      },
      ArrowLeft: () => {
        e.preventDefault()
        this.autoSkip = false
        this.prevTrack()
      },
      ArrowRight: () => {
        e.preventDefault()
        this.autoSkip = false
        this.nextTrack()
      },
      ArrowUp: () => {
        e.preventDefault()
        this.adjustVolume(0.1)
      },
      ArrowDown: () => {
        e.preventDefault()
        this.adjustVolume(-0.1)
      }
    }

    if (keyHandlers[e.key]) {
      keyHandlers[e.key]()
    }
  }

  private adjustVolume(delta: number): void {
    const volume = Math.max(0, Math.min(1, this.audio.volume + delta))
    this.audio.volume = volume
    this.dom.renderVolume()
  }

  private handleBackClick(): void {
    this.autoSkip = false
    this.prevTrack()
  }

  private handlePlayClick(): void {
    this.audio.paused ? this.playAudio() : this.pauseAudio()
  }

  private handleOverClick(): void {
    this.autoSkip = false
    this.nextTrack()
  }

  private handleMagicClick(): void {
    this.audio.paused ? this.playAudio() : this.pauseAudio()
  }

  private setLocalData(): void {
    this.data.version = globalInfo.version
    this.data.lastHash = this.listHash
    this.data.lastID = this.playingIndex
    this.data.playMode = this.dom.getPlayMode()
    this.data.volume = this.audio.volume
    this.data.spoken = this.spoken

    if (!this.data.history) {
      this.data.history = [this.playlistData!]
    } else {
      const idx = this.data.history.findIndex(x => x.hash === this.listHash)
      if (idx >= 0) {
        this.data.history[idx] = this.playlistData!
      } else {
        this.data.history.push(this.playlistData!)
      }
    }
    if (this.data.history.length > 50) {
      this.data.history = this.data.history.slice(-50)
    }

    try {
      localStorage.setItem(this.config.localName, JSON.stringify(this.data))
    } catch (error) {
      console.warn('Failed to save data to localStorage:', error)
    }
  }

  private getLocalData(): LocalData | null {
    try {
      const data = localStorage.getItem(this.config.localName)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.warn('Failed to get data from localStorage:', error)
      return null
    }
  }

  private handleError(message: string, error: unknown): void {
    console.error(`${message}:`, error)
    toast.error(message)
  }

  // Public methods
  public getHistory(): PlaylistResponse[] | undefined {
    return this.data.history
  }

  public historyRemove(hash: string): void {
    if (!this.data.history) {
      this.data.history = [this.playlistData!]
    } else {
      this.data.history = this.data.history.filter(x => x.hash !== hash)
      this.setLocalData()
    }
  }

  public async play(hash: string): Promise<void> {
    if (!this.data.history) this.data.history = [this.playlistData!]
    const data = this.data.history.find(x => x.hash === hash)
    if (!data) return

    await this.setupPlaylistData(data)
  }

  public async load(id: string): Promise<void> {
    try {
      const { data } = await axios.get<PlaylistResponse>(`${this.config.playlist}?id=${id || ''}`)
      if (!data) return

      await this.setupPlaylistData(data)
    } catch (error) {
      this.handleError('Failed to load playlist', error)
    }
  }

  private async setupPlaylistData(data: PlaylistResponse): Promise<void> {
    this.speech.messages = parseSpeech(data.msgs)
    this.listHash = data.hash
    this.playlistData = data
    this.playlist = data.ids
    this.songNum = this.playlist.length
    this.playingIndex = Math.floor(Math.random() * this.songNum)

    this.loadUserData()
    await this.loadMusicInfo('load')
  }
}

export default Player
