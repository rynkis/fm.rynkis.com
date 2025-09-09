import Color from 'color'
import { toast } from 'sonner'
import mobile from 'is-mobile'
import ColorThief from './helper/color-thief'
import { ProgressBar } from './helper/ascii-progress'

const LOCAL_ALBUM = '/images/album.jpg'
const SIZES: number[] = [96, 128, 192, 256, 384, 512]
const ANIMATION_FPS = 60
const ONE_TURN_TIME = 30
const ONE_TURN_DEGREES = 360
const EACH_FRAME_RADIAN = (1 / (ANIMATION_FPS * ONE_TURN_TIME)) * ONE_TURN_DEGREES
const PROGRESS_BAR_CONFIG = {
  width: 20,
  completedChar: '▒',
  incompletedChar: '░'
}

export interface Song {
  url: string
  title: string
  artist: string
  album: string
  cover: string
  lrc: string
  tlrc: string
  expire: number
  timestamp: number
  [key: string]: any
}

interface Lyrics {
  [key: number]: string
}

interface DOMControllerConfig {
  volume: number
}

interface DOMNodes {
  home: HTMLElement
  back: HTMLElement
  play: HTMLElement
  playIcon: HTMLElement
  over: HTMLElement
  mode: HTMLElement
  modeIcon: HTMLElement
  title: HTMLElement
  album: HTMLCanvasElement
  magic: HTMLElement
  artists: HTMLElement
  buffered: HTMLElement
  elapsed: HTMLElement
  surface: HTMLElement
  faMagic: HTMLElement
  lyric: HTMLElement
  tLyric: HTMLElement
  waveform: HTMLCanvasElement
  frequency: HTMLCanvasElement
  backdrop: HTMLElement
  backdropMask: HTMLElement
  fullscreenMask: HTMLElement
  fullscreenMaskMobile: HTMLElement
}

class DOMController {
  private config: DOMControllerConfig
  public nodes: DOMNodes
  public audio: HTMLAudioElement
  private image: HTMLImageElement
  private colorThief: ColorThief
  private primaryColor: number[] = [255, 255, 255]
  private lighterColor: number[] = [255, 255, 255]
  private darkerColor: number[] = [255, 255, 255]
  private bar: ProgressBar
  private prevFrameRadian: number
  private recursion: {
    albumRequestID: number | null
    waveformRequestID: number | null
    frequencyRequestID: number | null
  }
  private audioContext: AudioContext
  private audioSource: MediaElementAudioSourceNode | null
  private analyser: AnalyserNode
  private bufferLength: number
  private dataArray: Uint8Array
  private waveformCtx: CanvasRenderingContext2D
  private frequencyCtx: CanvasRenderingContext2D

  // 扩展Canvas元素类型以包含pattern属性
  private albumCanvas: HTMLCanvasElement & { pattern?: CanvasPattern }

  constructor(config: DOMControllerConfig) {
    this.config = config
    this.nodes = this.initializeDOMNodes()
    this.audio = this.createAudioElement()
    this.image = this.createImageElement()
    this.colorThief = new ColorThief()
    this.bar = new ProgressBar(':message :bar :percent', PROGRESS_BAR_CONFIG)
    this.prevFrameRadian = 0
    this.recursion = {
      albumRequestID: null,
      waveformRequestID: null,
      frequencyRequestID: null
    }
    this.albumCanvas = this.nodes.album
    this.waveformCtx = this.initializeWaveformContext()
    this.frequencyCtx = this.initializeFrequencyContext()
    this.audioContext = new AudioContext()
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 2048
    this.bufferLength = this.analyser.frequencyBinCount
    this.dataArray = new Uint8Array(this.bufferLength)
    this.audioSource = this.createAudioSource()
  }

