import * as THREE from "https://cdn.skypack.dev/three@0.124.0";
import ky from "https://cdn.skypack.dev/kyouka@1.2.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/loaders/FBXLoader";
import { EffectComposer } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/EffectComposer";
import Stats from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/libs/stats.module";
import imagesLoaded from "https://cdn.skypack.dev/imagesloaded@4.1.4";
import LocomotiveScroll from "https://cdn.skypack.dev/locomotive-scroll@4.1.0";
import { RenderPass } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/ShaderPass.js";
import gsap from "https://cdn.skypack.dev/gsap@3.6.0";
import { Maku, MakuGroup, getScreenFov } from "https://cdn.skypack.dev/maku.js@1.0.1";
const calcAspect = (el) => el.clientWidth / el.clientHeight;
const getNormalizedMousePos = (e) => {
    return {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
    };
};
const preloadImages = (sel = "img") => {
    return new Promise((resolve) => {
        imagesLoaded(sel, { background: true }, resolve);
    });
};
const twistedGalleryMainVertexShader = `
uniform float uTime;
uniform vec2 uHoverUv;
uniform float uHoverState;

varying vec2 vUv;
varying float vNoise;

void main(){
    vec3 newPos=position;
    float dist=distance(uv,uHoverUv);
    newPos.z+=10.*sin(10.*dist+uTime)*uHoverState;
    float noise=sin(10.*dist-uTime)*uHoverState;
    vec4 modelPosition=modelMatrix*vec4(newPos,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    vUv=uv;
    vNoise=noise;
}
`;
const twistedGalleryMainFragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vNoise;

void main(){
    vec2 newUv=vUv;
    vec4 texture=texture2D(uTexture,newUv);
    vec3 color=texture.rgb;
    color.rgb+=.1*vNoise;
    gl_FragColor=vec4(color,1.);
}
`;
const twistedGalleryPostprocessingVertexShader = `
varying vec2 vUv;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    vUv=uv;
}
`;
const twistedGalleryPostprocessingFragmentShader = `
uniform sampler2D tDiffuse;
uniform float uRadius;
uniform float uPower;

varying vec2 vUv;

