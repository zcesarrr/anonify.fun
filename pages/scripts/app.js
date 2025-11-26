// Global References
const messageForm = document.getElementById("messageForm");
const msgForm_message = document.getElementById("msgForm_message");
const messageFormResult = document.getElementById("messageFormResult");
const msgForm_submitContainer_rateTime = document.getElementById("msgForm_submitContainer_rateTime");
const msgForm_submitBtn = document.getElementById("msgForm_submitBtn");

// Rate limit element
let rateTimeElement = null;

// Message Form Placeholder Handle
const placeholderTexts = ["I have something to say…","What would you do with no judgment?","Not sure if I should say this…","I have a weird question…","This is anonymous right?","Never told anyone this…","Is it just me or…?","I think I messed up","Quick confession:","Kinda embarrassed to admit this…","Is it wrong to feel this?","I think I'm in love","Something embarrassing happened…","This story is real","Don't hate me for this","I swear it wasn't my fault","Sometimes I miss weird things","Spoiler: I ruined everything","What if I tell you the truth?","Shhh… nobody knows","Okay… I need advice","Promise you won't laugh","It was an accident… I think","Not sure if it was a good idea","My weirdest secret:","Should've said this earlier","I'm nervous typing this","Warning: cringe","I need help","I'm scared to admit this","Okay… awkward story:","This only happens once","Do YOU do this too?","Didn't know where else to say this","Plot twist: it was me","No idea how it happened","This is gonna be weird","Not sure if I regret it","What if it's normal?","I promise it's not a joke","It's weird but true","Maybe I'm overthinking","Something crazy happened","Okay… context:","Has this ever happened to you?","Fast confession mode:","Not sure if I should say all of it","This might sound stupid","No filter:","Alright… here I go"];

const randomPlaceholderIndex = Math.floor(Math.random() * placeholderTexts.length);
msgForm_message.placeholder = placeholderTexts[randomPlaceholderIndex];

// Initialization
async function initApp() {
    msgForm_submitBtn.disabled = true;
    
    if (await checkRateLimit()) {
        blockSendButtonRateLimit();
    } else {
        unblockSendButtonRateLimit();
    }
}

initApp();

// Submit Message Handle
let hideStatusTextTimeout;

messageForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const formData = new FormData(messageForm);
    const payload = {
        message: formData.get("msgForm_message")
    };
    
    messageFormResult.className = "";
    clearTimeout(hideStatusTextTimeout);

    msgForm_message.disabled = true;
    msgForm_submitBtn.disabled = true;

    messageFormResult.textContent = "Sending...";

    try {
        const res = await fetch("http://localhost:3000/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.headers.get("ratelimit-reset") !== null) {
            const now = Date.now();
            localStorage.setItem("rateLimit", now);

            localStorage.setItem("rateLimitDuration", res.headers.get('ratelimit-reset'));
            
            checkRateLimit();
        }

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            messageFormResult.textContent = "Server error: " + (err?.message || res.statusText);
            messageFormResult.className = "statusFailed";
            return;
        }

        const data = await res.json();
        if (data.status === "success") {
            msgForm_message.value = "";

            messageFormResult.textContent = data.message;
            messageFormResult.className = "statusOk";
        } else {
            messageFormResult.textContent = (data.message || "Unknown error");
        }
    } catch (err) {
        console.error(err);
        messageFormResult.textContent = "Unable connect to server";
        messageFormResult.className = "statusFailed";

        unblockSendButtonRateLimit();
    } finally {
        msgForm_message.disabled = false;

        hideStatusTextTimeout = setTimeout(() => {
            messageFormResult.textContent = "‎ ";
        }, 6000);
    }
});

async function checkRateLimit() {
    const rateLimitTime = localStorage.getItem("rateLimit");
    const rateLimitDuration = parseInt(localStorage.getItem("rateLimitDuration")) || 45;
    
    if (rateLimitTime) {
        const timeElapsed = (Date.now() - parseInt(rateLimitTime)) / 1000;
        const timeLeft = Math.ceil(rateLimitDuration - timeElapsed);
        
        if (timeLeft > 0) {
            blockSendButtonRateLimit();
            createRateTimeElement();
            updateClockIconTime(timeLeft);
            return true;
        } else {
            localStorage.removeItem("rateLimit");
            localStorage.removeItem("rateLimitDuration");
        }
    }

    try {
        const res = await fetch("../server/rate_limit.php");

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            
            if (err && err.retryAfter) {
                const retryAfter = parseInt(err.retryAfter);
                
                localStorage.setItem("rateLimit", Date.now().toString());
                localStorage.setItem("rateLimitDuration", retryAfter.toString());
                
                blockSendButtonRateLimit();
                createRateTimeElement();
                updateClockIconTime(retryAfter);
                return true;
            }
        }

        return false;
    } catch (err) {
        console.error(err);
        return true;
    }
}

function createRateTimeElement() {
    if (!rateTimeElement) {
        rateTimeElement = document.createElement("div");
        rateTimeElement.innerHTML = `
            <img src="icons/clock.svg" alt="clock" class="filterWhite" width="28px"/> <div>0</div>
        `;
        msgForm_submitContainer_rateTime.appendChild(rateTimeElement);
    }
}

function blockSendButtonRateLimit() {
    msgForm_submitBtn.disabled = true;
    msgForm_submitBtn.title = "Come back later to send another message!";
}

function unblockSendButtonRateLimit() {
    msgForm_submitBtn.disabled = false;
    msgForm_submitBtn.title = "";
    
    if (rateTimeElement && rateTimeElement.parentNode) {
        rateTimeElement.parentNode.removeChild(rateTimeElement);
        rateTimeElement = null;
    }
}

function updateClockIconTime(seconds) {
    if (!rateTimeElement) return;
    
    const timeDisplay = rateTimeElement.querySelector("div");
    if (!timeDisplay) return;
    
    timeDisplay.textContent = seconds;
    
    const interval = setInterval(() => {
        seconds--;
        timeDisplay.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(interval);
            unblockSendButtonRateLimit();
            
            localStorage.removeItem("rateLimit");
            localStorage.removeItem("rateLimitDuration");
        }
    }, 1000);
}