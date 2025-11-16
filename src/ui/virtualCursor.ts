export class VirtualCursor {
    private element: HTMLElement;
    private x: number = 0;
    private y: number = 0;

    constructor(container: HTMLElement) {
        this.element = document.createElement('div');
        this.element.classList.add('virtual-cursor');
        container.appendChild(this.element);
        this.setPosition(window.innerWidth / 2, window.innerHeight / 2);
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    public move(dx: number, dy: number): void {
        this.setPosition(this.x + dx, this.y + dy);
    }

    public getHoveredElement(): Element | null {
        // Temporarily hide the cursor to prevent it from being the elementFromPoint
        this.element.classList.add('hidden');
        const hoveredElement = document.elementFromPoint(this.x, this.y);
        this.element.classList.remove('hidden');
        return hoveredElement;
    }
}