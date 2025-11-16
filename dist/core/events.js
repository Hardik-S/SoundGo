export class EventEmitter {
    constructor() {
        this.listeners = [];
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
    removeListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }
    emit(event) {
        this.listeners.forEach(listener => listener(event));
    }
}
