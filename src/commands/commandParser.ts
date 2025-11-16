// src/commands/commandParser.ts

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
 * Parses a raw voice transcript into a structured command object.
 * @param transcript The raw voice transcript.
 * @returns A Command object if recognized, otherwise an UnknownCommand.
 */
export function parseCommand(transcript: string): Command {
    const lowerTranscript = transcript.toLowerCase().trim();

    // --- Move Cursor Command ---
    const moveCursorMatch = lowerTranscript.match(/^(move|go) (cursor)? (up|down|left|right)( by (\d+) (pixels)?)?$/);
    if (moveCursorMatch) {
        const direction = moveCursorMatch[3] as "up" | "down" | "left" | "right";
        const distance = moveCursorMatch[5] ? parseInt(moveCursorMatch[5], 10) : undefined;
        return {
            type: CommandType.MoveCursor,
            originalText: transcript,
            args: { direction, distance },
        } as MoveCursorCommand;
    }

    // --- Click Command ---
    const clickMatch = lowerTranscript.match(/^(click|left click|right click)$/);
    if (clickMatch) {
        let button: "left" | "right" = "left";
        if (clickMatch[1] === "right click") {
            button = "right";
        }
        return {
            type: CommandType.Click,
            originalText: transcript,
            args: { button },
        } as ClickCommand;
    }

    // --- Open Command ---
    const openMatch = lowerTranscript.match(/^open (.+)$/);
    if (openMatch) {
        const appName = openMatch[1].trim();
        return {
            type: CommandType.Open,
            originalText: transcript,
            args: { appName },
        } as OpenCommand;
    }

    // --- Type Command ---
    const typeMatch = lowerTranscript.match(/^type (.+)$/);
    if (typeMatch) {
        const text = typeMatch[1].trim();
        return {
            type: CommandType.Type,
            originalText: transcript,
            args: { text },
        } as TypeCommand;
    }

    // --- Scroll Command ---
    const scrollMatch = lowerTranscript.match(/^scroll (up|down)( by (\d+))?$/);
    if (scrollMatch) {
        const direction = scrollMatch[1] as "up" | "down";
        const distance = scrollMatch[3] ? parseInt(scrollMatch[3], 10) : undefined;
        return {
            type: CommandType.Scroll,
            originalText: transcript,
            args: { direction, distance },
        } as ScrollCommand;
    }

    // --- Unknown Command ---
    return {
        type: CommandType.Unknown,
        originalText: transcript,
    } as UnknownCommand;
}