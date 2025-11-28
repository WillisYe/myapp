import * as THREE from 'three'

/**
 * 特效管理器
 * 负责游戏中所有视觉特效的创建和管理
 */
class EffectsManager {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.particles = []
    this.trails = []
    this.animations = []

    // 粒子系统材质
    this.particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      color: 0xffffff,
      blending: THREE.AdditiveBlending
    })
  }

  /**
   * 创建击球特效
   */
  createCueHitEffect(position, direction, power) {
    // 创建冲击波效果
    this.createShockwave(position, power)

    // 创建火花粒子
    this.createSparks(position, direction, power)
  }

  /**
   * 创建冲击波效果
   */
  createShockwave(position, power) {
    const geometry = new THREE.RingGeometry(0.1, 0.1, 16)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    })

    const shockwave = new THREE.Mesh(geometry, material)
    shockwave.position.copy(position)
    shockwave.position.y += 0.01
    shockwave.rotation.x = -Math.PI / 2

    this.scene.add(shockwave)

    // 动画
    const maxRadius = power * 2
    const duration = 500 // ms
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration

      if (progress < 1) {
        const radius = 0.1 + (maxRadius - 0.1) * progress
        shockwave.geometry.dispose()
        shockwave.geometry = new THREE.RingGeometry(radius * 0.8, radius, 16)
        shockwave.material.opacity = 0.6 * (1 - progress)

        requestAnimationFrame(animate)
      } else {
        this.scene.remove(shockwave)
        shockwave.geometry.dispose()
        shockwave.material.dispose()
      }
    }

    animate()
  }

  /**
   * 创建火花粒子效果
   */
  createSparks(position, direction, power) {
    const particleCount = Math.floor(power * 20 + 5)
    const positions = new Float32Array(particleCount * 3)
    const velocities = []
    const lifetimes = []

    for (let i = 0; i < particleCount; i++) {
      // 初始位置
      positions[i * 3] = position.x + (Math.random() - 0.5) * 0.1
      positions[i * 3 + 1] = position.y + Math.random() * 0.05
      positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 0.1

      // 速度（沿着击球方向附近）
      const angle = Math.atan2(direction.z, direction.x) + (Math.random() - 0.5) * Math.PI / 2
      const speed = (0.5 + Math.random() * 0.5) * power
      velocities.push({
        x: Math.cos(angle) * speed,
        y: Math.random() * 0.2,
        z: Math.sin(angle) * speed
      })

      lifetimes.push(300 + Math.random() * 200) // 300-500ms
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = this.particleMaterial.clone()
    material.color.setHex(0xffaa00)

    const particles = new THREE.Points(geometry, material)
    this.scene.add(particles)

    // 动画粒子
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      let anyAlive = false

      for (let i = 0; i < particleCount; i++) {
        if (elapsed < lifetimes[i]) {
          anyAlive = true

          // 更新位置
          positions[i * 3] += velocities[i].x * 0.016
          positions[i * 3 + 1] += velocities[i].y * 0.016
          positions[i * 3 + 2] += velocities[i].z * 0.016

          // 应用重力
          velocities[i].y -= 0.5 * 0.016

          // 更新透明度
          const life = elapsed / lifetimes[i]
          material.opacity = 0.8 * (1 - life)
        }
      }

      geometry.attributes.position.needsUpdate = true

      if (anyAlive) {
        requestAnimationFrame(animate)
      } else {
        this.scene.remove(particles)
        geometry.dispose()
        material.dispose()
      }
    }

    animate()
  }

  /**
   * 创建球碰撞特效
   */
  createCollisionEffect(position, intensity = 1) {
    // 创建碰撞光环
    const geometry = new THREE.RingGeometry(0.05, 0.05, 12)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    })

    const ring = new THREE.Mesh(geometry, material)
    ring.position.copy(position)
    ring.rotation.x = Math.random() * Math.PI
    ring.rotation.y = Math.random() * Math.PI
    ring.rotation.z = Math.random() * Math.PI

    this.scene.add(ring)

    // 动画
    const duration = 200
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration

      if (progress < 1) {
        const radius = 0.05 + 0.15 * progress * intensity
        ring.geometry.dispose()
        ring.geometry = new THREE.RingGeometry(radius * 0.7, radius, 12)
        ring.material.opacity = 0.8 * (1 - progress)

        requestAnimationFrame(animate)
      } else {
        this.scene.remove(ring)
        ring.geometry.dispose()
        ring.material.dispose()
      }
    }

    animate()
  }

  /**
   * 创建进球特效
   */
  createPocketEffect(position) {
    // 创建螺旋粒子效果
    const particleCount = 30
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 4
      const radius = 0.3 * Math.random()

      positions[i * 3] = position.x + Math.cos(angle) * radius
      positions[i * 3 + 1] = position.y + 0.2 + Math.random() * 0.1
      positions[i * 3 + 2] = position.z + Math.sin(angle) * radius

      // 金色粒子
      colors[i * 3] = 1.0     // R
      colors[i * 3 + 1] = 0.8 // G
      colors[i * 3 + 2] = 0.2 // B
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.08,
      transparent: true,
      opacity: 1.0,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    })

    const particles = new THREE.Points(geometry, material)
    this.scene.add(particles)

    // 螺旋上升动画
    const duration = 1000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration

      if (progress < 1) {
        for (let i = 0; i < particleCount; i++) {
          const baseAngle = (i / particleCount) * Math.PI * 4
          const currentAngle = baseAngle + progress * Math.PI * 2
          const currentRadius = 0.3 * (1 - progress * 0.8)

          positions[i * 3] = position.x + Math.cos(currentAngle) * currentRadius
          positions[i * 3 + 1] = position.y + 0.2 + progress * 0.8
          positions[i * 3 + 2] = position.z + Math.sin(currentAngle) * currentRadius
        }

        geometry.attributes.position.needsUpdate = true
        material.opacity = 1.0 * (1 - progress)

        requestAnimationFrame(animate)
      } else {
        this.scene.remove(particles)
        geometry.dispose()
        material.dispose()
      }
    }

    animate()
  }

  /**
   * 创建获胜庆祝特效
   */
  createVictoryEffect(scene) {
    // 创建彩色礼花效果
    const colors = [
      0xff0080, 0x00ff80, 0x8000ff, 0xff8000, 0x0080ff, 0x80ff00
    ]

    colors.forEach((color, index) => {
      setTimeout(() => {
        this.createFirework(
          new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            2 + Math.random() * 2,
            (Math.random() - 0.5) * 3
          ),
          color
        )
      }, index * 200)
    })
  }

  /**
   * 创建礼花效果
   */
  createFirework(position, color) {
    const particleCount = 50
    const positions = new Float32Array(particleCount * 3)
    const velocities = []

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position.x
      positions[i * 3 + 1] = position.y
      positions[i * 3 + 2] = position.z

      // 随机发射方向
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      const speed = 2 + Math.random() * 2

      velocities.push({
        x: Math.sin(theta) * Math.cos(phi) * speed,
        y: Math.cos(theta) * speed,
        z: Math.sin(theta) * Math.sin(phi) * speed
      })
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      size: 0.1,
      color: color,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending
    })

    const particles = new THREE.Points(geometry, material)
    this.scene.add(particles)

    // 爆炸动画
    const duration = 1500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration

      if (progress < 1) {
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += velocities[i].x * 0.016
          positions[i * 3 + 1] += velocities[i].y * 0.016
          positions[i * 3 + 2] += velocities[i].z * 0.016

          // 重力和阻力
          velocities[i].y -= 3 * 0.016
          velocities[i].x *= 0.98
          velocities[i].z *= 0.98
        }

        geometry.attributes.position.needsUpdate = true
        material.opacity = 1.0 * (1 - progress)

        requestAnimationFrame(animate)
      } else {
        this.scene.remove(particles)
        geometry.dispose()
        material.dispose()
      }
    }

    animate()
  }

  /**
   * 创建球的轨迹效果
   */
  createBallTrail(ball) {
    if (ball.userData.trail) {
      this.scene.remove(ball.userData.trail.mesh)
      ball.userData.trail.geometry.dispose()
      ball.userData.trail.material.dispose()
    }

    const points = []
    const colors = []

    // 获取球的颜色
    const ballColor = ball.material.color

    for (let i = 0; i < 20; i++) {
      points.push(ball.position.clone())
      colors.push(ballColor.r, ballColor.g, ballColor.b)
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      linewidth: 3
    })

    const trail = new THREE.Line(geometry, material)
    this.scene.add(trail)

    ball.userData.trail = {
      mesh: trail,
      geometry: geometry,
      material: material,
      points: points,
      maxPoints: 20,
      currentIndex: 0
    }
  }

  /**
   * 更新球的轨迹
   */
  updateBallTrail(ball) {
    if (!ball.userData.trail || !ball.userData.isMoving) return

    const trail = ball.userData.trail
    const speed = ball.userData.physicsBody ? ball.userData.physicsBody.velocity.length() : 0

    if (speed > 0.1) {
      trail.points[trail.currentIndex] = ball.position.clone()
      trail.currentIndex = (trail.currentIndex + 1) % trail.maxPoints

      // 更新几何体
      trail.geometry.setFromPoints(trail.points)
      trail.material.opacity = Math.min(speed / 10, 0.5)
    } else {
      // 球停止时逐渐消失轨迹
      trail.material.opacity *= 0.9
      if (trail.material.opacity < 0.01) {
        this.scene.remove(trail.mesh)
        trail.geometry.dispose()
        trail.material.dispose()
        delete ball.userData.trail
      }
    }
  }

  /**
   * 清理所有特效
   */
  cleanup() {
    this.particles.forEach(particle => {
      if (particle.parent) {
        particle.parent.remove(particle)
      }
      if (particle.geometry) particle.geometry.dispose()
      if (particle.material) particle.material.dispose()
    })

    this.trails.forEach(trail => {
      if (trail.parent) {
        trail.parent.remove(trail)
      }
      if (trail.geometry) trail.geometry.dispose()
      if (trail.material) trail.material.dispose()
    })

    this.particles = []
    this.trails = []
    this.animations = []
  }
}

export default EffectsManager