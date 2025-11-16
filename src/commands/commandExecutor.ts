// src/commands/commandExecutor.ts

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
                console.warn("No element to click.");
            }
            break;
        case CommandType.Open:
            const openCommand = command as OpenCommand;
            shell.openApp(openCommand.args.appName);
            break;
        case CommandType.Type:
            const typeCommand = command as TypeCommand;
            console.log(`Typing text: "${typeCommand.args.text}".`);
            // TODO: Implement actual typing
            break;
        case CommandType.Scroll:
            const scrollCommand = command as ScrollCommand;
            console.log(`Scrolling ${scrollCommand.args.direction} by ${scrollCommand.args.distance || 'default'} units.`);
            // TODO: Implement actual scrolling
            break;
        case CommandType.Unknown:
            const unknownCommand = command as UnknownCommand;
            console.warn(`Unknown command: "${unknownCommand.originalText}".`);
            break;
        default:
            console.error("Unhandled command type:", command.type);
            break;
    }
}
