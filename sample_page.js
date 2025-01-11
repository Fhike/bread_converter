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

        // Create the pop-up element
        document.body.insertAdjacentHTML(
            'beforeend',
            `<div class="currency-popup" onClick="redirectToConverter()">Convert your currency</div>`
        );

        // Style the pop-up element
        const popup = document.querySelector('.currency-popup');
        popup.style.position = 'absolute';
        popup.style.left = `${posX}px`;
        popup.style.top = `${posY}px`;
        popup.style.padding = '10px';
        popup.style.backgroundColor = '#007bff';
        popup.style.color = '#fff';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.cursor = 'pointer';
        popup.style.zIndex = '1000';
        popup.style.fontSize = '14px';
        popup.style.fontFamily = 'Arial, sans-serif';
    }
}

function redirectToConverter() {
    window.open('https://www.xe.com/currencyconverter/', '_blank');
}
