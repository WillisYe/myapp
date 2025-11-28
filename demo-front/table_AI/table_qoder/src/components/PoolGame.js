import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import SoundManager from './SoundManager.js'
import EffectsManager from './EffectsManager.js'

/**
 * 黑八桌球游戏核心类
 * 负责3D场景渲染、物理模拟、游戏逻辑等
 */
class PoolGame {
  constructor(container) {
    this.container = container
    this.scene = null
    this.camera = null
    this.renderer = null
    this.animationId = null

    // 游戏对象
    this.table = null
    this.balls = []
    this.cueStick = null
    this.aimingLine = null
    this.trajectoryLines = []
    this.currentAimDirection = new THREE.Vector3()

    // 物理世界
    this.world = null
    this.physicsBodies = []

    // 游戏状态
    this.currentPlayer = 0  // 0: 玩家1, 1: 玩家2
    this.gamePhase = 'breaking'  // breaking, aiming, shooting, waiting
    this.shotPower = 0.5
    this.isGameActive = true

    // 黑八桌球规则状态
    this.player1Group = null  // 'solid' 或 'stripe' 或 null
    this.player2Group = null
    this.ballsPocketed = {
      solid: [],    // 1-7号实心球
      stripe: [],   // 9-15号花色球
      black: false  // 8号黑球
    }
    this.isBreaking = true
    this.fouls = {
      player1: 0,
      player2: 0
    }

    // 鼠标控制
    this.mouse = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()
    this.isMouseDown = false

    // 事件监听器
    this.eventListeners = {}

    // 音效和特效管理器
    this.soundManager = null
    this.effectsManager = null

    // 绑定事件处理函数
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  /**
   * 初始化游戏
   */
  init() {
    this.setupPhysicsWorld()
    this.setupScene()
    this.setupCamera()
    this.setupRenderer()
    this.setupLights()
    this.setupEffectsAndSound()
    this.createTable()
    this.createBalls()
    this.createCueStick()
    this.setupEventListeners()
    this.startGameLoop()
  }

  /**
   * 设置物理世界
   */
  setupPhysicsWorld() {
    this.world = new CANNON.World()
    this.world.gravity.set(0, -9.82, 0)
    this.world.broadphase = new CANNON.NaiveBroadphase()
    this.world.solver.iterations = 10

    // 设置材质和接触材料
    const ballMaterial = new CANNON.Material('ball')
    const tableMaterial = new CANNON.Material('table')

    const ballTableContact = new CANNON.ContactMaterial(
      ballMaterial,
      tableMaterial,
      {
        friction: 0.3,
        restitution: 0.7
      }
    )

    const ballBallContact = new CANNON.ContactMaterial(
      ballMaterial,
      ballMaterial,
      {
        friction: 0.1,
        restitution: 0.95
      }
    )

    this.world.addContactMaterial(ballTableContact)
    this.world.addContactMaterial(ballBallContact)

    // 暂时禁用事件监听器，改用手动碰撞检测
    // this.world.addEventListener('beginContact', ...)

    this.ballMaterial = ballMaterial
    this.tableMaterial = tableMaterial
  }

  /**
   * 处理碰撞事件
   */
  handleCollision(bodyA, bodyB, ballMaterial, tableMaterial) {
    if (!bodyA || !bodyB) return

    // 检查是否是球与球的碰撞
    if (bodyA.material === ballMaterial && bodyB.material === ballMaterial) {
      const speed = Math.max(bodyA.velocity.length(), bodyB.velocity.length())
      if (speed > 0.5 && this.soundManager) {
        this.soundManager.play('ballCollision', Math.min(speed / 10, 1))
      }

      // 创建碰撞特效
      if (speed > 0.5 && this.effectsManager) {
        // 使用 Cannon.js 的 Vec3 方法
        const pos1 = bodyA.position
        const pos2 = bodyB.position
        const avgX = (pos1.x + pos2.x) / 2
        const avgY = (pos1.y + pos2.y) / 2
        const avgZ = (pos1.z + pos2.z) / 2

        this.effectsManager.createCollisionEffect(
          new THREE.Vector3(avgX, avgY, avgZ),
          Math.min(speed / 5, 1)
        )
      }
    }

    // 检查是否是球与桌边的碰撞
    if ((bodyA.material === ballMaterial && bodyB.material === tableMaterial) ||
        (bodyB.material === ballMaterial && bodyA.material === tableMaterial)) {
      const ballBody = bodyA.material === ballMaterial ? bodyA : bodyB
      const speed = ballBody.velocity.length()
      if (speed > 0.3 && this.soundManager) {
        this.soundManager.play('cushionBounce', Math.min(speed / 8, 1))
      }
    }
  }

  /**
   * 设置音效和特效管理器
   */
  setupEffectsAndSound() {
    this.soundManager = new SoundManager()
    this.effectsManager = new EffectsManager(this.scene, this.camera)
  }

  /**
   * 设置3D场景
   */
  setupScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x2a4d3a)  // 深绿色背景

