class TranscriptPanel {
    private transcriptElement: HTMLElement;

    constructor() {
        const element = document.querySelector('.transcript-panel');
        if (!element) {
            throw new Error('Transcript panel element not found.');
        }
        this.transcriptElement = element as HTMLElement;
        this.transcriptElement.innerHTML = '<h3>Transcript</h3>'; // Initial header
    }

    log(text: string) {
        const p = document.createElement('p');
        p.textContent = text;
        this.transcriptElement.appendChild(p);
        this.transcriptElement.scrollTop = this.transcriptElement.scrollHeight; // Auto-scroll to bottom
    }

    logError(text: string) {
        const p = document.createElement('p');
        p.textContent = text;
        p.classList.add('error');
        this.transcriptElement.appendChild(p);
        this.transcriptElement.scrollTop = this.transcriptElement.scrollHeight; // Auto-scroll to bottom
    }
}

export const transcriptPanel = new TranscriptPanel();