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
    getPosition() {
      return { x: this.x, y: this.y };
    }
  };

  // src/main.ts
  document.addEventListener("DOMContentLoaded", () => {
    const shellContainer = document.querySelector(".win95-shell");
    if (shellContainer) {
      const cursor = new VirtualCursor(shellContainer);
      console.log("Virtual cursor initialized.");
      const STEP_SIZE = 10;
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
          default:
            return;
        }
        cursor.move(dx, dy);
        event.preventDefault();
      });
    } else {
      console.error("Could not find the .win95-shell container.");
    }
    console.log("SoundGO is running!");
  });
})();