void main(){
    vec2 pivot=vec2(.5);
    vec2 d=vUv-pivot;
    float rDist=length(d);
    float gr=pow(rDist/uRadius,uPower);
    float mag=2.-cos(gr-1.);
    vec2 uvR=pivot+d*mag;
    vec4 color=texture2D(tDiffuse,uvR);
    gl_FragColor=color;
}
`;
class Base {
    constructor(sel, debug = false) {
        this.debug = debug;
        this.container = document.querySelector(sel);
        this.perspectiveCameraParams = {
            fov: 75,
            near: 0.1,
            far: 100
        };
        this.orthographicCameraParams = {
            zoom: 2,
            near: -100,
            far: 1000
        };
        this.cameraPosition = new THREE.Vector3(0, 3, 10);
        this.lookAtPosition = new THREE.Vector3(0, 0, 0);
        this.rendererParams = {
            outputEncoding: THREE.LinearEncoding,
            config: {
                alpha: true,
                antialias: true
            }
        };
        this.mousePos = new THREE.Vector2(0, 0);
        this.mouseSpeed = 0;
    }
    // 初始化
    init() {
        this.createScene();
        this.createPerspectiveCamera();
        this.createRenderer();
        this.createMesh({});
        this.createLight();
        this.createOrbitControls();
        this.addListeners();
        this.setLoop();
    }
    // 创建场景
    createScene() {
        const scene = new THREE.Scene();
        if (this.debug) {
            scene.add(new THREE.AxesHelper());
            const stats = Stats();
            this.container.appendChild(stats.dom);
            this.stats = stats;
        }
        this.scene = scene;
    }
    // 创建透视相机
    createPerspectiveCamera() {
        const { perspectiveCameraParams, cameraPosition, lookAtPosition } = this;
        const { fov, near, far } = perspectiveCameraParams;
        const aspect = calcAspect(this.container);
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.copy(cameraPosition);
        camera.lookAt(lookAtPosition);
        this.camera = camera;
    }
    // 创建正交相机
    createOrthographicCamera() {
        const { orthographicCameraParams, cameraPosition, lookAtPosition } = this;
        const { left, right, top, bottom, near, far } = orthographicCameraParams;
        const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        camera.position.copy(cameraPosition);
        camera.lookAt(lookAtPosition);
        this.camera = camera;
    }
    // 更新正交相机参数
    updateOrthographicCameraParams() {
        const { container } = this;
        const { zoom, near, far } = this.orthographicCameraParams;
        const aspect = calcAspect(container);
        this.orthographicCameraParams = {
            left: -zoom * aspect,
            right: zoom * aspect,
            top: zoom,
            bottom: -zoom,
            near,
            far,
            zoom
        };
    }
    // 创建渲染
    createRenderer(useWebGL1 = false) {
        var _a;
        const { rendererParams } = this;
        const { outputEncoding, config } = rendererParams;
        const renderer = !useWebGL1
            ? new THREE.WebGLRenderer(config)
            : new THREE.WebGL1Renderer(config);
        renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        renderer.outputEncoding = outputEncoding;
        this.resizeRendererToDisplaySize();
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.appendChild(renderer.domElement);
        this.renderer = renderer;
        this.renderer.setClearColor(0x000000, 0);
    }
    // 允许投影
    enableShadow() {
        this.renderer.shadowMap.enabled = true;
    }
    // 调整渲染器尺寸
    resizeRendererToDisplaySize() {
        const { renderer } = this;
        if (!renderer) {
            return;
        }
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const { clientWidth, clientHeight } = canvas;
        const width = (clientWidth * pixelRatio) | 0;
        const height = (clientHeight * pixelRatio) | 0;
        const isResizeNeeded = canvas.width !== width || canvas.height !== height;
        if (isResizeNeeded) {
            renderer.setSize(width, height, false);
        }
        return isResizeNeeded;
    }
    // 创建网格
    createMesh(meshObject, container = this.scene) {
        const { geometry = new THREE.BoxGeometry(1, 1, 1), material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#d9dfc8")
        }), position = new THREE.Vector3(0, 0, 0) } = meshObject;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        container.add(mesh);
        return mesh;
    }
    // 创建光源
    createLight() {
        const dirLight = new THREE.DirectionalLight(new THREE.Color("#ffffff"), 0.5);
        dirLight.position.set(0, 50, 0);
        this.scene.add(dirLight);
        const ambiLight = new THREE.AmbientLight(new THREE.Color("#ffffff"), 0.4);
        this.scene.add(ambiLight);
    }
    // 创建轨道控制
    createOrbitControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        const { lookAtPosition } = this;
        controls.target.copy(lookAtPosition);
        controls.update();
        this.controls = controls;
    }
    // 监听事件
    addListeners() {
        this.onResize();
    }
    // 监听画面缩放
    onResize() {
        window.addEventListener("resize", (e) => {
            if (this.shaderMaterial) {
                this.shaderMaterial.uniforms.uResolution.value.x = window.innerWidth;
                this.shaderMaterial.uniforms.uResolution.value.y = window.innerHeight;
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
            else {
                if (this.camera instanceof THREE.PerspectiveCamera) {
                    const aspect = calcAspect(this.container);
                    const camera = this.camera;
                    camera.aspect = aspect;
                    camera.updateProjectionMatrix();
                }
                else if (this.camera instanceof THREE.OrthographicCamera) {
                    this.updateOrthographicCameraParams();
                    const camera = this.camera;
                    const { left, right, top, bottom, near, far } = this.orthographicCameraParams;
                    camera.left = left;
                    camera.right = right;
                    camera.top = top;
                    camera.bottom = bottom;
                    camera.near = near;
                    camera.far = far;
                    camera.updateProjectionMatrix();
                }
                this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            }
        });
    }
    // 动画
    update() {
        console.log("animation");
    }
    // 渲染
    setLoop() {
        this.renderer.setAnimationLoop(() => {
            this.resizeRendererToDisplaySize();
            this.update();
            if (this.controls) {
                this.controls.update();
            }
            if (this.stats) {
                this.stats.update();
            }
            if (this.composer) {
                this.composer.render();
            }
            else {
                this.renderer.render(this.scene, this.camera);
            }
        });
    }
    // 创建文本
    createText(text = "", config, material = new THREE.MeshStandardMaterial({
        color: "#ffffff"
    })) {
        const geo = new THREE.TextGeometry(text, config);
        const mesh = new THREE.Mesh(geo, material);
        return mesh;
    }
    // 创建音效源
    createAudioSource() {
        const listener = new THREE.AudioListener();
        this.camera.add(listener);
        const sound = new THREE.Audio(listener);
        this.sound = sound;
    }
    // 加载音效
    loadAudio(url) {
        const loader = new THREE.AudioLoader();
        return new Promise((resolve) => {
            loader.load(url, (buffer) => {
                this.sound.setBuffer(buffer);
                resolve(buffer);
            });
        });
    }
    // 加载模型
    loadModel(url) {
        const loader = new GLTFLoader();
        return new Promise((resolve, reject) => {
            loader.load(url, (gltf) => {
                const model = gltf.scene;
                console.log(model);
                resolve(model);
            }, undefined, (err) => {
                console.log(err);
                reject();
            });
        });
    }
    // 加载FBX模型
    loadFBXModel(url) {
        const loader = new FBXLoader();
        return new Promise((resolve, reject) => {
            loader.load(url, (obj) => {
                resolve(obj);
            }, undefined, (err) => {
                console.log(err);
                reject();
            });
        });
    }
    // 加载字体
    loadFont(url) {
        const loader = new THREE.FontLoader();
        return new Promise((resolve) => {
            loader.load(url, (font) => {
                resolve(font);
            });
        });
    }
    // 创建点选模型
    createRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.trackMousePos();
    }
    // 追踪鼠标位置
    trackMousePos() {
        window.addEventListener("mousemove", (e) => {
            this.setMousePos(e);
        });
        window.addEventListener("touchstart", (e) => {
            this.setMousePos(e.touches[0]);
        }, { passive: false });
        window.addEventListener("touchmove", (e) => {
            this.setMousePos(e.touches[0]);
        });
    }
    // 设置鼠标位置
    setMousePos(e) {
        const { x, y } = getNormalizedMousePos(e);
        this.mousePos.x = x;
        this.mousePos.y = y;
    }
    // 获取点击物
    getInterSects(container = this.scene) {
        this.raycaster.setFromCamera(this.mousePos, this.camera);
        const intersects = this.raycaster.intersectObjects(container.children, true);
        return intersects;
    }
    // 选中点击物时
    onChooseIntersect(target, container = this.scene) {
        const intersects = this.getInterSects(container);
        const intersect = intersects[0];
        if (!intersect || !intersect.face) {
            return null;
        }
        const { object } = intersect;
        return target === object ? intersect : null;
    }
    // 获取跟屏幕同像素的fov角度
    getScreenFov() {
        return ky.rad2deg(2 * Math.atan(window.innerHeight / 2 / this.cameraPosition.z));
    }
    // 获取重心坐标系
    getBaryCoord(bufferGeometry) {
        // https://gist.github.com/mattdesl/e399418558b2b52b58f5edeafea3c16c
        const length = bufferGeometry.attributes.position.array.length;
        const count = length / 3;
        const bary = [];
        for (let i = 0; i < count; i++) {
            bary.push(0, 0, 1, 0, 1, 0, 1, 0, 0);
        }
        const aCenter = new Float32Array(bary);
        bufferGeometry.setAttribute("aCenter", new THREE.BufferAttribute(aCenter, 3));
    }
    // 追踪鼠标速度
    trackMouseSpeed() {
        // https://stackoverflow.com/questions/6417036/track-mouse-speed-with-js
        let lastMouseX = -1;
        let lastMouseY = -1;
        let mouseSpeed = 0;
        window.addEventListener("mousemove", (e) => {
            const mousex = e.pageX;
            const mousey = e.pageY;
            if (lastMouseX > -1) {
                mouseSpeed = Math.max(Math.abs(mousex - lastMouseX), Math.abs(mousey - lastMouseY));
                this.mouseSpeed = mouseSpeed / 100;
            }
            lastMouseX = mousex;
            lastMouseY = mousey;
        });
        document.addEventListener("mouseleave", () => {
            this.mouseSpeed = 0;
        });
    }
    // 使用PCFSoft阴影
    usePCFSoftShadowMap() {
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    // 使用VSM阴影
    useVSMShadowMap() {
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
    }
    // 将相机的方向设为z轴
    setCameraUpZ() {
        this.camera.up.set(0, 0, 1);
    }
    // 获取viewport
    getViewport() {
        const { camera } = this;
        const position = new THREE.Vector3();
        const target = new THREE.Vector3();
        const distance = camera.getWorldPosition(position).distanceTo(target);
        const fov = (camera.fov * Math.PI) / 180; // convert vertical fov to radians
        const h = 2 * Math.tan(fov / 2) * distance; // visible height
        const w = h * (window.innerWidth / window.innerHeight);
        const viewport = { width: w, height: h };
        this.viewport = viewport;
    }
    // 加载HDR
    loadHDR(url) {
        const loader = new RGBELoader();
        return new Promise((resolve, reject) => {
            loader.load(url, (texture) => {
                const generator = new THREE.PMREMGenerator(this.renderer);
                const envmap = generator.fromEquirectangular(texture).texture;
                texture.dispose();
                generator.dispose();
                resolve(envmap);
            }, undefined, (err) => {
                console.log(err);
                reject();
            });
        });
    }
    // 从mesh上取样微粒位置信息
    sampleParticlesPositionFromMesh(geometry, count = 10000) {
        const material = new THREE.MeshBasicMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        const sampler = new MeshSurfaceSampler(mesh).build();
        const particlesPosition = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const position = new THREE.Vector3();
            sampler.sample(position);
            particlesPosition.set(point2Array(position), i * 3);
        }
        return particlesPosition;
    }
}
class TwistedGallery extends Base {
    constructor(sel, debug) {
        super(sel, debug);
        this.clock = new THREE.Clock();
        this.cameraPosition = new THREE.Vector3(0, 0, 600);
        const fov = getScreenFov(this.cameraPosition.z);
        this.perspectiveCameraParams = {
            fov,
            near: 100,
            far: 2000
        };
        this.images = [...document.querySelectorAll("img")];
        this.makuGroup = new MakuGroup();
        this.scrollSpeed = 0;
    }
    // 初始化
    async init() {
        this.createScene();
        this.createPerspectiveCamera();
        this.createRenderer();
        await preloadImages();
        this.createEverything();
        this.listenScroll();
        this.createLight();
        this.createRaycaster();
        this.createOrbitControls();
        this.addListeners();
        this.setLoop();
    }
    // 创建一切
    createEverything() {
        this.createDistortImageMaterial();
        this.createMakus();
        this.setImagesPosition();
        this.createMainEffect();
        this.createPostprocessingEffect();
    }
    // 创建材质
    createDistortImageMaterial() {
        const distortImageMaterial = new THREE.ShaderMaterial({
            vertexShader: twistedGalleryMainVertexShader,
            fragmentShader: twistedGalleryMainFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: {
                    value: 0
                },
                uResolution: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                },
                uTexture: {
                    value: 0
                },
                uHoverUv: {
                    value: new THREE.Vector2(0.5, 0.5)
                },
                uHoverState: {
                    value: 0
                }
            }
        });
        this.distortImageMaterial = distortImageMaterial;
    }
    // 创建图片DOM物体
    createMakus() {
        this.makuGroup.clear();
        const { images, scene, distortImageMaterial } = this;
        const makus = images.map((image) => new Maku(image, distortImageMaterial, scene));
        this.makuGroup.addMultiple(makus);
    }
    // 设置图片位置
    setImagesPosition() {
        this.makuGroup.setPositions();
    }
    // 监听滚动
    listenScroll() {
        const scroll = new LocomotiveScroll({
            getSpeed: true
        });
        scroll.on("scroll", () => {
            this.setImagesPosition();
        });
        this.scroll = scroll;
    }
    // 创建主要特效
    createMainEffect() {
        this.makuGroup.makus.forEach((obj) => {
            const { el, mesh } = obj;
            const material = mesh.material;
            el.addEventListener("mouseenter", () => {
                gsap.to(material.uniforms.uHoverState, {
                    value: 1,
                    duration: 1
                });
            });
            el.addEventListener("mouseleave", () => {
                gsap.to(material.uniforms.uHoverState, {
                    value: 0,
                    duration: 1
                });
            });
        });
        window.addEventListener("mousemove", () => {
            const intersect = this.getInterSects()[0];
            if (intersect) {
                const obj = intersect.object;
                if (obj.material.uniforms) {
                    obj.material.uniforms.uHoverUv.value = intersect.uv;
                }
            }
        });
    }
    // 创建后期处理特效
    createPostprocessingEffect() {
        const composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        composer.addPass(renderPass);
        const customPass = new ShaderPass({
            vertexShader: twistedGalleryPostprocessingVertexShader,
            fragmentShader: twistedGalleryPostprocessingFragmentShader,
            uniforms: {
                tDiffuse: {
                    value: null
                },
                uRadius: {
                    value: 0.75
                },
                uPower: {
                    value: 0
                }
            }
        });
        customPass.renderToScreen = true;
        composer.addPass(customPass);
        this.composer = composer;
        this.customPass = customPass;
    }
    // 设置滚动速度
    setScrollSpeed() {
        const scrollSpeed = this.scroll.scroll.instance.speed || 0;
        gsap.to(this, {
            scrollSpeed: Math.min(Math.abs(scrollSpeed) * 1.25, 2),
            duration: 1
        });
    }
    // 动画
    update() {
        const elapsedTime = this.clock.getElapsedTime();
        if (!ky.isEmpty(this.makuGroup.makus)) {
            this.makuGroup.makus.forEach((maku) => {
                const material = maku.mesh.material;
                material.uniforms.uTime.value = elapsedTime;
            });
        }
        if (this.customPass) {
            this.setScrollSpeed();
            this.customPass.uniforms.uPower.value = this.scrollSpeed;
        }
    }
}
const start = () => {
    const twistedGallery = new TwistedGallery(".twisted-gallery", false);
    twistedGallery.init();
};

setTimeout(() => {
  start();
}, 500)

