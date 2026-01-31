export class EventEmitter<T extends Record<string, (...args: any[]) => void>> {
  private listeners: Partial<{ [K in keyof T]: T[K][] }> = {}

  on<K extends keyof T>(event: K, listener: T[K]): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]!.push(listener)
  }

  off<K extends keyof T>(event: K, listener: T[K]): void {
    const eventListeners = this.listeners[event]
    if (eventListeners) {
      const index = eventListeners.indexOf(listener)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const eventListeners = this.listeners[event]
    if (eventListeners) {
      eventListeners.forEach(listener => listener(...args))
    }
  }

  removeAllListeners<K extends keyof T>(event?: K): void {
    if (event) {
      delete this.listeners[event]
    } else {
      this.listeners = {}
    }
  }
}