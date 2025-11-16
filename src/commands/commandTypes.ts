// src/commands/commandTypes.ts

/**
 * Defines the types of commands that can be recognized and executed.
 */
export enum CommandType {
    MoveCursor = "MOVE_CURSOR",
    Click = "CLICK",
    Open = "OPEN",
    Type = "TYPE",
    Scroll = "SCROLL",
    Unknown = "UNKNOWN", // For unrecognized commands
}

/**
 * Base interface for all commands.
 */
export interface Command {
    type: CommandType;
    originalText: string; // The original voice input
}

/**
 * Arguments for the MoveCursor command.
 */
export interface MoveCursorCommandArgs {
    direction: "up" | "down" | "left" | "right";
    distance?: number; // Optional distance, e.g., "move cursor up 100 pixels"
}

/**
 * Command interface for MoveCursor.
 */
export interface MoveCursorCommand extends Command {
    type: CommandType.MoveCursor;
    args: MoveCursorCommandArgs;
}

/**
 * Arguments for the Click command.
 */
export interface ClickCommandArgs {
    button?: "left" | "right"; // Optional button, defaults to left
}

/**
 * Command interface for Click.
 */
export interface ClickCommand extends Command {
    type: CommandType.Click;
    args?: ClickCommandArgs; // Args are optional for Click (defaults to left click)
}

/**
 * Arguments for the Open command.
 */
export interface OpenCommandArgs {
    appName: string; // The name of the application to open
}

/**
 * Command interface for Open.
 */
export interface OpenCommand extends Command {
    type: CommandType.Open;
    args: OpenCommandArgs;
}

/**
 * Arguments for the Type command.
 */
export interface TypeCommandArgs {
    text: string; // The text to type
}

/**
 * Command interface for Type.
 */
export interface TypeCommand extends Command {
    type: CommandType.Type;
    args: TypeCommandArgs;
}

/**
 * Arguments for the Scroll command.
 */
export interface ScrollCommandArgs {
    direction: "up" | "down";
    distance?: number; // Optional distance, e.g., "scroll down 50"
}

/**
 * Command interface for Scroll.
 */
export interface ScrollCommand extends Command {
    type: CommandType.Scroll;
    args: ScrollCommandArgs;
}

/**
 * Command interface for an unrecognized command.
 */
export interface UnknownCommand extends Command {
    type: CommandType.Unknown;
    args?: any; // No specific args for unknown commands
}