  // 初始化DOM节点
  private initializeDOMNodes(): DOMNodes {
    const getElement = <T extends HTMLElement>(selector: string): T => {
      const element = document.querySelector<T>(selector)
      if (!element) throw new Error(`Element not found: ${selector}`)
      return element
    }

    return {
      back: getElement<HTMLElement>('.controller [data-id="fa-back"] .fa-button'),
      play: getElement<HTMLElement>('.controller [data-id="fa-play"] .fa-button'),
      playIcon: getElement<HTMLElement>('.controller [data-id="fa-play"] .fa-button i'),
      over: getElement<HTMLElement>('.controller [data-id="fa-over"] .fa-button'),
      home: getElement<HTMLElement>('.sharing-tools [data-id="fa-github"] .fa-button'),
      mode: getElement<HTMLElement>('.sharing-tools [data-id="fa-mode"] .fa-button'),
      modeIcon: getElement<HTMLElement>('.sharing-tools [data-id="fa-mode"] .fa-button i'),
      title: getElement<HTMLElement>('#detail .title'),
      album: getElement<HTMLCanvasElement>('#surface .album'),
      magic: getElement<HTMLElement>('#surface .magic'),
      artists: getElement<HTMLElement>('#detail .artists'),
      buffered: getElement<HTMLElement>('#thread .progress .buffered'),
      elapsed: getElement<HTMLElement>('#thread .progress .elapsed'),
      surface: getElement<HTMLElement>('#surface'),
      faMagic: getElement<HTMLElement>('#surface .magic .fa'),
      lyric: getElement<HTMLElement>('#lyric .lrc'),
      tLyric: getElement<HTMLElement>('#lyric .tlrc'),
      waveform: getElement<HTMLCanvasElement>('#waveform'),
      frequency: getElement<HTMLCanvasElement>('#frequency'),
      backdrop: getElement<HTMLElement>('#backdrop'),
      backdropMask: getElement<HTMLElement>('#backdrop .mask'),
      fullscreenMask: getElement<HTMLElement>('.fullscreen-mask'),
      fullscreenMaskMobile: getElement<HTMLElement>('.fullscreen-mask-mobile')
    }
  }

  // 创建音频元素
  private createAudioElement(): HTMLAudioElement {
    const audio = document.createElement('audio')
    audio.crossOrigin = 'anonymous'
    audio.volume = this.config.volume
    return audio
  }

  private initializeWaveformContext(): CanvasRenderingContext2D {
    const ctx = this.nodes.waveform.getContext('2d') as CanvasRenderingContext2D
    // // 设置Canvas尺寸
    const resizeCanvases = () => {
      const dpr = window.devicePixelRatio || 1
      this.nodes.waveform.width = this.nodes.waveform.offsetWidth * dpr
      this.nodes.waveform.height = this.nodes.waveform.offsetHeight * dpr
      this.nodes.frequency.width = this.nodes.frequency.offsetWidth * dpr
      this.nodes.frequency.height = this.nodes.frequency.offsetHeight * dpr
    }
    window.addEventListener('resize', resizeCanvases)
    resizeCanvases()

    return ctx
  }

  private initializeFrequencyContext(): CanvasRenderingContext2D {
    const ctx = this.nodes.frequency.getContext('2d') as CanvasRenderingContext2D
    return ctx
  }

  private createAudioSource(): MediaElementAudioSourceNode | null {
    if (mobile()) return null
    const source = this.audioContext.createMediaElementSource(this.audio)
    source.connect(this.analyser)
    this.analyser.connect(this.audioContext.destination)
    return source
  }

