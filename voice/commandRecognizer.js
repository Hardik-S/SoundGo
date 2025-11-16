// src/voice/commandRecognizer.ts
import { EventEmitter } from '../core/events';
export class CommandRecognizer {
    constructor() {
        this.onCommandRecognized = new EventEmitter();
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech recognition not supported in this browser.");
            return;
        }
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false; // Listen for a single command
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.trim();
            console.log('Command recognized:', command);
            this.onCommandRecognized.emit(command);
        };
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
        this.recognition.onend = () => {
            console.log('Command recognition ended.');
            // This will be stopped explicitly after a command or timeout,
            // or restarted by the wake word listener if no command was given.
        };
    }
    start() {
        if (this.recognition) {
            console.log('Starting command recognition...');
            this.recognition.start();
        }
    }
    stop() {
        if (this.recognition) {
            console.log('Stopping command recognition...');
            this.recognition.stop();
        }
    }
}
