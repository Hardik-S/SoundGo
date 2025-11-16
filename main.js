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

  // src/commands/commandParser.ts
  function parseCommand(transcript) {
    const lowerTranscript = transcript.toLowerCase().trim();
    const moveCursorMatch = lowerTranscript.match(/^(move|go) (cursor)? (up|down|left|right)( by (\d+) (pixels)?)?$/);
    if (moveCursorMatch) {
      const direction = moveCursorMatch[3];
      const distance = moveCursorMatch[5] ? parseInt(moveCursorMatch[5], 10) : void 0;
      return {
        type: "MOVE_CURSOR" /* MoveCursor */,
        originalText: transcript,
        args: { direction, distance }
      };
    }
    const clickMatch = lowerTranscript.match(/^(click|left click|right click)$/);
    if (clickMatch) {
      let button = "left";
      if (clickMatch[1] === "right click") {
        button = "right";
      }
      return {
        type: "CLICK" /* Click */,
        originalText: transcript,
        args: { button }
      };
    }
    const openMatch = lowerTranscript.match(/^open (.+)$/);
    if (openMatch) {
      const appName = openMatch[1].trim();
      return {
        type: "OPEN" /* Open */,
        originalText: transcript,
        args: { appName }
      };
    }
    const typeMatch = lowerTranscript.match(/^type (.+)$/);
    if (typeMatch) {
      const text = typeMatch[1].trim();
      return {
        type: "TYPE" /* Type */,
        originalText: transcript,
        args: { text }
      };
    }
    const scrollMatch = lowerTranscript.match(/^scroll (up|down)( by (\d+))?$/);
    if (scrollMatch) {
      const direction = scrollMatch[1];
      const distance = scrollMatch[3] ? parseInt(scrollMatch[3], 10) : void 0;
      return {
        type: "SCROLL" /* Scroll */,
        originalText: transcript,
        args: { direction, distance }
      };
    }
    return {
      type: "UNKNOWN" /* Unknown */,
      originalText: transcript
    };
  }

  // src/commands/commandExecutor.ts
  var cursor;
  var shell;
  function initializeCommandExecutor(cursorInstance, shellInstance) {
    cursor = cursorInstance;
    shell = shellInstance;
  }
  function executeCommand(command) {
    console.log("Executing command:", command);
    switch (command.type) {
      case "MOVE_CURSOR" /* MoveCursor */:
        const moveCommand = command;
        const distance = moveCommand.args.distance || 50;
        let dx = 0;
        let dy = 0;
        switch (moveCommand.args.direction) {
          case "up":
            dy = -distance;
            break;
          case "down":
            dy = distance;
            break;
          case "left":
            dx = -distance;
            break;
          case "right":
            dx = distance;
            break;
        }
        cursor.move(dx, dy);
        break;
      case "CLICK" /* Click */:
        const clickCommand = command;
        const hoveredElement = cursor.getHoveredElement();
        if (hoveredElement) {
          console.log(`Clicking on:`, hoveredElement);
          hoveredElement.click();
        } else {
          console.warn("No element to click.");
        }
        break;
      case "OPEN" /* Open */:
        const openCommand = command;
        shell.openApp(openCommand.args.appName);
        break;
      case "TYPE" /* Type */:
        const typeCommand = command;
        console.log(`Typing text: "${typeCommand.args.text}".`);
        break;
      case "SCROLL" /* Scroll */:
        const scrollCommand = command;
        console.log(`Scrolling ${scrollCommand.args.direction} by ${scrollCommand.args.distance || "default"} units.`);
        break;
      case "UNKNOWN" /* Unknown */:
        const unknownCommand = command;
        console.warn(`Unknown command: "${unknownCommand.originalText}".`);
        break;
      default:
        console.error("Unhandled command type:", command.type);
        break;
    }
  }

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
        const commandText = event.results[last][0].transcript;
        console.log("Voice Command:", commandText);
        transcriptPanel.log(`You said: "${commandText}"`);
        const command = parseCommand(commandText);
        executeCommand(command);
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

  // src/ui/win95Shell.ts
  var Win95Shell = class {
    constructor(container) {
      this.container = container;
    }
    openApp(appName) {
      console.log(`Opening app: ${appName}`);
      const windowElement = this.createWindow(appName);
      this.container.appendChild(windowElement);
    }
    createWindow(title) {
      const windowElement = document.createElement("div");
      windowElement.classList.add("window");
      windowElement.style.position = "absolute";
      windowElement.style.left = `${Math.random() * 200 + 50}px`;
      windowElement.style.top = `${Math.random() * 200 + 50}px`;
      windowElement.style.width = "300px";
      windowElement.style.height = "200px";
      windowElement.style.border = "2px solid #000";
      windowElement.style.backgroundColor = "#c0c0c0";
      windowElement.style.boxShadow = "5px 5px 0px rgba(0,0,0,0.5)";
      const titleBar = document.createElement("div");
      titleBar.classList.add("title-bar");
      titleBar.style.backgroundColor = "#000080";
      titleBar.style.color = "#fff";
      titleBar.style.padding = "3px";
      titleBar.style.fontWeight = "bold";
      titleBar.textContent = title;
      const closeButton = document.createElement("button");
      closeButton.textContent = "X";
      closeButton.style.float = "right";
      closeButton.style.border = "1px solid #fff";
      closeButton.style.backgroundColor = "#c0c0c0";
      closeButton.style.color = "#000";
      closeButton.onclick = () => {
        windowElement.remove();
      };
      titleBar.appendChild(closeButton);
      windowElement.appendChild(titleBar);
      return windowElement;
    }
  };

  // src/main.ts
  document.addEventListener("DOMContentLoaded", () => {
    const shellContainer = document.querySelector(".win95-shell");
    if (shellContainer) {
      const cursor2 = new VirtualCursor(shellContainer);
      const shell2 = new Win95Shell(shellContainer);
      initializeCommandExecutor(cursor2, shell2);
      console.log("Virtual cursor and shell initialized.");
      const STEP_SIZE = 10;
      let currentHoveredElement = null;
      const updateHoveredElement = () => {
        const newHoveredElement = cursor2.getHoveredElement();
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
        cursor2.move(dx, dy);
        updateHoveredElement();
        event.preventDefault();
      });
      updateHoveredElement();
      voiceListener.startListening();
    } else {
      console.error("Could not find the .win95-shell container.");
    }
    console.log("SoundGO is running!");
  });
})();
