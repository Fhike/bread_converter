const bool = false;
// Function to check if the selected text is a number
function isNumber(text) {
    return /^\d+$/.test(text.trim());
}
// Function to create and position the popup
function createPopup(input= "INR", text, rect) {
    const popup = document.createElement("div");
    popup.textContent = input+ "=" + text;
    popup.style.position = "absolute";
    popup.style.top = `${rect.bottom + window.scrollY}px`; // Position below the selection
    popup.style.left = `${rect.left + window.scrollX}px`;
    popup.style.backgroundColor = "#FFFFFF";
    popup.style.border = "1px solid black";
    popup.style.padding = "5px";
    popup.style.zIndex = "10000";
    popup.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";
    document.body.appendChild(popup);
    // Remove the popup when the selection is cleared
    document.addEventListener("selectionchange", () => {
        if (!window.getSelection().toString()) {
            popup.remove();
        }
    }, { once: true });
}
// Listen for mouseup events to detect text selection
document.addEventListener("mouseup", async (event) => {
    const selectedText = window.getSelection().toString();
    if (isNumber(selectedText)) {
        const selectionRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        const convert = await currencyConvert(selectedText);
        if (bool)
            createPopup(selectedText, convert, selectionRect);
        else
            createPopup(selectedText, selectionRect);

    }
});

async function currencyConvert(selectedText) {
    const base = "USD";
    const to = "INR";
    var url = `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_86v58bCMvaIlKBpMm4jAkPnCJxq3CF3vepCS5pVU&currencies=${to}&base_currency=${base}`;
    const response = await fetch(url);
    const data = await response.json();
    bool = true;
    return (selectedText * data.data.INR).toFixed(2);
}