    // 添加雾效果增强立体感
    this.scene.fog = new THREE.Fog(0x2a4d3a, 10, 100)
  }

  /**
   * 设置摄像机
   */
  setupCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)

    // 设置摄像机位置 - 俯视角度
    this.camera.position.set(0, 8, 8)
    this.camera.lookAt(0, 0, 0)
  }

  /**
   * 设置渲染器
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    })
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // 启用阴影
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.container.appendChild(this.renderer.domElement)
  }

  /**
   * 设置光照
   */
  setupLights() {
    // 增强环境光亮度
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    this.scene.add(ambientLight)

    // 主光源 - 增加亮度
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true

    // 配置阴影
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.camera.left = -10
    directionalLight.shadow.camera.right = 10
    directionalLight.shadow.camera.top = 10
    directionalLight.shadow.camera.bottom = -10

    this.scene.add(directionalLight)

    // 增强补充光源
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8)
    fillLight.position.set(-5, 5, -5)
    this.scene.add(fillLight)

    // 添加额外的顶部光源以增加整体亮度
    const topLight = new THREE.DirectionalLight(0xffffff, 0.6)
    topLight.position.set(0, 15, 0)
    this.scene.add(topLight)

    // 添加桌面反射光
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.3)
    bottomLight.position.set(0, -2, 0)
    this.scene.add(bottomLight)
  }

  /**
   * 创建桌球台
   */
  createTable() {
    const tableGroup = new THREE.Group()

    // 桌面
    const tableGeometry = new THREE.BoxGeometry(8, 0.2, 4)
    const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x0d5016 })
    const table = new THREE.Mesh(tableGeometry, tableMaterial)
    table.position.y = -0.1
    table.receiveShadow = true
    tableGroup.add(table)

    // 创建桌面物理体
    const tableShape = new CANNON.Box(new CANNON.Vec3(4, 0.1, 2))
    const tableBody = new CANNON.Body({
      mass: 0, // 静态物体
      material: this.tableMaterial
    })
    tableBody.addShape(tableShape)
    tableBody.position.set(0, -0.1, 0)
    this.world.addBody(tableBody)

    // 桌边
    const borderHeight = 0.3
    const borderWidth = 0.2

    // 长边
    const longBorderGeometry = new THREE.BoxGeometry(8.4, borderHeight, borderWidth)
    const borderMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 })

    const longBorder1 = new THREE.Mesh(longBorderGeometry, borderMaterial)
    longBorder1.position.set(0, borderHeight/2, 2.1)
    longBorder1.castShadow = true
    tableGroup.add(longBorder1)

    // 长边物理体
    const longBorderShape = new CANNON.Box(new CANNON.Vec3(4.2, borderHeight/2, borderWidth/2))
    const longBorder1Body = new CANNON.Body({ mass: 0, material: this.tableMaterial })
    longBorder1Body.addShape(longBorderShape)
    longBorder1Body.position.set(0, borderHeight/2, 2.1)
    this.world.addBody(longBorder1Body)

    const longBorder2 = new THREE.Mesh(longBorderGeometry, borderMaterial)
    longBorder2.position.set(0, borderHeight/2, -2.1)
    longBorder2.castShadow = true
    tableGroup.add(longBorder2)

    const longBorder2Body = new CANNON.Body({ mass: 0, material: this.tableMaterial })
    longBorder2Body.addShape(longBorderShape)
    longBorder2Body.position.set(0, borderHeight/2, -2.1)
    this.world.addBody(longBorder2Body)

    // 短边
    const shortBorderGeometry = new THREE.BoxGeometry(borderWidth, borderHeight, 4)
    const shortBorder1 = new THREE.Mesh(shortBorderGeometry, borderMaterial)
    shortBorder1.position.set(4.1, borderHeight/2, 0)
    shortBorder1.castShadow = true
    tableGroup.add(shortBorder1)

    // 短边物理体
    const shortBorderShape = new CANNON.Box(new CANNON.Vec3(borderWidth/2, borderHeight/2, 2))
    const shortBorder1Body = new CANNON.Body({ mass: 0, material: this.tableMaterial })
    shortBorder1Body.addShape(shortBorderShape)
    shortBorder1Body.position.set(4.1, borderHeight/2, 0)
    this.world.addBody(shortBorder1Body)

    const shortBorder2 = new THREE.Mesh(shortBorderGeometry, borderMaterial)
    shortBorder2.position.set(-4.1, borderHeight/2, 0)
    shortBorder2.castShadow = true
    tableGroup.add(shortBorder2)

    const shortBorder2Body = new CANNON.Body({ mass: 0, material: this.tableMaterial })
    shortBorder2Body.addShape(shortBorderShape)
    shortBorder2Body.position.set(-4.1, borderHeight/2, 0)
    this.world.addBody(shortBorder2Body)

    // 球袋
    this.createPockets(tableGroup)

    this.table = tableGroup
    this.scene.add(this.table)
  }

  /**
   * 创建球袋
   */
  createPockets(tableGroup) {
    const pocketGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.1)
    const pocketMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 })

    const pocketPositions = [
      [-3.8, 0, -1.8],  // 左上
      [-3.8, 0, 1.8],   // 左下
      [0, 0, -1.8],     // 中上
      [0, 0, 1.8],      // 中下
      [3.8, 0, -1.8],   // 右上
      [3.8, 0, 1.8]     // 右下
    ]

    this.pockets = []
    pocketPositions.forEach(pos => {
      const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial)
      pocket.position.set(pos[0], pos[1], pos[2])
      tableGroup.add(pocket)
      this.pockets.push(pocket)
    })
  }

  /**
   * 创建桌球
   */
  createBalls() {
    this.balls = []
    this.physicsBodies = []
    const ballRadius = 0.1
    const ballGeometry = new THREE.SphereGeometry(ballRadius, 16, 16)

    // 球的颜色配置
    const ballColors = [
      0xffffff,  // 0: 白球
      0xffff00,  // 1: 黄色
      0x0000ff,  // 2: 蓝色
      0xff0000,  // 3: 红色
      0x800080,  // 4: 紫色
      0xffa500,  // 5: 橙色
      0x008000,  // 6: 绿色
      0x800000,  // 7: 栗色
      0x000000,  // 8: 黑球
      0xffff00,  // 9: 黄色条纹
      0x0000ff,  // 10: 蓝色条纹
      0xff0000,  // 11: 红色条纹
      0x800080,  // 12: 紫色条纹
      0xffa500,  // 13: 橙色条纹
      0x008000,  // 14: 绿色条纹
      0x800000   // 15: 栗色条纹
    ]

    // 球的初始位置配置
    const ballPositions = [
      [2.5, 0.1, 0],    // 0: 白球
      [1, 0.1, 0],      // 1: 黄色
      [0.8, 0.1, -0.1], // 2: 蓝色
      [0.8, 0.1, 0.1],  // 3: 红色
      [0.6, 0.1, -0.2], // 4: 紫色
      [0.6, 0.1, 0],    // 5: 橙色
      [0.6, 0.1, 0.2],  // 6: 绿色
      [0.4, 0.1, -0.3], // 7: 栗色
      [0.4, 0.1, -0.1], // 8: 黑球
      [0.4, 0.1, 0.1],  // 9: 黄色条纹
      [0.4, 0.1, 0.3],  // 10: 蓝色条纹
      [0.2, 0.1, -0.4], // 11: 红色条纹
      [0.2, 0.1, -0.2], // 12: 紫色条纹
      [0.2, 0.1, 0],    // 13: 橙色条纹
      [0.2, 0.1, 0.2],  // 14: 绿色条纹
      [0.2, 0.1, 0.4]   // 15: 栗色条纹
    ]

    ballPositions.forEach((pos, index) => {
      const ballMaterial = new THREE.MeshPhongMaterial({
        color: ballColors[index],
        shininess: 100,
        specular: 0x111111
      })

      const ball = new THREE.Mesh(ballGeometry, ballMaterial)
      ball.position.set(pos[0], pos[1], pos[2])
      ball.castShadow = true
      ball.receiveShadow = true
      ball.userData = {
        id: index,
        isMoving: false,
        velocity: new THREE.Vector3(0, 0, 0)
      }

      // 创建物理体
      const ballShape = new CANNON.Sphere(ballRadius)
      const ballBody = new CANNON.Body({
        mass: 1,
        material: this.ballMaterial
      })
      ballBody.addShape(ballShape)
      ballBody.position.set(pos[0], pos[1], pos[2])

      // 连接渲染物体和物理体
      ball.userData.physicsBody = ballBody

      this.world.addBody(ballBody)
      this.physicsBodies.push(ballBody)
      this.balls.push(ball)
      this.scene.add(ball)
    })
  }

  /**
   * 创建球杆
   */
  createCueStick() {
    const stickGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2)
    const stickMaterial = new THREE.MeshPhongMaterial({
      color: 0x8B4513,
      shininess: 30
    })
    this.cueStick = new THREE.Mesh(stickGeometry, stickMaterial)
    this.cueStick.visible = false
    this.cueStick.castShadow = true
    this.scene.add(this.cueStick)

    // 创建瞄准线
    this.createAimingLine()
  }

  /**
   * 创建瞄准线
   */
  createAimingLine() {
    const lineGeometry = new THREE.BufferGeometry()
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 3,
      transparent: true,
      opacity: 0.8
    })

    // 创建瞄准线点数组
    const points = []
    for (let i = 0; i < 100; i++) {
      points.push(new THREE.Vector3(0, 0, 0))
    }

    lineGeometry.setFromPoints(points)
    this.aimingLine = new THREE.Line(lineGeometry, lineMaterial)
    this.aimingLine.visible = false
    this.scene.add(this.aimingLine)

    // 创建轨迹预测线
    this.createTrajectoryLines()
  }

  /**
   * 创建轨迹预测线
   */
  createTrajectoryLines() {
    // 白球轨迹线
    const cueBallTrajectoryGeometry = new THREE.BufferGeometry()
    const cueBallTrajectoryMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 2,
      transparent: true,
      opacity: 0.6
    })

    const cueBallPoints = []
    for (let i = 0; i < 200; i++) {
      cueBallPoints.push(new THREE.Vector3(0, 0, 0))
    }

    cueBallTrajectoryGeometry.setFromPoints(cueBallPoints)
    const cueBallTrajectory = new THREE.Line(cueBallTrajectoryGeometry, cueBallTrajectoryMaterial)
    cueBallTrajectory.visible = false
    this.scene.add(cueBallTrajectory)

    // 目标球轨迹线
    const targetBallTrajectoryGeometry = new THREE.BufferGeometry()
    const targetBallTrajectoryMaterial = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      linewidth: 2,
      transparent: true,
      opacity: 0.6
    })

    const targetBallPoints = []
    for (let i = 0; i < 200; i++) {
      targetBallPoints.push(new THREE.Vector3(0, 0, 0))
    }

    targetBallTrajectoryGeometry.setFromPoints(targetBallPoints)
    const targetBallTrajectory = new THREE.Line(targetBallTrajectoryGeometry, targetBallTrajectoryMaterial)
    targetBallTrajectory.visible = false
    this.scene.add(targetBallTrajectory)

    this.trajectoryLines = [cueBallTrajectory, targetBallTrajectory]
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    this.container.addEventListener('mousemove', this.onMouseMove)
    this.container.addEventListener('mousedown', this.onMouseDown)
    this.container.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('resize', this.onResize)
  }

  /**
   * 鼠标移动事件处理
   */
  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect()
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    if (this.gamePhase === 'aiming' || this.gamePhase === 'breaking') {
      this.updateCueStick()
    }
  }

  /**
   * 鼠标按下事件处理
   */
  onMouseDown(event) {
    this.isMouseDown = true
  }

  /**
   * 鼠标松开事件处理
   */
  onMouseUp(event) {
    if (this.isMouseDown && (this.gamePhase === 'aiming' || this.gamePhase === 'breaking')) {
      this.shootBall()
    }
    this.isMouseDown = false
  }

  /**
   * 窗口大小变化事件处理
   */
  onResize() {
    const width = this.container.clientWidth
    const height = this.container.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
  }

  /**
   * 更新球杆位置和方向
   */
  updateCueStick() {
    if (!this.balls[0] || this.balls[0].userData.isMoving) {
      this.hideCueAndAimingElements()
      return
    }

    // 只在瞄准和开球状态下显示球杆
    if (this.gamePhase !== 'aiming' && this.gamePhase !== 'breaking') {
      this.hideCueAndAimingElements()
      return
    }

    this.raycaster.setFromCamera(this.mouse, this.camera)

    // 创建一个平面来计算射线交点
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const intersectPoint = new THREE.Vector3()

    if (this.raycaster.ray.intersectPlane(plane, intersectPoint)) {
      const cueBall = this.balls[0]
      const direction = new THREE.Vector3().subVectors(intersectPoint, cueBall.position)
      direction.y = 0
      direction.normalize()

      // 保存当前瞄准方向
      this.currentAimDirection.copy(direction)

      // 设置球杆位置（在白球后方，确保不穿过白球）
      const ballRadius = 0.1
      const stickDistance = 1.0 // 增加距离，确保球杆不穿过白球
      this.cueStick.position.copy(cueBall.position)
      this.cueStick.position.addScaledVector(direction, -stickDistance)
      this.cueStick.position.y = cueBall.position.y // 保持球杆与白球同一水平高度

      // 修正球杆方向 - 使球杆总是指向白球
      // 计算从球杆位置到白球的方向
      const stickToWhiteBall = new THREE.Vector3().subVectors(cueBall.position, this.cueStick.position)
      stickToWhiteBall.y = 0 // 确保球杆保持水平
      stickToWhiteBall.normalize()

      // 重置球杆旋转
      this.cueStick.rotation.set(0, 0, 0)

      // 使用lookAt方法直接让球杆指向白球
      // 先创建一个临时目标点
      const targetPoint = cueBall.position.clone()
      targetPoint.y = this.cueStick.position.y // 保持同一水平高度

      // 让球杆指向白球
      this.cueStick.lookAt(targetPoint)

      // 由于CylinderGeometry默认沿Y轴方向，需要额外旋转使其水平指向目标
      this.cueStick.rotateX(-Math.PI / 2)
      this.cueStick.visible = true

      // 更新瞄准线
      this.updateAimingLine(cueBall, direction)

      // 更新轨迹预测线
      this.updateTrajectoryPrediction(cueBall, direction)
    }
  }

  /**
   * 隐藏球杆和瞄准元素
   */
  hideCueAndAimingElements() {
    if (this.cueStick) {
      this.cueStick.visible = false
    }
    if (this.aimingLine) {
      this.aimingLine.visible = false
    }
    this.trajectoryLines.forEach(line => {
      if (line) line.visible = false
    })
  }

  /**
   * 更新瞄准线
   */
  updateAimingLine(cueBall, direction) {
    if (!this.aimingLine) return

    const points = []
    const startPos = cueBall.position.clone()

    // 找到瞄准方向上最近的目标球
    const targetBall = this.findTargetBallInDirection(cueBall, direction)

    let endPos
    if (targetBall) {
      // 如果有目标球，瞄准线显示到目标球边缘（不限制长度）
      const ballRadius = 0.1
      const distanceToTarget = startPos.distanceTo(targetBall.position)
      const adjustedDistance = Math.max(0, distanceToTarget - ballRadius)
      endPos = startPos.clone().addScaledVector(direction, adjustedDistance)
    } else {
      // 如果没有目标球，不显示瞄准线
      this.aimingLine.visible = false
      return
    }

    // 创建虚线效果
    const lineLength = startPos.distanceTo(endPos)
    const segments = Math.max(20, Math.floor(lineLength * 20)) // 根据长度调整段数

    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1)
      const pos = startPos.clone().lerp(endPos, t)

      // 虚线效果：间隔显示
      if (Math.floor(i / 3) % 2 === 0) {
        points.push(pos)
      } else {
        points.push(pos) // 保持连续性，但可以通过材质透明度创建虚线效果
      }
    }

    this.aimingLine.geometry.setFromPoints(points)
    this.aimingLine.visible = points.length > 1
  }

  /**
   * 在指定方向上找到最近的目标球
   */
  findTargetBallInDirection(cueBall, direction) {
    const ballRadius = 0.1
    let closestBall = null
    let minDistance = Infinity

    for (let i = 1; i < this.balls.length; i++) {
      const ball = this.balls[i]
      if (!ball.visible) continue

      const toBall = new THREE.Vector3().subVectors(ball.position, cueBall.position)
      const distance = toBall.length()

      // 检查球是否在瞄准方向上（允许一定的角度偏差）
      toBall.normalize()
      const dotProduct = toBall.dot(direction)

      // 只考虑在瞄准方向上的球（角度小于30度）
      if (dotProduct > 0.866 && distance < minDistance) { // cos(30°) ≈ 0.866
        minDistance = distance
        closestBall = ball
      }
    }

    return closestBall
  }
  /**
   * 更新轨迹预测线
   */
  updateTrajectoryPrediction(cueBall, direction) {
    if (!this.trajectoryLines || this.trajectoryLines.length < 2) return

    // 计算白球撞击目标球后的轨迹
    const cueBallAfterCollisionTrajectory = this.calculateCueBallAfterCollisionTrajectory(
      cueBall.position,
      direction,
      this.shotPower
    )

    // 更新白球轨迹线（只显示撞击后的轨迹）
    if (this.trajectoryLines[0]) {
      this.trajectoryLines[0].geometry.setFromPoints(cueBallAfterCollisionTrajectory.points)
      this.trajectoryLines[0].visible = cueBallAfterCollisionTrajectory.points.length > 1
    }

    // 更新目标球轨迹线（如果有碰撞）
    if (cueBallAfterCollisionTrajectory.targetBallTrajectory && this.trajectoryLines[1]) {
      this.trajectoryLines[1].geometry.setFromPoints(cueBallAfterCollisionTrajectory.targetBallTrajectory.points)
      this.trajectoryLines[1].visible = cueBallAfterCollisionTrajectory.targetBallTrajectory.points.length > 1
    } else if (this.trajectoryLines[1]) {
      this.trajectoryLines[1].visible = false
    }
  }

  /**
   * 计算白球撞击目标球后的轨迹
   */
  calculateCueBallAfterCollisionTrajectory(startPos, direction, power) {
    const points = []
    const ballRadius = 0.1
    const tableWidth = 4
    const tableLength = 8
    const friction = 0.98
    const maxDistance = 2.0 // 限制白球轨迹线长度为2米

    // 首先找到碰撞点（传入白球对象）
    const cueBall = this.balls[0] // 获取白球对象
    const collision = this.predictBallCollision(cueBall, direction, power)

    if (!collision) {
      // 如果没有碰撞，不显示白球轨迹
      return { points: [], targetBallTrajectory: null }
    }

    // 从碰撞点开始计算白球的轨迹
    let currentPos = collision.collisionPoint.clone()

    // 计算碰撞后白球的新速度
    const cueBallVelocity = direction.clone().multiplyScalar(power * 10)
    const collisionResult = this.calculateCueBallAfterCollision(
      cueBallVelocity,
      collision.targetBall.position,
      collision.collisionPoint
    )

    let velocity = collisionResult.newVelocity
    let speed = velocity.length()
    let totalDistance = 0

    const stepSize = 0.05
    const maxSteps = Math.floor(maxDistance / stepSize)

    // 从碰撞点开始计算轨迹
    for (let i = 0; i < maxSteps && speed > 0.05 && totalDistance < maxDistance; i++) {
      const prevPos = currentPos.clone()
      currentPos.add(velocity.clone().multiplyScalar(stepSize))

      // 计算累计距离
      totalDistance += prevPos.distanceTo(currentPos)

      // 检查边界碰撞
      const borderCollision = this.checkBorderCollision(currentPos, velocity, ballRadius, tableWidth, tableLength)
      if (borderCollision.bounced) {
        velocity = borderCollision.newVelocity
        currentPos = borderCollision.newPosition
        speed = velocity.length()
      }

      // 检查是否进袋
      if (this.checkPocketCollision(currentPos)) {
        points.push(currentPos.clone())
        break
      }

      // 应用摩擦力
      velocity.multiplyScalar(friction)
      speed = velocity.length()

      // 每隔几步添加一个点，减少点数
      if (i % 2 === 0) {
        points.push(currentPos.clone())
      }
    }

    // 计算目标球轨迹
    const targetBallTrajectory = this.calculateLimitedBallTrajectory(
      collision.targetBall.position,
      collision.targetDirection,
      collision.transferredPower,
      1.5 // 目标球轨迹限制为1.5米
    )

    return {
      points,
      targetBallTrajectory
    }
  }

  /**
   * 计算白球完整轨迹（包括可能的变向）
   */
  calculateCompleteCueBallTrajectory(startPos, direction, power) {
    const points = []
    const ballRadius = 0.1
    const tableWidth = 4
    const tableLength = 8
    const friction = 0.98
    const bounceRestitution = 0.7
    const maxDistance = 2.0 // 限制白球轨迹线长度为2米

    let currentPos = startPos.clone()
    let velocity = direction.clone().multiplyScalar(power * 10)
    let speed = velocity.length()
    let totalDistance = 0
    let firstCollision = null

    const stepSize = 0.05
    const maxSteps = Math.floor(maxDistance / stepSize)

    for (let i = 0; i < maxSteps && speed > 0.05 && totalDistance < maxDistance; i++) {
      const prevPos = currentPos.clone()
      currentPos.add(velocity.clone().multiplyScalar(stepSize))

      // 计算累计距离
      totalDistance += prevPos.distanceTo(currentPos)

      // 检查与其他球的碰撞（只在还没有碰撞时检查）
      if (!firstCollision) {
        const ballCollision = this.checkBallToBallCollision(currentPos, velocity, i)
        if (ballCollision) {
          firstCollision = ballCollision

          // 计算碰撞后白球的新方向
          const collisionResult = this.calculateCueBallAfterCollision(
            velocity,
            ballCollision.targetBall.position,
            currentPos
          )

          // 更新白球速度
          velocity = collisionResult.newVelocity
          speed = velocity.length()

          // 添加碰撞点
          points.push(currentPos.clone())
          continue
        }
      }

      // 检查边界碰撞
      const borderCollision = this.checkBorderCollision(currentPos, velocity, ballRadius, tableWidth, tableLength)
      if (borderCollision.bounced) {
        velocity = borderCollision.newVelocity
        currentPos = borderCollision.newPosition
        speed = velocity.length()
      }

      // 检查是否进袋
      if (this.checkPocketCollision(currentPos)) {
        points.push(currentPos.clone())
        break
      }

      // 应用摩擦力
      velocity.multiplyScalar(friction)
      speed = velocity.length()

      // 每隔几步添加一个点，减少点数
      if (i % 2 === 0) {
        points.push(currentPos.clone())
      }
    }

    return {
      points,
      finalPos: currentPos.clone(),
      firstCollision
    }
  }

  /**
   * 检查球与球的碰撞
   */
  checkBallToBallCollision(currentPos, velocity, step) {
    const ballRadius = 0.1

    for (let i = 1; i < this.balls.length; i++) {
      const ball = this.balls[i]
      if (!ball.visible) continue

      const distance = currentPos.distanceTo(ball.position)

      if (distance < ballRadius * 2) {
        // 计算碰撞后目标球的方向
        const targetDirection = new THREE.Vector3()
          .subVectors(ball.position, currentPos)
          .normalize()

        // 计算能量传递
        const speedAtCollision = velocity.length() * Math.pow(0.98, step * 3)
        const transferredPower = speedAtCollision / 10 * 0.8

        return {
          targetBall: ball,
          targetDirection: targetDirection,
          transferredPower: transferredPower,
          collisionPoint: currentPos.clone()
        }
      }
    }

    return null
  }

  /**
   * 计算碰撞后白球的新速度
   */
  calculateCueBallAfterCollision(cueBallVelocity, targetBallPos, collisionPos) {
    // 计算碰撞方向
    const collisionDirection = new THREE.Vector3()
      .subVectors(targetBallPos, collisionPos)
      .normalize()

    // 计算白球在碰撞方向上的速度分量
    const velocityInCollisionDirection = cueBallVelocity.clone().projectOnVector(collisionDirection)
    const velocityPerpendicularToCollision = cueBallVelocity.clone().sub(velocityInCollisionDirection)

    // 碰撞后，白球在碰撞方向上的速度减少，垂直方向的速度保持
    const restitution = 0.8 // 碰撞恢复系数
    const newVelocityInCollisionDirection = velocityInCollisionDirection.multiplyScalar(-restitution * 0.3)
    const newVelocity = velocityPerpendicularToCollision.add(newVelocityInCollisionDirection)

    return {
      newVelocity: newVelocity
    }
  }

  /**
   * 检查边界碰撞
   */
  checkBorderCollision(currentPos, velocity, ballRadius, tableWidth, tableLength) {
    let bounced = false
    let newVelocity = velocity.clone()
    let newPosition = currentPos.clone()

    // X轴边界
    if (currentPos.x + ballRadius > tableLength / 2) {
      newPosition.x = tableLength / 2 - ballRadius
      newVelocity.x *= -0.7 // 边界反弹系数
      bounced = true
    } else if (currentPos.x - ballRadius < -tableLength / 2) {
      newPosition.x = -tableLength / 2 + ballRadius
      newVelocity.x *= -0.7
      bounced = true
    }

    // Z轴边界
    if (currentPos.z + ballRadius > tableWidth / 2) {
      newPosition.z = tableWidth / 2 - ballRadius
      newVelocity.z *= -0.7
      bounced = true
    } else if (currentPos.z - ballRadius < -tableWidth / 2) {
      newPosition.z = -tableWidth / 2 + ballRadius
      newVelocity.z *= -0.7
      bounced = true
    }

    return {
      bounced,
      newVelocity,
      newPosition
    }
  }

  /**
   * 计算限制长度的球轨迹
   */
  calculateLimitedBallTrajectory(startPos, direction, power, maxDistance = 2.0) {
    const points = []
    const ballRadius = 0.1
    const tableWidth = 4
    const tableLength = 8
    const friction = 0.98
    const bounceRestitution = 0.7

    let currentPos = startPos.clone()
    let velocity = direction.clone().multiplyScalar(power * 10)
    let speed = velocity.length()
    let totalDistance = 0

    // 不包括起始点，只显示击球后的轨迹
    const stepSize = 0.05
    const maxSteps = Math.floor(maxDistance / stepSize)

    for (let i = 0; i < maxSteps && speed > 0.05 && totalDistance < maxDistance; i++) {
      // 更新位置
      const prevPos = currentPos.clone()
      currentPos.add(velocity.clone().multiplyScalar(stepSize))

      // 计算累计距离
      totalDistance += prevPos.distanceTo(currentPos)

      // 检查边界碰撞
      let bounced = false

      // X轴边界
      if (currentPos.x + ballRadius > tableLength / 2) {
        currentPos.x = tableLength / 2 - ballRadius
        velocity.x *= -bounceRestitution
        bounced = true
      } else if (currentPos.x - ballRadius < -tableLength / 2) {
        currentPos.x = -tableLength / 2 + ballRadius
        velocity.x *= -bounceRestitution
        bounced = true
      }

      // Z轴边界
      if (currentPos.z + ballRadius > tableWidth / 2) {
        currentPos.z = tableWidth / 2 - ballRadius
        velocity.z *= -bounceRestitution
        bounced = true
      } else if (currentPos.z - ballRadius < -tableWidth / 2) {
        currentPos.z = -tableWidth / 2 + ballRadius
        velocity.z *= -bounceRestitution
        bounced = true
      }

      // 检查是否进袋
      const isPocketed = this.checkPocketCollision(currentPos)
      if (isPocketed) {
        points.push(currentPos.clone())
        break
      }

      // 应用摩擦力
      velocity.multiplyScalar(friction)
      speed = velocity.length()

      // 每隔几步添加一个点，减少点数
      if (i % 2 === 0) {
        points.push(currentPos.clone())
      }
    }

    return { points, finalPos: currentPos.clone() }
  }

  /**
   * 计算球的轨迹
   */
  calculateBallTrajectory(startPos, direction, power, maxSteps = 150) {
    const points = []
    const ballRadius = 0.1
    const tableWidth = 4
    const tableLength = 8
    const friction = 0.98
    const bounceRestitution = 0.7

    let currentPos = startPos.clone()
    let velocity = direction.clone().multiplyScalar(power * 10)
    let speed = velocity.length()

    // 起始点
    points.push(currentPos.clone())

    for (let i = 0; i < maxSteps && speed > 0.05; i++) {
      // 更新位置
      currentPos.add(velocity.clone().multiplyScalar(0.05))

      // 检查边界碰撞
      let bounced = false

      // X轴边界
      if (currentPos.x + ballRadius > tableLength / 2) {
        currentPos.x = tableLength / 2 - ballRadius
        velocity.x *= -bounceRestitution
        bounced = true
      } else if (currentPos.x - ballRadius < -tableLength / 2) {
        currentPos.x = -tableLength / 2 + ballRadius
        velocity.x *= -bounceRestitution
        bounced = true
      }

      // Z轴边界
      if (currentPos.z + ballRadius > tableWidth / 2) {
        currentPos.z = tableWidth / 2 - ballRadius
        velocity.z *= -bounceRestitution
        bounced = true
      } else if (currentPos.z - ballRadius < -tableWidth / 2) {
        currentPos.z = -tableWidth / 2 + ballRadius
        velocity.z *= -bounceRestitution
        bounced = true
      }

      // 检查是否进袋
      const isPocketed = this.checkPocketCollision(currentPos)
      if (isPocketed) {
        break
      }

      // 应用摩擦力
      velocity.multiplyScalar(friction)
      speed = velocity.length()

      // 每隔几步添加一个点，减少点数
      if (i % 3 === 0) {
        points.push(currentPos.clone())
      }
    }

    return { points, finalPos: currentPos.clone() }
  }

  /**
   * 预测球与球的碰撞
   */
  predictBallCollision(cueBall, direction, power) {
    const ballRadius = 0.1
    let minDistance = Infinity
    let closestBall = null
    let collisionPoint = null

    // 计算白球的运动轨迹
    const velocity = direction.clone().multiplyScalar(power * 10)
    let currentPos = cueBall.position.clone()

    for (let step = 0; step < 100; step++) {
      currentPos.add(velocity.clone().multiplyScalar(0.05))

      // 检查与每个球的距离
      for (let i = 1; i < this.balls.length; i++) {
        const ball = this.balls[i]
        if (!ball.visible) continue

        const distance = currentPos.distanceTo(ball.position)

        if (distance < ballRadius * 2 && distance < minDistance) {
          minDistance = distance
          closestBall = ball
          collisionPoint = currentPos.clone()

          // 计算碰撞后目标球的方向
          const targetDirection = new THREE.Vector3()
            .subVectors(ball.position, collisionPoint)
            .normalize()

          // 计算能量传递（简化计算）
          const speedAtCollision = velocity.length() * Math.pow(0.98, step * 3)
          const transferredPower = speedAtCollision / 10 * 0.8

          return {
            targetBall: ball,
            targetDirection: targetDirection,
            transferredPower: transferredPower,
            collisionPoint: collisionPoint
          }
        }
      }

      // 应用摩擦力
      velocity.multiplyScalar(0.98)

      // 如果速度太小，停止计算
      if (velocity.length() < 0.1) break
    }

    return null
  }

  /**
   * 检查是否进袋
   */
  checkPocketCollision(position) {
    const pocketRadius = 0.25

    if (!this.pockets) return false

    for (const pocket of this.pockets) {
      const distance = position.distanceTo(pocket.position)
      if (distance < pocketRadius) {
        return true
      }
    }

    return false
  }

  /**
   * 击球
   */
  shootBall() {
    const cueBall = this.balls[0]
    if (!cueBall || cueBall.userData.isMoving) return

    this.raycaster.setFromCamera(this.mouse, this.camera)

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const intersectPoint = new THREE.Vector3()

    if (this.raycaster.ray.intersectPlane(plane, intersectPoint)) {
      const direction = new THREE.Vector3().subVectors(intersectPoint, cueBall.position)
      direction.y = 0
      direction.normalize()

      // 应用力度到物理体
      const force = direction.multiplyScalar(this.shotPower * 50)
      const physicsBody = cueBall.userData.physicsBody

      if (physicsBody) {
        physicsBody.velocity.set(force.x, 0, force.z)
        cueBall.userData.isMoving = true

        // 播放击球音效
        if (this.soundManager) {
          this.soundManager.play('cueHit', this.shotPower)
        }

        // 创建击球特效
        if (this.effectsManager) {
          this.effectsManager.createCueHitEffect(cueBall.position, direction, this.shotPower)
        }
      }

      this.gamePhase = 'shooting'

      // 隐藏所有瞄准元素
      this.hideCueAndAimingElements()

      this.emit('statusChange', '击球中...')
    }
  }

  /**
   * 设置击球力度
   */
  setShotPower(power) {
    this.shotPower = Math.max(0, Math.min(1, power))
  }

  /**
   * 游戏主循环
   */
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate())

    this.updatePhysics()
    this.checkGameState()
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * 更新物理模拟
   */
  updatePhysics() {
    // 步进物理世界
    this.world.step(1/60)

    let anyBallMoving = false

    // 更新渲染物体位置以匹配物理体
    this.balls.forEach((ball, index) => {
      const body = ball.userData.physicsBody

      if (body) {
        // 同步渲染物体位置与物理体位置
        ball.position.copy(body.position)
        ball.quaternion.copy(body.quaternion)

        // 检查球是否在移动
        const velocity = body.velocity
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z)

        if (speed > 0.01) {
          ball.userData.isMoving = true
          anyBallMoving = true
        } else {
          ball.userData.isMoving = false
          // 停止球的运动
          body.velocity.set(0, 0, 0)
          body.angularVelocity.set(0, 0, 0)
        }

        // 应用摩擦力和阻尼
        if (ball.userData.isMoving) {
          body.velocity.x *= 0.98
          body.velocity.z *= 0.98
          body.angularVelocity.x *= 0.95
          body.angularVelocity.y *= 0.95
          body.angularVelocity.z *= 0.95
        }
      }
    })

    // 检查球是否进袋
    this.checkPocketedBalls()

    // 如果所有球都停止了，处理回合结果
    if (!anyBallMoving && this.gamePhase === 'shooting') {
      this.handleTurnEnd()
    }
  }

  /**
   * 处理球与桌边的碰撞
   */
  handleTableCollision(ball) {
    const tableWidth = 4
    const tableLength = 8
    const ballRadius = 0.1

    // X轴边界
    if (ball.position.x + ballRadius > tableLength / 2) {
      ball.position.x = tableLength / 2 - ballRadius
      ball.userData.velocity.x *= -0.8
    } else if (ball.position.x - ballRadius < -tableLength / 2) {
      ball.position.x = -tableLength / 2 + ballRadius
      ball.userData.velocity.x *= -0.8
    }

    // Z轴边界
    if (ball.position.z + ballRadius > tableWidth / 2) {
      ball.position.z = tableWidth / 2 - ballRadius
      ball.userData.velocity.z *= -0.8
    } else if (ball.position.z - ballRadius < -tableWidth / 2) {
      ball.position.z = -tableWidth / 2 + ballRadius
      ball.userData.velocity.z *= -0.8
    }
  }

  /**
   * 处理球与球的碰撞
   */
  handleBallCollisions() {
    const ballRadius = 0.1

    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        const ball1 = this.balls[i]
        const ball2 = this.balls[j]

        if (!ball1.visible || !ball2.visible) continue

        const distance = ball1.position.distanceTo(ball2.position)

        if (distance < ballRadius * 2) {
          // 计算碰撞
          const direction = new THREE.Vector3().subVectors(ball2.position, ball1.position).normalize()

          // 分离球
          const overlap = ballRadius * 2 - distance
          ball1.position.addScaledVector(direction, -overlap / 2)
          ball2.position.addScaledVector(direction, overlap / 2)

          // 计算速度变化
          const v1 = ball1.userData.velocity.clone()
          const v2 = ball2.userData.velocity.clone()

          const dot1 = v1.dot(direction)
          const dot2 = v2.dot(direction)

          ball1.userData.velocity.addScaledVector(direction, dot2 - dot1)
          ball2.userData.velocity.addScaledVector(direction, dot1 - dot2)

          ball1.userData.isMoving = true
          ball2.userData.isMoving = true
        }
      }
    }
  }

  /**
   * 检查球是否进袋
   */
  checkPocketedBalls() {
    const pocketRadius = 0.25

    this.balls.forEach(ball => {
      if (!ball.visible) return

      this.pockets.forEach(pocket => {
        const distance = ball.position.distanceTo(pocket.position)
        if (distance < pocketRadius) {
          ball.visible = false
          ball.userData.isMoving = false

          // 播放进球音效
          if (this.soundManager) {
            this.soundManager.play('ballPocket')
          }

          // 创建进球特效
          if (this.effectsManager) {
            this.effectsManager.createPocketEffect(pocket.position)
          }

          // 从物理世界中移除球
          if (ball.userData.physicsBody) {
            this.world.removeBody(ball.userData.physicsBody)
          }

          // 处理进球逻辑
          this.handleBallPocketed(ball.userData.id)
        }
      })
    })
  }

  /**
   * 处理球进袋
   */
  handleBallPocketed(ballId) {
    const currentPlayerName = this.currentPlayer === 0 ? '玩家 1' : '玩家 2'

    if (ballId === 0) {
      // 白球进袋，犯规
      this.handleFoul('白球进袋！犯规！')
      return
    }

    if (ballId === 8) {
      // 8号黑球进袋
      this.handleBlackBallPocketed()
      return
    }

    // 其他球进袋
    const ballType = this.getBallType(ballId)

    if (this.isBreaking) {
      // 开球阶段
      this.handleBreakingBall(ballId, ballType)
    } else {
      // 正常游戏阶段
      this.handleNormalBall(ballId, ballType)
    }
  }

  /**
   * 获取球的类型
   */
  getBallType(ballId) {
    if (ballId >= 1 && ballId <= 7) return 'solid'  // 实心球
    if (ballId >= 9 && ballId <= 15) return 'stripe' // 花色球
    return null
  }

  /**
   * 处理开球阶段进球
   */
  handleBreakingBall(ballId, ballType) {
    this.isBreaking = false
    this.gamePhase = 'aiming'

    // 根据第一个进的球确定玩家的球组
    if (this.currentPlayer === 0) {
      this.player1Group = ballType
      this.player2Group = ballType === 'solid' ? 'stripe' : 'solid'
    } else {
      this.player2Group = ballType
      this.player1Group = ballType === 'solid' ? 'stripe' : 'solid'
    }

    this.ballsPocketed[ballType].push(ballId)

    // 触发球组分配事件
    this.emit('groupAssigned', {
      player1: this.player1Group,
      player2: this.player2Group
    })

    this.emit('statusChange', `${this.currentPlayer === 0 ? '玩家 1' : '玩家 2'} 获得${ballType === 'solid' ? '实心球' : '花色球'}组！${ballId}号球进袋！`)

    // 开球进球继续击球
  }

  /**
   * 处理正常游戏阶段进球
   */
  handleNormalBall(ballId, ballType) {
    const currentPlayerGroup = this.currentPlayer === 0 ? this.player1Group : this.player2Group

    if (ballType === currentPlayerGroup) {
      // 进自己的球
      this.ballsPocketed[ballType].push(ballId)
      this.emit('statusChange', `${ballId}号球进袋！继续击球！`)

      // 检查是否打完了自己的所有球
      if (this.hasFinishedOwnBalls()) {
        this.emit('statusChange', '现在可以击打黑八球了！')
      }
    } else {
      // 进对手的球，犯规
      this.ballsPocketed[ballType].push(ballId)
      this.handleFoul(`进对手的球！${ballId}号球！犯规！`)
    }
  }

  /**
   * 处理黑球进袋
   */
  handleBlackBallPocketed() {
    const currentPlayerGroup = this.currentPlayer === 0 ? this.player1Group : this.player2Group

    if (this.hasFinishedOwnBalls()) {
      // 正当进黑球，获胜
      this.ballsPocketed.black = true
      this.emit('statusChange', `游戏结束！${this.currentPlayer === 0 ? '玩家 1' : '玩家 2'} 获胜！`)
      this.isGameActive = false

      // 播放获胜音效和特效
      if (this.soundManager) {
        this.soundManager.play('gameWin')
      }
      if (this.effectsManager) {
        this.effectsManager.createVictoryEffect(this.scene)
      }
    } else {
      // 过早进黑球，失败
      this.emit('statusChange', `过早击打黑球！${this.currentPlayer === 0 ? '玩家 2' : '玩家 1'} 获胜！`)
      this.isGameActive = false

      // 播放犯规音效
      if (this.soundManager) {
        this.soundManager.play('foul')
      }
    }
  }

  /**
   * 检查玩家是否打完了自己的所有球
   */
  hasFinishedOwnBalls() {
    const currentPlayerGroup = this.currentPlayer === 0 ? this.player1Group : this.player2Group

    if (!currentPlayerGroup) return false

    const totalBalls = 7 // 每组有7个球
    const pocketedBalls = this.ballsPocketed[currentPlayerGroup].length

    return pocketedBalls >= totalBalls
  }

  /**
   * 处理犯规
   */
  handleFoul(message) {
    const foulPlayer = this.currentPlayer === 0 ? 'player1' : 'player2'
    this.fouls[foulPlayer]++

    this.emit('statusChange', message)

    // 播放犯规音效
    if (this.soundManager) {
      this.soundManager.play('foul')
    }

    // 重新放置白球
    this.resetCueBall()

    // 切换玩家
    this.switchPlayer()
  }

  /**
   * 处理回合结束
   */
  handleTurnEnd() {
    this.gamePhase = 'aiming'

    // 检查是否有进球
    // 这里简化处理，实际上应该记录本次击球的进球情况
    // 如果没有进球，则切换玩家

    this.emit('statusChange', '等待瞄准')
  }

  /**
   * 重置白球位置
   */
  resetCueBall() {
    const cueBall = this.balls[0]
    cueBall.position.set(2.5, 0.1, 0)
    cueBall.visible = true
    cueBall.userData.isMoving = false

    // 重新添加物理体
    if (cueBall.userData.physicsBody) {
      this.world.addBody(cueBall.userData.physicsBody)
      cueBall.userData.physicsBody.position.set(2.5, 0.1, 0)
      cueBall.userData.physicsBody.velocity.set(0, 0, 0)
      cueBall.userData.physicsBody.angularVelocity.set(0, 0, 0)
    }
  }

  /**
   * 切换玩家
   */
  switchPlayer() {
    this.currentPlayer = 1 - this.currentPlayer
    this.emit('playerChange', this.currentPlayer)
  }

  /**
   * 检查游戏状态
   */
  checkGameState() {
    // 这里可以添加更多游戏状态检查逻辑
  }

  /**
   * 开始游戏循环
   */
  startGameLoop() {
    this.animate()
  }

  /**
   * 暂停游戏
   */
  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  /**
   * 恢复游戏
   */
  resume() {
    if (!this.animationId) {
      this.animate()
    }
  }

  /**
   * 重置游戏
   */
  reset() {
    // 重置球的位置
    const ballPositions = [
      [2.5, 0.1, 0],    // 白球
      [1, 0.1, 0],      // 1号球
      [0.8, 0.1, -0.1], [0.8, 0.1, 0.1],
      [0.6, 0.1, -0.2], [0.6, 0.1, 0], [0.6, 0.1, 0.2],
      [0.4, 0.1, -0.3], [0.4, 0.1, -0.1], [0.4, 0.1, 0.1], [0.4, 0.1, 0.3],
      [0.2, 0.1, -0.4], [0.2, 0.1, -0.2], [0.2, 0.1, 0], [0.2, 0.1, 0.2], [0.2, 0.1, 0.4]
    ]

    this.balls.forEach((ball, index) => {
      ball.position.set(...ballPositions[index])
      ball.visible = true
      ball.userData.isMoving = false

      // 重置物理体
      if (ball.userData.physicsBody) {
        ball.userData.physicsBody.position.set(...ballPositions[index])
        ball.userData.physicsBody.velocity.set(0, 0, 0)
        ball.userData.physicsBody.angularVelocity.set(0, 0, 0)

        // 如果物理体不在世界中，重新添加
        if (!this.world.bodies.includes(ball.userData.physicsBody)) {
          this.world.addBody(ball.userData.physicsBody)
        }
      }
    })

    this.currentPlayer = 0
    this.gamePhase = 'breaking'
    this.isGameActive = true

    // 隐藏瞄准元素
    this.hideCueAndAimingElements()

    // 重置黑八桌球规则状态
    this.player1Group = null
    this.player2Group = null
    this.ballsPocketed = {
      solid: [],
      stripe: [],
      black: false
    }
    this.isBreaking = true
    this.fouls = {
      player1: 0,
      player2: 0
    }
  }

  /**
   * 销毁游戏
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }

    // 移除事件监听器
    this.container.removeEventListener('mousemove', this.onMouseMove)
    this.container.removeEventListener('mousedown', this.onMouseDown)
    this.container.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('resize', this.onResize)

    // 清理场景
    while(this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0])
    }

    // 清理特殊对象
    if (this.aimingLine) {
      this.aimingLine.geometry.dispose()
      this.aimingLine.material.dispose()
    }

    if (this.trajectoryLines) {
      this.trajectoryLines.forEach(line => {
        if (line) {
          line.geometry.dispose()
          line.material.dispose()
        }
      })
    }

    // 移除渲染器
    if (this.renderer && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement)
    }
  }

  /**
   * 事件系统
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }

  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data))
    }
  }
}

export default PoolGame