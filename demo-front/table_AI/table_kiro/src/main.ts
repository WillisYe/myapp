import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 注册Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}

// 防止移动端双击缩放
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault()
  }
})

let lastTouchEnd = 0
document.addEventListener('touchend', (e) => {
  const now = Date.now()
  if (now - lastTouchEnd <= 300) {
    e.preventDefault()
  }
  lastTouchEnd = now
}, false)

createApp(App).mount('#app')