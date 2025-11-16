export class VirtualCursor {
    constructor(container) {
        this.x = 0;
        this.y = 0;
        this.element = document.createElement('div');
        this.element.classList.add('virtual-cursor');
        container.appendChild(this.element);
        this.setPosition(window.innerWidth / 2, window.innerHeight / 2);
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
    move(dx, dy) {
        this.setPosition(this.x + dx, this.y + dy);
    }
    getHoveredElement() {
        // Temporarily hide the cursor to prevent it from being the elementFromPoint
        this.element.classList.add('hidden');
        const hoveredElement = document.elementFromPoint(this.x, this.y);
        this.element.classList.remove('hidden');
        return hoveredElement;
    }
}
