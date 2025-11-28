const searchInputField = document.getElementById("search-box-input");
const searchSubmitButton = document.getElementById("search-message-button");
const searchPasteButton = document.getElementById("paste-button");
const searchServerStatus = document.getElementById("search-server-status");
const searchContainer = document.getElementById("searchContainer");

let hideStatusTextTimeout;

const yourMessageBox = document.createElement("div");
yourMessageBox.className = "messageBox";
yourMessageBox.setAttribute("id", "yourMessage");
yourMessageBox.innerHTML = `
    <div class="messageBox-createdAt">
        <div class="messageBox-createdAt-date" id="yourMessage-messageBox-createdAt-date">11/27/2025</div>
        -
        <div class="messageBox-createdAt-time" id="yourMessage-messageBox-createdAt-time">17:52</div>
    </div>
    <p id="yourMessage-messageBox-content">hola que tal probnaod</p>
`;

let yourMessageBoxInstance;

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
    clearTimeout(hideStatusTextTimeout);

    if (yourMessageBoxInstance != null) {
        yourMessageBoxInstance.remove();
        yourMessageBoxInstance = null;
    }

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
                if (yourMessageBoxInstance == null) {
                    const created_at = data.data.created_at.split('T');
                    console.log(created_at[0]);

                    const created_at_time = created_at[1].split('.');
                    console.log(created_at_time[0]);
                    
                    yourMessageBoxInstance = searchContainer.appendChild(yourMessageBox);
                    document.getElementById("yourMessage-messageBox-createdAt-date").textContent = created_at[0]
                    document.getElementById("yourMessage-messageBox-createdAt-time").textContent = created_at_time[0]
                    document.getElementById("yourMessage-messageBox-content").textContent = data.data.msg;
                }
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

        hideStatusTextTimeout = setTimeout(() => {
            searchServerStatus.textContent = "";
        }, 6000);
    }
});