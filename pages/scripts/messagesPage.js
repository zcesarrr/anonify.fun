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

    searchServerStatus.textContent = "Searching...";

    try {
        const res = await fetch(`${config.api_key}search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            searchServerStatus.textContent = "Server error: " + (err?.message || res.statusText);
            searchServerStatus.className = "statusFailed";
            return;
        }

        const data = await res.json();
        if (data.status === "success") {
            searchServerStatus.textContent = data.message;
            searchServerStatus.className = data.data ? "statusOk" : "";

            if (data.data) {
                
            }
        } else {
            searchServerStatus.textContent = (data.message || "Unknown error");
        }
    } catch (err) {
        console.error(err);
        searchServerStatus.textContent = "Unable connect to server";
        searchServerStatus.className = "statusFailed";
    } finally {
        searchInputField.disabled = false;
        searchSubmitButton.disabled = false;
    }
});