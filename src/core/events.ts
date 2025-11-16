type Listener<T> = (event: T) => void;

export class EventEmitter<T> {
    private listeners: Listener<T>[] = [];

    addListener(listener: Listener<T>) {
        this.listeners.push(listener);
    }

    removeListener(listener: Listener<T>) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    emit(event: T) {
        this.listeners.forEach(listener => listener(event));
    }
}