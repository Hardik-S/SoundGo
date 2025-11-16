import { VirtualCursor } from './ui/virtualCursor';
import { voiceListener } from './voice/voiceListener';
document.addEventListener('DOMContentLoaded', () => {
    const shellContainer = document.querySelector('.win95-shell');
    if (shellContainer) {
        const cursor = new VirtualCursor(shellContainer);
        console.log('Virtual cursor initialized.');
        const STEP_SIZE = 10; // Pixels to move per key press
        let currentHoveredElement = null;
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
                    break;
                case 'ArrowRight':
                    dx = STEP_SIZE;
                    break;
                case ' ': // Spacebar to start/stop listening
                    if (voiceListener.isListening) {
                        voiceListener.stopListening();
                    }
                    else {
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
        // voiceListener.startListening(); // We'll start it with a key press for now
    }
    else {
        console.error('Could not find the .win95-shell container.');
    }
    console.log("SoundGO is running!");
});
