// Global References
const messageForm = document.getElementById("messageForm");
const msgForm_message = document.getElementById("msgForm_message");
const messageFormResult = document.getElementById("messageFormResult");
const msgForm_submitContainer_rateTime = document.getElementById("msgForm_submitContainer_rateTime");
const msgForm_submitBtn = document.getElementById("msgForm_submitBtn");


<<<<<<< HEAD

=======
>>>>>>> parent of 351ef00 (new rate limit security)
// Message Form Placeholder Handle
const placeholderTexts = ["I have something to say…","What would you do with no judgment?","Not sure if I should say this…","I have a weird question…","This is anonymous right?","Never told anyone this…","Is it just me or…?","I think I messed up","Quick confession:","Kinda embarrassed to admit this…","Is it wrong to feel this?","I think I'm in love","Something embarrassing happened…","This story is real","Don't hate me for this","I swear it wasn't my fault","Sometimes I miss weird things","Spoiler: I ruined everything","What if I tell you the truth?","Shhh… nobody knows","Okay… I need advice","Promise you won't laugh","It was an accident… I think","Not sure if it was a good idea","My weirdest secret:","Should've said this earlier","I'm nervous typing this","Warning: cringe","I need help","I'm scared to admit this","Okay… awkward story:","This only happens once","Do YOU do this too?","Didn't know where else to say this","Plot twist: it was me","No idea how it happened","This is gonna be weird","Not sure if I regret it","What if it's normal?","I promise it's not a joke","It's weird but true","Maybe I'm overthinking","Something crazy happened","Okay… context:","Has this ever happened to you?","Fast confession mode:","Not sure if I should say all of it","This might sound stupid","No filter:","Alright… here I go"];

const randomPlaceholderIndex = Math.floor(Math.random() * placeholderTexts.length);

msgForm_message.placeholder = placeholderTexts[randomPlaceholderIndex];


<<<<<<< HEAD
// Initializaation
=======
// Initialization
>>>>>>> parent of 351ef00 (new rate limit security)
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
const rateTimeElement = document.createElement("div");
rateTimeElement.innerHTML = `
    <img src="icons/clock.svg" alt="clock" class="filterWhite" width="28px"/> <div>32</div>
`;

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
        //await new Promise(resolve => setTimeout(resolve, 3000)); // <- Fake latency for testing
        
        const res = await fetch("../server/send_msg.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            messageFormResult.textContent = "Server error: " + (err?.message || res.statusText);
            messageFormResult.className = "statusFailed";
            return;
        }

        const data = await res.json();
        if (data.status === "success") {
            messageFormResult.textContent = data.message;
            messageFormResult.className = "statusOk";

            checkRateLimit();
        } else {
            messageFormResult.textContent = (data.message || "Uknown error");
        }
    } catch (err) {
        console.error(err);
        messageFormResult.textContent = "Unable connect to server";
        messageFormResult.className = "statusFailed";
    } finally {
        msgForm_message.value = "";
        msgForm_message.disabled = false;

        setInterval(() => {
            messageFormResult.textContent = "‎ ";
        }, 4000);
    }
});

async function checkRateLimit() {
    try {
        const res = await fetch("../server/rate_limit.php")

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            msgForm_submitContainer_rateTime.appendChild(rateTimeElement);
            currentTime = err.retryAfter;
            blockSendButtonRateLimit();
            updateClockIconTime(currentTime);

            return true;
        }

        return false;
    } catch (err) {
        console.error(err);

        return true;
    }
}

function blockSendButtonRateLimit() {
    msgForm_submitBtn.disabled = true;
    msgForm_submitBtn.title = "Come back later to send another message!"
}

function unblockSendButtonRateLimit() {
    msgForm_submitBtn.disabled = false;
    msgForm_submitBtn.title = "";
}

function updateClockIconTime(seconds) {
    rateTimeElement.querySelector("div").textContent = seconds;
    
    const interval = setInterval(() => {
        seconds--;
        rateTimeElement.querySelector("div").textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(interval);
            unblockSendButtonRateLimit();
            msgForm_submitContainer_rateTime.removeChild(rateTimeElement);
        }
    }, 1000);
}