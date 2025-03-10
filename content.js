var bool = false;
var convert = 0;
var Symbol = false;


// List of currency names and symbols
const currencyNames = ["EUR", "INR", "IDR", "JPY", "PKR", "QAR", "RUB", "ZAR", "SEK", "CHF", "THB", "GBP", "USD", "ZWD"];
const currencySymbols = ["€", "₹", "Rp", "¥", "Rs", "﷼", "₽", "R", "kr", "CHF", "฿", "£", "$", "Z$"];
// Function to check if the selected text is a number
function isNumber(text) {
    const regexcheck = text.match(/^\D{0,3}\s?\d+|\d+\s?\D{0,3}$/g);
    console.log(regexcheck, "isNumber");
    return regexcheck;
}
// Function to create and position the popup
async function createPopup(defCurrency, input = "INR", rect, text) {

    const popup = document.createElement("div");
    popup.textContent = input + " = " + defCurrency + " " + text;
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
    const result = await chrome.storage.sync.get(["defaultCurrency"]);
    const defCurrency = result.defaultCurrency || "INR"; // Fallback if not set
    
    const selectedText = window.getSelection().toString();
    if (isNumber(selectedText)) {
        const array = splitCurrencyAndNumber(selectedText);
        const arr = checkCases(array);
        const ok = arr[0].toString();
        const number = checkforcoma(ok.toString(),true);
        if (arr.length == 1) {
            convert = await currencyConvert(number, defCurrency);
        } else if (!Symbol) {
            convert = await currencyConvert(number, defCurrency, arr[1]);
        } else {
            convert = await currencyConvert(number, defCurrency, currencyNames[currencySymbols.indexOf(arr[1])]);
        }
        const selectionRect = window.getSelection().getRangeAt(0).getBoundingClientRect();

        // const value = checkforcoma(convert.toString(),false);
        if (bool)
            createPopup(defCurrency, selectedText, selectionRect, convert);
        else
            createPopup(defCurrency, selectedText, selectionRect);

    }
});
// Function to check the cases of the selected text
const checkCases = (arr) => {
    var result = [];
    arr.forEach(element => {
        if (/^\d+\,?\.?\d*$/.test(element.trim())) {
            result[0] = element;
        } else if (currencyNames.includes(element.trim())) {
            result[1] = element;
        } else if (currencySymbols.includes(element.trim())) {
            result[1] = element;
            Symbol = true;
        }
    });
    console.log(result, "checkCases");
    return result;
}
// Function to convert the currency
async function currencyConvert(amount, to_currency, base_currency = "USD") {
    //var url = `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_86v58bCMvaIlKBpMm4jAkPnCJxq3CF3vepCS5pVU&currencies=${to_currency}&base_currency=${base_currency}`;

    var url = `https://hexarate.paikama.co/api/rates/latest/${base_currency}?target=${to_currency}`;
    const response = await fetch(url);
    const data = await response.json();

    bool = true;
    return (amount * data["data"]["mid"]).toFixed(2);


}
function splitCurrencyAndNumber(text) {
    // Regex to match currency symbols or text followed by a number, or vice versa
    const regex = /([A-Za-z\$€₹(Rp)¥(Rs)(﷼)₽R(kr)(CHF)฿£$(Z$)]+)\s*(\d+\,?\.?\d*)|(\d+\,?\.?\d*)\s*([A-Za-z\$€₹(Rp)¥(Rs)(﷼)₽R(kr)(CHF)฿£$(Z$)]+)/g;
    // Execute the regex on the input text
    const matches = regex.exec(text);
    console.log(matches, "splitCurrencyAndNumber");
    if (matches) {
        // Extract the currency and number parts
        const currency = matches[1] || matches[4]; // Currency symbol or text
        const number = matches[2] || matches[3];   // Number

        return [currency, number];
    }
    // If no match is found, return the original text in an array
    return [text];

}

const checkforcoma = (number,convert) => {
    if (number.includes(",") && convert) {
        return number.replace(",", "");
    }else{
        if (number.length > 3) {
            let lastThree = number.slice(-3);
            let otherNumbers = number.slice(0, -3);
            otherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
            return otherNumbers + "," + lastThree;
        }
        
    }
    console.log(number, "checkforcoma");
    return number;
}