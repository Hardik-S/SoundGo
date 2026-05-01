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

function isEditableElement(element: Element | null): element is HTMLElement {
    if (!element || !(element instanceof HTMLElement)) {
        return false;
    }

    if (element.isContentEditable) {
        return true;
    }

    if (element instanceof HTMLTextAreaElement) {
        return !element.disabled && !element.readOnly;
    }

    if (element instanceof HTMLInputElement) {
        const textLikeTypes = new Set([
            "",
            "email",
            "number",
            "password",
            "search",
            "tel",
            "text",
            "url",
        ]);
        return textLikeTypes.has(element.type) && !element.disabled && !element.readOnly;
    }

    return false;
}

function findEditableTarget(hoveredElement: Element | null): HTMLElement | null {
    const activeElement = document.activeElement;
    if (isEditableElement(activeElement)) {
        return activeElement;
    }

    if (isEditableElement(hoveredElement)) {
        return hoveredElement;
    }

    const closestEditable = hoveredElement?.closest<HTMLElement>("input, textarea, [contenteditable]") ?? null;
    return isEditableElement(closestEditable) ? closestEditable : null;
}

function dispatchInputEvent(element: HTMLElement, text: string): void {
    const event = typeof InputEvent === "function"
        ? new InputEvent("input", {
            bubbles: true,
            cancelable: false,
            data: text,
            inputType: "insertText",
        })
        : new Event("input", { bubbles: true, cancelable: false });
    element.dispatchEvent(event);
}

function getContentEditableSelection(element: HTMLElement): Range | null {
    const selection = typeof window.getSelection === "function" ? window.getSelection() : null;
    if (!selection || selection.rangeCount === 0) {
        return null;
    }

    const range = selection.getRangeAt(0);
    const anchorNode = range.commonAncestorContainer;
    return element.contains(anchorNode) ? range : null;
}

function typeTextIntoElement(element: HTMLElement, text: string): void {
    element.focus();

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        const start = element.selectionStart ?? element.value.length;
        const end = element.selectionEnd ?? start;
        element.value = `${element.value.slice(0, start)}${text}${element.value.slice(end)}`;
        const nextCursorPosition = start + text.length;
        element.setSelectionRange(nextCursorPosition, nextCursorPosition);
        dispatchInputEvent(element, text);
        return;
    }

    const selectionRange = getContentEditableSelection(element);
    if (selectionRange) {
        selectionRange.deleteContents();
        const textNode = document.createTextNode(text);
        selectionRange.insertNode(textNode);
        selectionRange.setStartAfter(textNode);
        selectionRange.collapse(true);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(selectionRange);
        dispatchInputEvent(element, text);
        return;
    }

    const existingText = element.textContent ?? "";
    element.textContent = `${existingText}${text}`;
    dispatchInputEvent(element, text);
}

function findScrollableTarget(hoveredElement: Element | null): HTMLElement {
    let current = hoveredElement instanceof HTMLElement ? hoveredElement : hoveredElement?.parentElement ?? null;

    while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const canScrollY = /(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight;
        if (canScrollY) {
            return current;
        }
        current = current.parentElement;
    }

    return (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
}

function scrollElement(element: HTMLElement, distance: number): void {
    if (element === document.documentElement || element === document.body || element === document.scrollingElement) {
        window.scrollBy(0, distance);
        return;
    }

    element.scrollTop += distance;
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
            const editableTarget = findEditableTarget(cursor.getHoveredElement());
            if (editableTarget) {
                typeTextIntoElement(editableTarget, typeCommand.args.text);
                transcriptPanel.log(`Typed: "${typeCommand.args.text}"`);
            } else {
                transcriptPanel.logError("Cannot type: No editable element is focused or under the cursor.");
            }
            break;
        case CommandType.Scroll:
            const scrollCommand = command as ScrollCommand;
            const scrollDistance = scrollCommand.args.distance ?? 100;
            const scrollDelta = scrollCommand.args.direction === "up" ? -scrollDistance : scrollDistance;
            scrollElement(findScrollableTarget(cursor.getHoveredElement()), scrollDelta);
            transcriptPanel.log(`Scrolled ${scrollCommand.args.direction} by ${scrollDistance}px`);
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
