document.getElementById('article').addEventListener('mouseup', mouseUpHandler);

function mouseUpHandler(event) {
    // Remove any existing pop-up box
    document.querySelectorAll('.currency-popup').forEach(e => e.remove());

    // Check if any text is selected
    if (getSelection().toString().trim().length > 0) {
        const scrollTop = document.documentElement.scrollTop;

        // Calculate the position for the pop-up
        const posX = event.clientX - 70; // Adjust for horizontal positioning
        const posY = event.clientY + 20 + scrollTop; // Adjust for vertical positioning
        console.log(posX, posY);
    
    }
}