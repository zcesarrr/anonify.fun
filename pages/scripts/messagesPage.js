const searchInputField = document.getElementById("search-box-input");
const searchSubmitButton = document.getElementById("search-message-button");
const searchPasteButton = document.getElementById("paste-button");
const searchServerStatus = document.getElementById("search-server-status");

searchInputField.addEventListener("input", (e) => {
    checkSearchInputLength();
});

function checkSearchInputLength() {

    if (searchInputField.value.length >= 36) {
        searchSubmitButton.disabled = false;
        searchPasteButton.disabled = true;
    } else {
        searchSubmitButton.disabled = true;
        searchPasteButton.disabled = false;
    }
}

searchPasteButton.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        const textClipboard = await navigator.clipboard.readText();
        searchInputField.value = textClipboard;

        checkSearchInputLength();
    } catch (err) {
        console.log(err);
    }
});

searchSubmitButton.addEventListener("click", async (e) => {
    e.preventDefault();

    searchInputField.disabled = true;
    searchSubmitButton.disabled = true;

    const payload = {
        id: searchInputField.value
    };
});