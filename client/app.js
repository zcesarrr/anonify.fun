// Global References
const messageForm = document.getElementById("messageForm");
const msgForm_message = document.getElementById("msgForm_message");
const messageFormResult = document.getElementById("messageFormResult");
const msgForm_submitContainer_rateTime = document.getElementById("msgForm_submitContainer_rateTime");
const msgForm_submitBtn = document.getElementById("msgForm_submitBtn");

function getLocalExpires() {
    const v = localStorage.getItem("rate_limit_expires");
    return v ? parseInt(v, 10) : 0;
}
function setLocalExpires(secondsFromNow) {
    const expires = Math.floor(Date.now() / 1000) + secondsFromNow;
    localStorage.setItem("rate_limit_expires", String(expires));
}
function clearLocalExpires() {
    localStorage.removeItem("rate_limit_expires");
}
function isLocallyBlocked() {
    const expires = getLocalExpires();
    const now = Math.floor(Date.now() / 1000);
    return expires && expires > now;
}

async function initApp() {
    if (isLocallyBlocked()) {
        const secondsLeft = getLocalExpires() - Math.floor(Date.now() / 1000);
        blockSendButtonRateLimit();
        appendRateTimeElement();
        updateClockIconTime(secondsLeft);
    } else {
        unblockSendButtonRateLimit();
    }
}

initApp();

const rateTimeElement = document.createElement("div");
rateTimeElement.innerHTML = `
    <img src="icons/clock.svg" alt="clock" class="filterWhite" width="28px"/> <div>32</div>
`;

function appendRateTimeElement() {
    if (!msgForm_submitContainer_rateTime.contains(rateTimeElement)) {
        msgForm_submitContainer_rateTime.appendChild(rateTimeElement);
    }
}


// Submit Message Handle
messageForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const formData = new FormData(messageForm);
    const payload = {
        msg: formData.get("msgForm_message")
    };

    msgForm_message.disabled = true;
    msgForm_submitBtn.disabled = true;

    messageFormResult.textContent = "Sending...";

    try {
        const res = await fetch("../server/send_msg.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.status === 429) {
            const retryHeader = res.headers.get("Retry-After");
            let retryAfter = parseInt(retryHeader, 10);
            if (!retryAfter || Number.isNaN(retryAfter)) {
                const err = await res.json().catch(() => null);
                retryAfter = err?.retryAfter || 30;
            }

            setLocalExpires(retryAfter);
            appendRateTimeElement();
            blockSendButtonRateLimit();
            updateClockIconTime(retryAfter);

            const errBody = await res.json().catch(() => null);
            messageFormResult.textContent = errBody?.message || "Too many requests. Try later.";
            messageFormResult.className = "statusFailed";
            return;
        }

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            messageFormResult.textContent = "Server error: " + (err?.message || res.statusText);
            messageFormResult.className = "statusFailed";
            return;
        }

        const resetHeader = res.headers.get("X-RateLimit-Reset");
        if (resetHeader) {
            const resetTs = parseInt(resetHeader, 10);
            const now = Math.floor(Date.now() / 1000);
            const secondsLeft = Math.max(0, resetTs - now);
            if (secondsLeft > 0) {
                setLocalExpires(secondsLeft);
                appendRateTimeElement();
                blockSendButtonRateLimit();
                updateClockIconTime(secondsLeft);
            } else {
                clearLocalExpires();
            }
        } else {
            clearLocalExpires();
            unblockSendButtonRateLimit();
        }

        const data = await res.json();
        if (data.status === "success") {
            messageFormResult.textContent = data.message;
            messageFormResult.className = "statusOk";
        } else {
            messageFormResult.textContent = (data.message || "Unknown error");
            messageFormResult.className = "statusFailed";
        }
    } catch (err) {
        console.error(err);
        messageFormResult.textContent = "Unable connect to server";
        messageFormResult.className = "statusFailed";
    } finally {
        msgForm_message.value = "";
        msgForm_message.disabled = false;

        setTimeout(() => {
            messageFormResult.textContent = "‎ ";
        }, 4000);
    }
});

function blockSendButtonRateLimit() {
    msgForm_submitBtn.disabled = true;
    msgForm_submitBtn.title = "Come back later to send another message!";
}

function unblockSendButtonRateLimit() {
    msgForm_submitBtn.disabled = false;
    msgForm_submitBtn.title = "";
}

function updateClockIconTime(seconds) {
    appendRateTimeElement();
    rateTimeElement.querySelector("div").textContent = seconds;

    const interval = setInterval(() => {
        seconds--;
        rateTime_element = rateTimeElement;
        rateTimeElement.querySelector("div").textContent = seconds;

        if (seconds <= 0) {
            clearInterval(interval);
            unblockSendButtonRateLimit();
            if (msgForm_submitContainer_rateTime.contains(rateTimeElement)) {
                msgForm_submitContainer_rateTime.removeChild(rateTimeElement);
            }
            clearLocalExpires();
        }
    }, 1000);
}