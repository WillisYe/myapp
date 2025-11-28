/**
 * 音效管理器
 * 负责游戏中所有音效的播放和管理
 */
class SoundManager {
  constructor() {
    this.sounds = {}
    this.audioContext = null
    this.masterVolume = 0.5
    this.enabled = true

    this.initAudioContext()
    this.createSounds()
  }

  /**
   * 初始化音频上下文
   */
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()

      // 用户交互后解锁音频上下文
      this.unlockAudio()
    } catch (e) {
      console.warn('音频上下文初始化失败:', e)
      this.enabled = false
    }
  }

  /**
   * 解锁音频上下文（需要用户交互）
   */
  unlockAudio() {
    const unlock = () => {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
      document.removeEventListener('click', unlock)
      document.removeEventListener('touchstart', unlock)
    }

    document.addEventListener('click', unlock)
    document.addEventListener('touchstart', unlock)
  }

  /**
   * 创建音效（使用 Web Audio API 合成音效）
   */
  createSounds() {
    if (!this.enabled || !this.audioContext) return

    // 球杆击球音效
    this.sounds.cueHit = this.createCueHitSound()

    // 球与球碰撞音效
    this.sounds.ballCollision = this.createBallCollisionSound()

    // 球与桌边碰撞音效
    this.sounds.cushionBounce = this.createCushionBounceSound()

    // 进球音效
    this.sounds.ballPocket = this.createBallPocketSound()

    // 游戏开始音效
    this.sounds.gameStart = this.createGameStartSound()

    // 获胜音效
    this.sounds.gameWin = this.createGameWinSound()

    // 犯规音效
    this.sounds.foul = this.createFoulSound()
  }

  /**
   * 创建球杆击球音效
   */
  createCueHitSound() {
    return (volume = 1) => {
      if (!this.enabled || !this.audioContext) return

      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      const filterNode = this.audioContext.createBiquadFilter()

      oscillator.connect(filterNode)
      filterNode.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1)

      filterNode.type = 'lowpass'
      filterNode.frequency.value = 1000

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume * 0.3, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.15)
    }
  }

  /**
   * 创建球与球碰撞音效
   */
  createBallCollisionSound() {
    return (volume = 1) => {
      if (!this.enabled || !this.audioContext) return

      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      const noiseBuffer = this.createNoiseBuffer(0.1)
      const noiseSource = this.audioContext.createBufferSource()

      noiseSource.buffer = noiseBuffer
      noiseSource.connect(gainNode)
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = 'sine'
      oscillator.frequency.value = 1200

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume * 0.2, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1)

      oscillator.start(this.audioContext.currentTime)
      noiseSource.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.1)
      noiseSource.stop(this.audioContext.currentTime + 0.1)
    }
  }

  /**
   * 创建桌边反弹音效
   */
  createCushionBounceSound() {
    return (volume = 1) => {
      if (!this.enabled || !this.audioContext) return

      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime)
      oscillator.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 0.05)

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume * 0.15, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.08)
    }
  }

  /**
   * 创建进球音效
   */
  createBallPocketSound() {
    return (volume = 1) => {
      if (!this.enabled || !this.audioContext) return

      const oscillator1 = this.audioContext.createOscillator()
      const oscillator2 = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator1.type = 'sine'
      oscillator1.frequency.value = 523.25 // C5
      oscillator2.type = 'sine'
      oscillator2.frequency.value = 659.25 // E5

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume * 0.3, this.audioContext.currentTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5)

      oscillator1.start(this.audioContext.currentTime)
      oscillator2.start(this.audioContext.currentTime)
      oscillator1.stop(this.audioContext.currentTime + 0.5)
      oscillator2.stop(this.audioContext.currentTime + 0.5)
    }
  }

  /**
   * 创建游戏开始音效
   */
  createGameStartSound() {
    return (volume = 1) => {
      if (!this.enabled || !this.audioContext) return

      const frequencies = [261.63, 329.63, 392.00, 523.25] // C-E-G-C 和弦
      const duration = 0.8

      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'sine'
        oscillator.frequency.value = freq

        const startTime = this.audioContext.currentTime + index * 0.1
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume * 0.2, startTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      })
    }
  }

  /**
   * 创建获胜音效
   */
  createGameWinSound() {
    return (volume = 1) => {
      if (!this.enabled || !this.audioContext) return

      const melody = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50]

      melody.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'triangle'
        oscillator.frequency.value = freq

        const startTime = this.audioContext.currentTime + index * 0.15
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume * 0.25, startTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3)

        oscillator.start(startTime)
        oscillator.stop(startTime + 0.3)
      })
    }
  }

  /**
   * 创建犯规音效
   */
  createFoulSound() {
    return (volume = 1) => {
      if (!this.enabled || !this.audioContext) return

      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime)
      oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.3)

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume * 0.3, this.audioContext.currentTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.3)
    }
  }

  /**
   * 创建噪声缓冲区
   */
  createNoiseBuffer(duration) {
    const frameCount = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, frameCount, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < frameCount; i++) {
      data[i] = Math.random() * 2 - 1
    }

    return buffer
  }

  /**
   * 播放音效
   */
  play(soundName, volume = 1) {
    if (!this.enabled || !this.sounds[soundName]) return

    try {
      this.sounds[soundName](volume)
    } catch (e) {
      console.warn('播放音效失败:', soundName, e)
    }
  }

  /**
   * 设置主音量
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * 启用/禁用音效
   */
  setEnabled(enabled) {
    this.enabled = enabled
  }

  /**
   * 获取音效状态
   */
  isEnabled() {
    return this.enabled
  }
}

export default SoundManager