import { VirtualCursor } from './ui/virtualCursor';
import { voiceListener } from './voice/voiceListener';
import { Win95Shell } from './ui/win95Shell';
import { initializeCommandExecutor } from './commands/commandExecutor';

document.addEventListener('DOMContentLoaded', () => {
    const shellContainer = document.querySelector<HTMLElement>('.win95-shell');
    if (shellContainer) {
        const cursor = new VirtualCursor(shellContainer);
        const shell = new Win95Shell(shellContainer);
        initializeCommandExecutor(cursor, shell);

        console.log('Virtual cursor and shell initialized.');

        const STEP_SIZE = 10; // Pixels to move per key press
        let currentHoveredElement: Element | null = null;

        const updateHoveredElement = () => {
            const newHoveredElement = cursor.getHoveredElement();
            if (newHoveredElement !== currentHoveredElement) {
                if (currentHoveredElement) {
                    // Optional: Remove hover effect from previous element
                    // currentHoveredElement.classList.remove('hovered');
                }
                if (newHoveredElement) {
                    // Optional: Add hover effect to new element
                    // newHoveredElement.classList.add('hovered');
                    console.log('Hovering over:', newHoveredElement);
                }
                currentHoveredElement = newHoveredElement;
            }
        };

        document.addEventListener('keydown', (event) => {
            let dx = 0;
            let dy = 0;

            switch (event.key) {
                case 'ArrowUp':
                    dy = -STEP_SIZE;
                    break;
                case 'ArrowDown':
                    dy = STEP_SIZE;
                    break;
                case 'ArrowLeft':
                    dx = -STEP_SIZE;
                    break;
                case 'ArrowRight':
                    dx = STEP_SIZE;
                    break;
                case ' ': // Spacebar to start/stop listening
                    if (voiceListener.isListening) {
                        voiceListener.stopListening();
                    } else {
                        voiceListener.startListening();
                    }
                    event.preventDefault();
                    return;
                default:
                    return; // Ignore other keys
            }

            cursor.move(dx, dy);
            updateHoveredElement(); // Check for hovered element after movement
            event.preventDefault(); // Prevent default scrolling behavior
        });

        // Initial check for hovered element
        updateHoveredElement();

        // Start voice listener
        voiceListener.startListening();

    } else {
        console.error('Could not find the .win95-shell container.');
    }
    console.log("SoundGO is running!");
});
