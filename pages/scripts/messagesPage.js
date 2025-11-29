const searchInputField = document.getElementById("search-box-input");
const searchSubmitButton = document.getElementById("search-message-button");
const searchPasteButton = document.getElementById("paste-button");
const searchServerStatus = document.getElementById("search-server-status");
const searchContainer = document.getElementById("searchContainer");

let hideStatusTextTimeout;

const yourMessageBox = document.createElement("div");
yourMessageBox.innerHTML = `
    <div class="messageBox" id="yourMessage">
        <div class="messageBox-createdAt">
            <div class="messageBox-createdAt-date" id="yourMessage-messageBox-createdAt-date">11/27/2025</div>
            -
            <div class="messageBox-createdAt-time" id="yourMessage-messageBox-createdAt-time">17:52</div>
        </div>
        <p id="yourMessage-messageBox-content">hola que tal probnaod</p>
    </div>
    <p id="yourMessage-cesarz-response" class="cesarz-response">> CesarZ's response</p>
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

            if (res.status == 429) {
                searchServerStatus.textContent += ` (Retry After: ${err.retryAfter})`
            }
            return;
        }

        const data = await res.json();
        if (data.status === "success") {
            searchServerStatus.textContent = data.message;
            searchServerStatus.className = data.data ? "statusOk" : "";

            if (yourMessageBoxInstance != null) {
                yourMessageBoxInstance.remove();
                yourMessageBoxInstance = null;
            }

            if (data.data) {
                const created_at = data.data.created_at.split('T');
                const created_at_time = created_at[1].split('.');

                if (window.innerWidth > 829) {
                    if (yourMessageBoxInstance == null) {
                        yourMessageBoxInstance = searchContainer.appendChild(yourMessageBox);
                    }
                } else {
                    document.getElementById("yourMessageModal").style.display = "flex";
                }

                document.getElementById("yourMessage-messageBox-createdAt-date").textContent = created_at[0]
                document.getElementById("yourMessage-messageBox-createdAt-time").textContent = created_at_time[0]
                document.getElementById("yourMessage-messageBox-content").textContent = data.data.msg;
                
                document.getElementById("yourMessage-cesarz-response").hidden = false;

                if (data.data.answer != null || data.data.answer == "") {
                    document.getElementById("yourMessage-cesarz-response").textContent = "> " + data.data.answer;
                } else {
                    const cesarzResponseBox = document.getElementById("yourMessage-cesarz-response");
                    cesarzResponseBox.textContent = "[The author hasn't been approved nor answered this message.]";
                    cesarzResponseBox.style.color = "#FFFFFF";
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


const serverStatusMessages = document.getElementById("server-status-messages");
const retryButtonMessages = document.getElementById("retry-button-messages");
const messagesContent = document.getElementById("messagesContent");

const pagination = document.getElementById("pagination");

async function loadMessages(offsetValue) {
    retryButtonMessages.hidden = true;

    const payload = {
        limit: 18,
        offset: offsetValue || 0,
        answerRequired: true
    };

    while (pagination.firstChild) pagination.removeChild(pagination.firstChild);

    const currentMessages = messagesContent.querySelectorAll(".messageBox");
    if (currentMessages.length > 0) {
        for (let i = 0; i < currentMessages.length; i++) {
            currentMessages[i].remove();
        }
    }

    try {
        const res = await fetch(`${config.api_key}messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            serverStatusMessages.textContent = "Server error: " + (err?.message || res.statusText);
            serverStatusMessages.className = "statusFailed";

            if (res.status == 429) {
                serverStatusMessages.textContent += ` (Retry After: ${err.retryAfter})`
            }

            retryButtonMessages.hidden = false;
            return;
        }

        const data = await res.json();
        if (data.status === "success") {
            if (data.data.length > 0) {
                serverStatusMessages.textContent = data.message;
                serverStatusMessages.className = "statusOk";
                serverStatusMessages.style.display = "none";

                data.data.map((item) => {
                    document.getElementById("status-container").style.display = "none";

                    function formatTimeDifference(ms) {
                        const seconds = Math.floor(ms / 1000);
                        const minutes = Math.floor(ms / (1000 * 60));
                        const hours = Math.floor(ms / (1000 * 60 * 60));
                        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
                        const months = Math.floor(days / 30);
                        const years = Math.floor(days / 365);

                        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
                        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
                        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
                        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
                        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
                        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
                    }

                    const createdDate = new Date(item.answered_at || Date.now());
                    const localDate = createdDate.toLocaleDateString('en-CA');
                    const localTime = createdDate.toLocaleTimeString("en-US", {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    const diffMs = Date.now() - createdDate.getTime();

                    const timeAgo = formatTimeDifference(diffMs);
                    //console.log(timeAgo);

                    const messageItem = document.createElement("div");
                    messageItem.className = "messageBox messageBoxClickeable";
                    messageItem.innerHTML = `
                        <div class="messageBox-createdAt">
                            <div class="messageBox-createdAt-date">${localDate}</div>
                            -
                            <div class="messageBox-createdAt-time">${localTime}</div>
                            -
                            <div class="messageBox-createdAt-ago">${timeAgo}</div>
                        </div>
                        <p>${item.msg}</p>
                    `;
                    messagesContent.appendChild(messageItem);

                    messageItem.addEventListener("click", (e) => {
                        messageItem.classList.add("selected-message");
                        document.getElementById("cesarzResponseModal").style.display = "flex";
                        document.getElementById("cesarzResponseModalContent").textContent = item.answer;
                    });

                    document.getElementById("close-cesarz-response").addEventListener("click", () => {
                        messageItem.classList.remove("selected-message");
                    });
                });

                if (data.totalRows >= payload.limit) {
                    const currentPage = parseInt(Math.ceil((offsetValue / data.totalRows) * Math.floor(data.totalRows / payload.limit))) + 1;
                    const totalPages = parseInt(Math.floor(data.totalRows / payload.limit)) + 1;

                    pagination.hidden = false;

                    for (let i = 0; i < totalPages; i++) {
                        const pageButton = document.createElement("button");
                        pageButton.className = "one-click-button";
                        pageButton.classList.add("page-button");
                        pageButton.textContent = i + 1;

                        pageButton.addEventListener("click", () => {
                            loadMessages(i * payload.limit)
                        });
                        
                        if ((i + 1) === currentPage) pageButton.classList.add("one-click-button-selected");

                        pagination.appendChild(pageButton);
                    }
                }
            } else {
                serverStatusMessages.textContent = "No messages found.";
                serverStatusMessages.className = "";
            }
        } else {
            serverStatusMessages.textContent = (data.message || "Unknown error");
        }
    } catch (err) {
        console.error(err);
        serverStatusMessages.textContent = "Unable connect to server";
        serverStatusMessages.className = "statusFailed";

        retryButtonMessages.hidden = false;
    }
};

loadMessages(0);

retryButtonMessages.addEventListener("click", async (e) => {
    e.preventDefault();

    await loadMessages();
});