// src/voice/wakeWordListener.ts

import { EventEmitter } from '../core/events';

export class WakeWordListener {
    private recognition?: SpeechRecognition;
    private wakeWord: string;
    public onWakeWord = new EventEmitter<void>();

    constructor(wakeWord: string) {
        this.wakeWord = wakeWord.toLowerCase();
        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech recognition not supported in this browser.");
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            const last = event.results.length - 1;
            const transcript = event.results[last][0].transcript.toLowerCase().trim();

            console.log('Heard:', transcript); // For debugging

            if (transcript.includes(this.wakeWord)) {
                console.log('Wake word detected!');
                this.onWakeWord.emit();
            }
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
        };

        this.recognition.onend = () => {
            // The recognition service has disconnected.
            // Restart it to keep listening.
            this.start();
        };
    }

    public start() {
        if (this.recognition) {
            console.log('Starting wake word listener...');
            this.recognition.start();
        }
    }

    public stop() {
        if (this.recognition) {
            console.log('Stopping wake word listener...');
            this.recognition.stop();
        }
    }
}
