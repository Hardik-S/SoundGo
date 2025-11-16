# GEMINI.md

## Project Overview

This project, "SoundGO," is a web-based application that emulates a Windows 95-style desktop environment. The primary goal is to allow a user to control a virtual mouse and keyboard within the web page entirely through voice commands. The application is built with vanilla TypeScript and uses `esbuild` for bundling. It is designed to be a static website hosted on GitHub Pages.

The architecture is modular, consisting of:
- **UI Layer:** Manages the Win95 shell, virtual cursor, and a transcript panel.
- **Voice Layer:** Handles wake word detection ("Hey Go") and command recognition.
- **Command Layer:** Parses and executes voice commands.
- **Core:** Contains shared state, events, and configuration.

## Building and Running

### Building the Project

To build the project, run the following command:

```bash
npm run build
```

This will bundle the TypeScript files from `src/` into `dist/main.js`.

### Running the Project

There is no specific run command. After building the project, open the `index.html` file in a modern web browser that supports the Web Speech API (e.g., Chrome, Edge).

```bash
# (After building)
# Open index.html in your browser
```

**TODO:** It would be beneficial to add a development server to the `package.json` scripts for a better development experience.

## Development Conventions

The project follows the conventions outlined in the `MASTERPLAN.md` file.

*   **Code Style:** Use TypeScript where possible. Prefer small, composable functions.
*   **Naming Conventions:**
    *   Modules: `camelCase` or `PascalCase`.
    *   Command types: `UPPER_SNAKE_CASE`.
*   **Comments:** Public functions should have a brief description, and document their inputs and side effects.
*   **Source of Truth:** The `MASTERPLAN.md` file is the primary source of truth for the project's design and architecture.
