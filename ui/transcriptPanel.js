class TranscriptPanel {
    constructor() {
        const element = document.querySelector('.transcript-panel');
        if (!element) {
            throw new Error('Transcript panel element not found.');
        }
        this.transcriptElement = element;
        this.transcriptElement.innerHTML = '<h3>Transcript</h3>'; // Initial header
    }
    log(text) {
        const p = document.createElement('p');
        p.textContent = text;
        this.transcriptElement.appendChild(p);
        this.transcriptElement.scrollTop = this.transcriptElement.scrollHeight; // Auto-scroll to bottom
    }
}
export const transcriptPanel = new TranscriptPanel();
