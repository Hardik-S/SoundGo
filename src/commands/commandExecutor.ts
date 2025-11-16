// src/commands/commandExecutor.ts

import { transcriptPanel } from "../ui/transcriptPanel";
import {
    Command,
    CommandType,
    MoveCursorCommand,
    ClickCommand,
    OpenCommand,
    TypeCommand,
    ScrollCommand,
    UnknownCommand,
} from "./commandTypes";
import { VirtualCursor } from "../ui/virtualCursor";
import { Win95Shell } from "../ui/win95Shell";

let cursor: VirtualCursor;
let shell: Win95Shell;

export function initializeCommandExecutor(
    cursorInstance: VirtualCursor,
    shellInstance: Win95Shell
) {
    cursor = cursorInstance;
    shell = shellInstance;
}

/**
 * Executes a given command.
 * @param command The command object to execute.
 */
export function executeCommand(command: Command): void {
    console.log("Executing command:", command);

    switch (command.type) {
        case CommandType.MoveCursor:
            const moveCommand = command as MoveCursorCommand;
            const distance = moveCommand.args.distance || 50; // Default distance
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
        case CommandType.Click:
            const clickCommand = command as ClickCommand;
            const hoveredElement = cursor.getHoveredElement();
            if (hoveredElement) {
                console.log(`Clicking on:`, hoveredElement);
                (hoveredElement as HTMLElement).click();
            } else {
                transcriptPanel.logError("Cannot click: No element is under the cursor.");
            }
            break;
        case CommandType.Open:
            const openCommand = command as OpenCommand;
            shell.openApp(openCommand.args.appName);
            break;
        case CommandType.Type:
            const typeCommand = command as TypeCommand;
            transcriptPanel.logError(`Command not implemented: "Type"`);
            // TODO: Implement actual typing
            break;
        case CommandType.Scroll:
            const scrollCommand = command as ScrollCommand;
            transcriptPanel.logError(`Command not implemented: "Scroll"`);
            // TODO: Implement actual scrolling
            break;
        case CommandType.Unknown:
            const unknownCommand = command as UnknownCommand;
            transcriptPanel.logError(`Unknown command: "${unknownCommand.originalText}"`);
            break;
        default:
            transcriptPanel.logError(`Unhandled command type: "${command.type}"`);
            break;
    }
}
