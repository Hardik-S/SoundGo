import { VirtualCursor } from './ui/virtualCursor';

document.addEventListener('DOMContentLoaded', () => {
    const shellContainer = document.querySelector<HTMLElement>('.win95-shell');
    if (shellContainer) {
        const cursor = new VirtualCursor(shellContainer);
        console.log('Virtual cursor initialized.');
    } else {
        console.error('Could not find the .win95-shell container.');
    }
    console.log("SoundGO is running!");
});
