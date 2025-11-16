import { transcriptPanel } from '../ui/transcriptPanel';
import { parseCommand } from '../commands/commandParser';
import { executeCommand } from '../commands/commandExecutor';

class VoiceListener {
    private recognition: any;
    get isListening(): boolean {
        return this._isListening;
    }

    private _isListening: boolean = false;

    constructor() {
        if (!('webkitSpeechRecognition' in window)) {
            console.warn("Web Speech API is not available in this browser.");
            // Fallback or disable voice features
            return;
        }

        this.recognition = new window.webkitSpeechRecognition();
        this.recognition.continuous = false; // Listen for a single command
        this.recognition.interimResults = false; // Only return final results
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
            const last = event.results.length - 1;
            const commandText = event.results[last][0].transcript;
            console.log('Voice Command:', commandText);
            transcriptPanel.log(`You said: "${commandText}"`);

            const command = parseCommand(commandText);
            executeCommand(command);
        };

        this.recognition.onend = () => {
            this._isListening = false;
            console.log('Voice recognition ended. Ready to listen again.');
            // Optionally restart listening if continuous mode is desired
        };

        this.recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            transcriptPanel.logError(`Speech recognition error: ${event.error}`);
            this._isListening = false;
        };
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
            this._isListening = true;
            console.log('Listening for a command...');
            transcriptPanel.log('Listening...');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this._isListening = false;
            console.log('Stopped listening.');
        }
    }
}

export const voiceListener = new VoiceListener();