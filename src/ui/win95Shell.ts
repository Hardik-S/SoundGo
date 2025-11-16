// src/ui/win95Shell.ts

export class Win95Shell {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    public openApp(appName: string): void {
        console.log(`Opening app: ${appName}`);
        const windowElement = this.createWindow(appName);
        this.container.appendChild(windowElement);
    }

    private createWindow(title: string): HTMLElement {
        const windowElement = document.createElement('div');
        windowElement.classList.add('window');
        windowElement.style.position = 'absolute';
        windowElement.style.left = `${Math.random() * 200 + 50}px`;
        windowElement.style.top = `${Math.random() * 200 + 50}px`;
        windowElement.style.width = '300px';
        windowElement.style.height = '200px';
        windowElement.style.border = '2px solid #000';
        windowElement.style.backgroundColor = '#c0c0c0';
        windowElement.style.boxShadow = '5px 5px 0px rgba(0,0,0,0.5)';

        const titleBar = document.createElement('div');
        titleBar.classList.add('title-bar');
        titleBar.style.backgroundColor = '#000080';
        titleBar.style.color = '#fff';
        titleBar.style.padding = '3px';
        titleBar.style.fontWeight = 'bold';
        titleBar.textContent = title;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.float = 'right';
        closeButton.style.border = '1px solid #fff';
        closeButton.style.backgroundColor = '#c0c0c0';
        closeButton.style.color = '#000';
        closeButton.onclick = () => {
            windowElement.remove();
        };

        titleBar.appendChild(closeButton);
        windowElement.appendChild(titleBar);

        return windowElement;
    }
}