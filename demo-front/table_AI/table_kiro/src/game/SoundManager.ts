export class SoundManager {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private enabled = true
  private volume = 0.7

  async init(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = this.volume
    } catch (error) {
      console.warn('音频初始化失败:', error)
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.audioContext || !this.masterGain || !this.enabled) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.frequency.value = frequency
    oscillator.type = type

    const now = this.audioContext.currentTime
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)

    oscillator.start(now)
    oscillator.stop(now + duration)
  }

  private createNoise(duration: number, filterFreq: number): void {
    if (!this.audioContext || !this.masterGain || !this.enabled) return

    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // 生成白噪声
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const source = this.audioContext.createBufferSource()
    const filter = this.audioContext.createBiquadFilter()
    const gainNode = this.audioContext.createGain()

    source.buffer = buffer
    filter.type = 'lowpass'
    filter.frequency.value = filterFreq

    source.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)

    const now = this.audioContext.currentTime
    gainNode.gain.setValueAtTime(0.1, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)

    source.start(now)
    source.stop(now + duration)
  }

  playHitSound(intensity: number): void {
    // 击球音效：低频撞击声 + 高频点击声
    const baseFreq = 80 + intensity * 40
    const clickFreq = 2000 + intensity * 1000

    this.createTone(baseFreq, 0.1, 'square')
    this.createTone(clickFreq, 0.05, 'sine')

    // 添加一点噪声模拟摩擦声
    this.createNoise(0.08, 500 + intensity * 500)
  }

  playBallCollisionSound(intensity: number): void {
    // 球碰撞音效：清脆的撞击声
    const freq1 = 400 + intensity * 200
    const freq2 = 800 + intensity * 400

    this.createTone(freq1, 0.08, 'sine')
    this.createTone(freq2, 0.04, 'triangle')
  }

  playPocketSound(): void {
    // 进球音效：下降的音调
    if (!this.audioContext || !this.masterGain || !this.enabled) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    const now = this.audioContext.currentTime
    oscillator.frequency.setValueAtTime(800, now)
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3)
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

    oscillator.start(now)
    oscillator.stop(now + 0.3)
  }

  playBorderBounceSound(intensity: number): void {
    // 边框反弹音效：短促的撞击声
    const freq = 300 + intensity * 300
    this.createTone(freq, 0.06, 'square')
  }

  playGameOverSound(isWin: boolean): void {
    if (!this.audioContext || !this.masterGain || !this.enabled) return

    if (isWin) {
      // 胜利音效：上升的和弦
      const frequencies = [523, 659, 784, 1047] // C5, E5, G5, C6
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.createTone(freq, 0.5, 'sine')
        }, index * 100)
      })
    } else {
      // 失败音效：下降的音调
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain)

      const now = this.audioContext.currentTime
      oscillator.frequency.setValueAtTime(400, now)
      oscillator.frequency.exponentialRampToValueAtTime(100, now + 1)
      oscillator.type = 'sawtooth'

      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1)

      oscillator.start(now)
      oscillator.stop(now + 1)
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume
    }
  }

  getEnabled(): boolean {
    return this.enabled
  }

  getVolume(): number {
    return this.volume
  }

  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.masterGain = null
  }
}