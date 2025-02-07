var bool = false;
var convert = 0;
var Symbol = false;
chrome.storage.local.get(["default_currency"], function (result) {
    if (result.default_currency == null) {
        chrome.storage.local.set({ default_currency: "INR" });
    }
});
// List of currency names and symbols
const currencyNames = ["USD", "EUR", "JPY", "GBP", "INR", "CNY", "CHF", "AUD", "CAD", "SGD", "HKD", "SEK", "KRW", "NZD", "NOK", "MXN", "INR", "AED", "ZAR", "BRL", "MYR", "THB", "RUB", "IDR", "PHP", "HUF", "CZK", "PLN", "DKK", "RON", "CLP", "COP", "PEN", "VND", "BGN", "HRK"];
const currencySymbols = ["$", "€", "¥", "£", "₹", "₩", "₺", "₱", "₦", "₴", "₲", "₪", "₡", "₵", "₭", "₮", "₱", "₤", "₨", "₮", "₼", "₽", "฿", "₫", "₺", "₧", "₳"];
// Function to check if the selected text is a number
function isNumber(text) {
    return text.match(/^\D{0,3}\s?\d+\s?\D{0,3}$/g);
}
// Function to create and position the popup
function createPopup(input = "INR", text, rect) {
    const popup = document.createElement("div");
    popup.textContent = input + "=" + text;
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
        const arr = checkCases(selectedText.split(" "));
     
        if(arr.length == 1){
            convert = await currencyConvert(arr[0], chrome.storage.local.get["default_currency"]);
        }else  if (!Symbol) {
            convert = await currencyConvert(arr[0], chrome.storage.local.get["default_currency"],arr[1]);
        } else  {
            convert = await currencyConvert(arr[0], chrome.storage.local.get["default_currency"],currencySymbols.indexOf(arr[1]));
        }
        const selectionRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
      
        if (bool)
            createPopup(selectedText, convert, selectionRect);
        else
            createPopup(selectedText, selectionRect);

    }
});
// Function to check the cases of the selected text
const checkCases = (arr) => {
    var result=[];
    arr.forEach(element => {
        if(/^\d+$/.test(element.trim())){
            result[0] = element;
        }else if(currencyNames.includes(element.trim())){
            result[1] = element;
        }else if(currencySymbols.includes(element.trim())){
            result[1] = element;
            Symbol = true;
        }
    });

    return result;
}
// Function to convert the currency
async function currencyConvert(amount, to_currency = "INR", base_currency ="USD") {
    var url = `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_86v58bCMvaIlKBpMm4jAkPnCJxq3CF3vepCS5pVU&currencies=${to_currency}&base_currency=${base_currency}`;
    const response = await fetch(url);
    const data = await response.json();

    bool = true;
    return (amount * data["data"][to_currency]).toFixed(2);
}