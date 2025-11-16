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
    console.log("Parsing transcript:", transcript);
    const lowerTranscript = transcript.toLowerCase().trim();
    console.log("Normalized transcript:", lowerTranscript);

    // --- Move Cursor Command ---
    const moveCursorRegex = /^(move|go) (cursor)? ?(up|down|left|right)( by (\d+)( pixels)?)?$/;
    const moveCursorMatch = lowerTranscript.match(moveCursorRegex);
    console.log("Move cursor match:", moveCursorMatch);
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
    const clickRegex = /^(click|left click|right click)$/;
    const clickMatch = lowerTranscript.match(clickRegex);
    console.log("Click match:", clickMatch);
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
    const openRegex = /^open (.+)$/;
    const openMatch = lowerTranscript.match(openRegex);
    console.log("Open match:", openMatch);
    if (openMatch) {
        const appName = openMatch[1].trim();
        return {
            type: CommandType.Open,
            originalText: transcript,
            args: { appName },
        } as OpenCommand;
    }

    // --- Type Command ---
    const typeRegex = /^type (.+)$/;
    const typeMatch = lowerTranscript.match(typeRegex);
    console.log("Type match:", typeMatch);
    if (typeMatch) {
        const text = typeMatch[1].trim();
        return {
            type: CommandType.Type,
            originalText: transcript,
            args: { text },
        } as TypeCommand;
    }

    // --- Scroll Command ---
    const scrollRegex = /^scroll (up|down)( by (\d+))?$/;
    const scrollMatch = lowerTranscript.match(scrollRegex);
    console.log("Scroll match:", scrollMatch);
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
    console.log("No command matched. Returning UnknownCommand.");
    return {
        type: CommandType.Unknown,
        originalText: transcript,
    } as UnknownCommand;
}