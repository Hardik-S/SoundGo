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

/**
 * Executes a given command.
 * @param command The command object to execute.
 */
export function executeCommand(command: Command): void {
    console.log("Executing command:", command);

    switch (command.type) {
        case CommandType.MoveCursor:
            const moveCommand = command as MoveCursorCommand;
            console.log(`Moving cursor ${moveCommand.args.direction} by ${moveCommand.args.distance || 'default'} pixels.`);
            // TODO: Implement actual cursor movement
            break;
        case CommandType.Click:
            const clickCommand = command as ClickCommand;
            console.log(`Performing a ${clickCommand.args?.button || 'left'} click.`);
            // TODO: Implement actual click
            break;
        case CommandType.Open:
            const openCommand = command as OpenCommand;
            console.log(`Opening application: ${openCommand.args.appName}.`);
            // TODO: Implement actual application opening
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