  // 可视化函数
  visualize() {
    if (this.recursion.waveformRequestID) {
      window.cancelAnimationFrame(this.recursion.waveformRequestID)
      this.recursion.waveformRequestID = null
    }
    if (this.recursion.frequencyRequestID) {
      window.cancelAnimationFrame(this.recursion.frequencyRequestID)
      this.recursion.frequencyRequestID = null
    }
    if (!this.analyser) return

    // 绘制波形
    const drawWaveform = () => {
      this.recursion.waveformRequestID = requestAnimationFrame(drawWaveform)

      this.analyser.getByteTimeDomainData(this.dataArray as any)

      this.waveformCtx.clearRect(0, 0, this.nodes.waveform.width, this.nodes.waveform.height)

      this.waveformCtx.lineWidth = 2
      this.waveformCtx.strokeStyle = `rgb(${this.darkerColor.join(',')})`
      this.waveformCtx.beginPath()

      const sliceWidth = this.nodes.waveform.width / this.bufferLength
      let x = 0

      for (let i = 0; i < this.bufferLength; i++) {
        const v = this.dataArray[i] / 128.0
        const y = (v * this.nodes.waveform.height) / 2

        if (i === 0) {
          this.waveformCtx.moveTo(x, y)
        } else {
          this.waveformCtx.lineTo(x, y)
        }

        x += sliceWidth
      }

      this.waveformCtx.lineTo(this.nodes.waveform.width, this.nodes.waveform.height / 2)
      this.waveformCtx.stroke()
    }

    // 绘制频率
    const drawFrequency = () => {
      this.recursion.frequencyRequestID = requestAnimationFrame(drawFrequency)

      this.analyser.getByteFrequencyData(this.dataArray as any)

      this.frequencyCtx.clearRect(0, 0, this.nodes.frequency.width, this.nodes.frequency.height)

      const barWidth = (this.nodes.frequency.width / this.bufferLength) * 5
      let barHeight
      let x = 0

      for (let i = 0; i < this.bufferLength; i++) {
        barHeight = this.dataArray[i] / 4

        // 使用渐变色
        const gradient = this.frequencyCtx.createLinearGradient(0, 0, 0, this.nodes.frequency.height)
        gradient.addColorStop(0, `rgba(${this.darkerColor.join(',')}, .1)`)
        gradient.addColorStop(1, `rgba(${this.darkerColor.join(',')}, 1)`)

        this.frequencyCtx.fillStyle = gradient
        this.frequencyCtx.fillRect(x, this.nodes.frequency.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    drawWaveform()
    drawFrequency()
  }

  // 创建图片元素
  private createImageElement(): HTMLImageElement {
    const image = new Image()
    image.crossOrigin = 'anonymous'

    return image
  }

  // 设置初始内容
  setInitialContent(): void {
    this.nodes.title.textContent = 'Title'
    this.nodes.artists.textContent = 'Artists'
  }

  // 创建专辑封面
  createAlbum(src: string | null = null): void {
    this.image.src = typeof src === 'string' ? src : LOCAL_ALBUM
  }

  // 添加专辑事件监听
  addAlbumEvents(): void {
    this.image.addEventListener('load', () => this.handleImageLoad())
    this.image.addEventListener('error', () => this.handleImageError())
  }

  // 处理图片加载完成
  private handleImageLoad(): void {
    const primaryColor = Color.rgb(this.colorThief.getColor(this.image))
    const lc = primaryColor.lightness(80).rgb().array()
    const dc = primaryColor.lightness(20).rgb().array()
    const lighterColor = primaryColor.luminosity() < 0.3 ? dc : lc
    const darkerColor = primaryColor.luminosity() < 0.3 ? lc : dc
    this.primaryColor = primaryColor.rgb().array()
    this.lighterColor = lighterColor
    this.darkerColor = darkerColor

    const root = document.documentElement
    root.style.setProperty('--primary-color', primaryColor.rgb().array().join(', '))
    root.style.setProperty('--lighter-color', lighterColor.join(', '))
    root.style.setProperty('--darker-color', darkerColor.join(', '))

    const ONE_TURN = Math.PI * 2
    const MAX_LENGTH = Math.max(this.image.width, this.image.height)
    const HALF_LENGTH = MAX_LENGTH / 2

    this.prevFrameRadian = 0
    this.nodes.album.width = this.nodes.album.height = MAX_LENGTH * 2

    const context = this.nodes.album.getContext('2d')
    if (!context) return

    this.albumCanvas.pattern = context.createPattern(this.image, 'no-repeat') as CanvasPattern
    context.scale(2, 2)
    context.clearRect(0, 0, MAX_LENGTH, MAX_LENGTH)

    context.beginPath()
    context.fillStyle = this.albumCanvas.pattern
    context.arc(HALF_LENGTH, HALF_LENGTH, HALF_LENGTH, 0, ONE_TURN)
    context.fill()
    context.closePath()

    this.nodes.backdrop.style.backgroundImage = `url(${this.image.src})`
  }

  // 处理图片加载错误
  private handleImageError(): void {
    if (this.image.src !== LOCAL_ALBUM) {
      this.createAlbum(LOCAL_ALBUM)
    }
  }

  async playAudio() {
    await this.audio.play()
    // 如果音频上下文处于暂停状态，恢复它
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  // 应用播放模式
  applyPlayMode(playMode: string): void {
    this.nodes.modeIcon.setAttribute('class', playMode)

    switch (playMode) {
      case 'fa fa-repeat':
        this.audio.loop = false
        this.nodes.modeIcon.setAttribute('title', 'List loop')
        break
      case 'fa fa-repeat-single':
        this.audio.loop = true
        this.nodes.modeIcon.setAttribute('title', 'Single loop')
        break
      case 'fa fa-shuffle':
        this.audio.loop = false
        this.nodes.modeIcon.setAttribute('title', 'Shuffle')
        break
      default:
        this.audio.loop = false
        this.nodes.modeIcon.setAttribute('class', 'fa fa-repeat')
        this.nodes.modeIcon.setAttribute('title', 'List loop')
    }
  }

  // 获取播放模式
  getPlayMode(): string {
    return this.nodes.modeIcon.getAttribute('class') || ''
  }

  // 设置播放模式
  setPlayMode(modeClass: string, title: string, loop: boolean): void {
    this.audio.loop = loop
    this.nodes.modeIcon.setAttribute('class', modeClass)
    this.nodes.modeIcon.setAttribute('title', title)
  }

  // 检查是否为随机播放模式
  isShuffle(): boolean {
    return this.nodes.modeIcon.getAttribute('class') === 'fa fa-shuffle'
  }

  // 渲染音量显示
  renderVolume(): void {
    toast(this.bar.update(this.audio.volume, { message: '🎵' }), {
      style: {
        color: '#666',
        fontFamily: 'monospace',
        whiteSpace: 'nowrap',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }
    })
  }

  // 渲染音频信息
  renderAudio(song: Song): void {
    const size = this.nodes.album.clientWidth * 2
    this.image.src = song.cover.replace(/\d+y\d+/, `${size}y${size}`)

    this.nodes.title.textContent = song.title
    this.nodes.title.setAttribute('title', song.title)
    this.nodes.artists.textContent = song.artists
    this.nodes.artists.setAttribute('title', song.artists)
    this.nodes.lyric.textContent = ''
    this.nodes.tLyric.textContent = ''

    // 扩展audio元素以包含sourcePointer属性
    ;(this.audio as any).sourcePointer = song

    if (song.url === '') {
      this.renderNoRights()
    } else {
      this.audio.pause()
      this.audio.src = song.url
      // 开始可视化
      if (!mobile()) this.visualize()
    }
  }

  // 渲染无版权提示
  renderNoRights(): void {
    this.nodes.lyric.textContent = "Can't be played because of Copyright"
    this.nodes.tLyric.textContent = '因版权原因暂时无法播放'
  }

  // 显示移动端全屏遮罩
  showFullscreenMaskMobile(): void {
    this.nodes.fullscreenMask.style.display = 'flex'
  }

  // 隐藏移动端全屏遮罩
  hideFullscreenMaskMobile(): void {
    this.nodes.fullscreenMask.style.display = 'none'
  }

  // 处理移动端语音提示
  async handleMobileSpeechPriming(): Promise<void> {
    this.nodes.fullscreenMaskMobile.style.display = 'flex'

    await new Promise<void>(resolve => {
      this.nodes.fullscreenMaskMobile.addEventListener('click', () => resolve(), {
        once: true
      })
    })

    this.nodes.fullscreenMaskMobile.style.display = 'none'
  }

  // 创建语音消息元素
  createSpeechMessageElement(message: string, onCancel: () => void): HTMLButtonElement {
    const child = document.createElement('span')

    message.split('\n').forEach(s => {
      const el = document.createElement('p')
      el.textContent = s
      child.appendChild(el)
    })

    const skipBtn = document.createElement('button')
    skipBtn.textContent = '跳过'
    skipBtn.addEventListener('click', () => {
      onCancel()
      this.nodes.fullscreenMask.style.display = 'none'
    })

    child.appendChild(skipBtn)
    this.nodes.fullscreenMask.replaceChild(child, this.nodes.fullscreenMask.firstChild as ChildNode)

    return skipBtn
  }

  // 显示歌词
  displayLrc(playTime: number, lrc: Lyrics, tlrc: Lyrics): void {
    if (typeof lrc[playTime] !== 'string') return

    this.nodes.lyric.textContent = lrc[playTime]

    if (lrc[playTime] === '') {
      this.nodes.tLyric.textContent = ''
      return
    }

    if (typeof tlrc[playTime] !== 'string') return
    this.nodes.tLyric.textContent = tlrc[playTime]
  }

  // 请求专辑旋转动画
  requestAlbumRotate(): void {
    let prevTimestamp = 0

    const loopAnimation = (timestamp: number) => {
      prevTimestamp = timestamp

      this.prevFrameRadian += EACH_FRAME_RADIAN
      if (this.prevFrameRadian >= ONE_TURN_DEGREES) {
        this.prevFrameRadian -= ONE_TURN_DEGREES
      }

      this.updateAlbumRotateCSS(this.prevFrameRadian)

      if (this.audio.paused) {
        this.cancelAlbumRotate()
      } else {
        this.recursion.albumRequestID = window.requestAnimationFrame(loopAnimation)
      }
    }

    this.cancelAlbumRotate()
    this.recursion.albumRequestID = window.requestAnimationFrame(loopAnimation)
  }

  // 更新专辑旋转CSS
  private updateAlbumRotateCSS(deg: number): void {
    const { album } = this.nodes
    const value = `rotate(${deg}deg)`
    const prefixes = ['', '-ms-', '-moz-', '-webkit-', '-o-']

    for (const prefix of prefixes) {
      album.style[`${prefix}transform` as any] = value
    }
  }

  // 取消专辑旋转
  cancelAlbumRotate(): void {
    if (this.recursion.albumRequestID) {
      window.cancelAnimationFrame(this.recursion.albumRequestID)
      this.recursion.albumRequestID = null
    }
  }

  // 更新媒体会话信息
  updateMediaSession(song: Song): void {
    if (!('mediaSession' in navigator)) return

    const { title, artists: artist, album, cover } = song

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album,
      artwork: SIZES.map(size => ({
        src: cover.replace(/\d+y\d+/, `${size}y${size}`),
        sizes: `${size}x${size}`,
        type: 'image/png'
      }))
    })
  }

  // 处理音频播放事件
  handleAudioPlay(): void {
    this.setPlayButtonState(true)
  }

  // 处理音频暂停事件
  handleAudioPause(): void {
    this.setPlayButtonState(false)
  }

  // 处理音频时间更新事件
  handleAudioTimeUpdate(): void {
    const val = this.audio.currentTime / this.audio.duration
    this.nodes.elapsed.style.width = `${parseFloat(val.toFixed(5)) * 100}%`
  }

  // 更新缓冲进度
  updateBufferedProgress(): void {
    const buffered =
      this.audio.buffered.length > 0
        ? (Math.round(this.audio.buffered.end(0)) / Math.round(this.audio.duration)) * 100
        : 0

    this.nodes.buffered.style.width = `${buffered}%`
  }

  // 处理模式点击事件
  handleModeClick(): void {
    const currentMode = this.nodes.modeIcon.getAttribute('class')

    switch (currentMode) {
      case 'fa fa-repeat':
        this.setPlayMode('fa fa-repeat-single', 'Single loop', true)
        break
      case 'fa fa-repeat-single':
        this.setPlayMode('fa fa-shuffle', 'Shuffle', false)
        break
      case 'fa fa-shuffle':
        this.setPlayMode('fa fa-repeat', 'List loop', false)
        break
    }
  }

  // 更新已播放进度
  updateElapsedProgress(currentTime: number, duration: number): void {
    const val = currentTime / duration
    this.nodes.elapsed.style.width = `${parseFloat(val.toFixed(5)) * 100}%`
  }

  // 设置播放按钮状态
  setPlayButtonState(isPlaying: boolean): void {
    const classList = this.nodes.faMagic.className
      .split(' ')
      .filter(val => val !== (isPlaying ? 'fa-play' : 'fa-pause'))

    this.nodes.faMagic.className = [...classList, isPlaying ? 'fa-pause' : 'fa-play'].join(' ')
    this.nodes.playIcon.setAttribute('class', `fa fa-${isPlaying ? 'pause' : 'play'}`)
    this.nodes.playIcon.setAttribute('title', isPlaying ? 'Pause' : 'Play')
  }
}

export default DOMController
