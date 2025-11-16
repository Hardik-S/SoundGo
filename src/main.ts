import { VirtualCursor } from './ui/virtualCursor';

document.addEventListener('DOMContentLoaded', () => {
    const shellContainer = document.querySelector<HTMLElement>('.win95-shell');
    if (shellContainer) {
        const cursor = new VirtualCursor(shellContainer);
        console.log('Virtual cursor initialized.');

        const STEP_SIZE = 10; // Pixels to move per key press

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
                default:
                    return; // Ignore other keys
            }

            cursor.move(dx, dy);
            event.preventDefault(); // Prevent default scrolling behavior
        });

    } else {
        console.error('Could not find the .win95-shell container.');
    }
    console.log("SoundGO is running!");
});
