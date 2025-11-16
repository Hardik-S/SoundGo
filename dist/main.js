"use strict";
(() => {
  // src/ui/virtualCursor.ts
  var VirtualCursor = class {
    constructor(container) {
      this.x = 0;
      this.y = 0;
      this.element = document.createElement("div");
      this.element.classList.add("virtual-cursor");
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
      this.element.classList.add("hidden");
      const hoveredElement = document.elementFromPoint(this.x, this.y);
      this.element.classList.remove("hidden");
      return hoveredElement;
    }
  };

  // src/ui/transcriptPanel.ts
  var TranscriptPanel = class {
    constructor() {
      const element = document.querySelector(".transcript-panel");
      if (!element) {
        throw new Error("Transcript panel element not found.");
      }
      this.transcriptElement = element;
      this.transcriptElement.innerHTML = "<h3>Transcript</h3>";
    }
    log(text) {
      const p = document.createElement("p");
      p.textContent = text;
      this.transcriptElement.appendChild(p);
      this.transcriptElement.scrollTop = this.transcriptElement.scrollHeight;
    }
  };
  var transcriptPanel = new TranscriptPanel();

  // src/voice/voiceListener.ts
  var VoiceListener = class {
    constructor() {
      this._isListening = false;
      if (!("webkitSpeechRecognition" in window)) {
        console.warn("Web Speech API is not available in this browser.");
        return;
      }
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = "en-US";
      this.recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript;
        console.log("Voice Command:", command);
        transcriptPanel.log(`You said: "${command}"`);
      };
      this.recognition.onend = () => {
        this._isListening = false;
        console.log("Voice recognition ended. Ready to listen again.");
      };
      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        transcriptPanel.log(`Error: ${event.error}`);
        this._isListening = false;
      };
    }
    get isListening() {
      return this._isListening;
    }
    startListening() {
      if (this.recognition && !this.isListening) {
        this.recognition.start();
        this._isListening = true;
        console.log("Listening for a command...");
        transcriptPanel.log("Listening...");
      }
    }
    stopListening() {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
        this._isListening = false;
        console.log("Stopped listening.");
      }
    }
  };
  var voiceListener = new VoiceListener();

  // src/main.ts
  document.addEventListener("DOMContentLoaded", () => {
    const shellContainer = document.querySelector(".win95-shell");
    if (shellContainer) {
      const cursor = new VirtualCursor(shellContainer);
      console.log("Virtual cursor initialized.");
      const STEP_SIZE = 10;
      let currentHoveredElement = null;
      const updateHoveredElement = () => {
        const newHoveredElement = cursor.getHoveredElement();
        if (newHoveredElement !== currentHoveredElement) {
          if (currentHoveredElement) {
          }
          if (newHoveredElement) {
            console.log("Hovering over:", newHoveredElement);
          }
          currentHoveredElement = newHoveredElement;
        }
      };
      document.addEventListener("keydown", (event) => {
        let dx = 0;
        let dy = 0;
        switch (event.key) {
          case "ArrowUp":
            dy = -STEP_SIZE;
            break;
          case "ArrowDown":
            dy = STEP_SIZE;
            break;
          case "ArrowLeft":
            dx = -STEP_SIZE;
            break;
          case "ArrowRight":
            dx = STEP_SIZE;
            break;
          case " ":
            if (voiceListener.isListening) {
              voiceListener.stopListening();
            } else {
              voiceListener.startListening();
            }
            event.preventDefault();
            return;
          default:
            return;
        }
        cursor.move(dx, dy);
        updateHoveredElement();
        event.preventDefault();
      });
      updateHoveredElement();
    } else {
      console.error("Could not find the .win95-shell container.");
    }
    console.log("SoundGO is running!");
  });
})();
