interface Particle2D {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  alpha: number
}

export class EffectsManager2D {
  private particles: Particle2D[] = []

  createHitEffect(x: number, y: number): void {
    // 击球火花效果
    const particleCount = 8

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount
      const speed = 2 + Math.random() * 3

      const particle: Particle2D = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.5,
        maxLife: 0.5,
        size: 2 + Math.random() * 3,
        color: '#FFA500',
        alpha: 1
      }

      this.particles.push(particle)
    }
  }

  createCollisionEffect(x: number, y: number, intensity: number): void {
    // 碰撞光环效果
    const particleCount = Math.floor(intensity * 6) + 3

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount
      const speed = 1 + intensity * 2

      const particle: Particle2D = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.3,
        maxLife: 0.3,
        size: 1 + Math.random() * 2,
        color: '#87CEEB',
        alpha: 1
      }

      this.particles.push(particle)
    }
  }

  createPocketEffect(x: number, y: number): void {
    // 进球螺旋效果
    const particleCount = 12

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount
      const radius = 10 + Math.random() * 10

      const particle: Particle2D = {
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        vx: -Math.cos(angle) * 2,
        vy: -Math.sin(angle) * 2,
        life: 0.8,
        maxLife: 0.8,
        size: 2 + Math.random() * 2,
        color: '#32CD32',
        alpha: 1
      }

      this.particles.push(particle)
    }
  }

  update(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]

      // 更新位置
      particle.x += particle.vx * deltaTime * 0.1
      particle.y += particle.vy * deltaTime * 0.1

      // 应用重力和阻力
      particle.vy += 0.1 * deltaTime * 0.1
      particle.vx *= 0.98
      particle.vy *= 0.98

      // 更新生命值
      particle.life -= deltaTime * 0.001
      particle.alpha = particle.life / particle.maxLife

      // 移除死亡的粒子
      if (particle.life <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => {
      ctx.save()
      ctx.globalAlpha = particle.alpha
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }

  dispose(): void {
    this.particles = []
  }
}