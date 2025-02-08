document.addEventListener("DOMContentLoaded", function () {
    const currencySelect = document.getElementById("currency-select");

    // Load the saved default currency from storage
    chrome.storage.sync.get(["defaultCurrency"], function (result) {
        if (result.defaultCurrency) {
            currencySelect.value = result.defaultCurrency;
        }
    });

    // Save the selected default currency
    currencySelect.addEventListener("change", function () {
        chrome.storage.sync.set({ defaultCurrency: currencySelect.value }, function () {
            console.log("Default currency set to:", currencySelect.value);
        });
    });
});
