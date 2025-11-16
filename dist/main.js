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
    } else {
      console.error("Could not find the .win95-shell container.");
    }
    console.log("SoundGO is running!");
  });
})();
