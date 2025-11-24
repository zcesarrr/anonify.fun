// Global References
const messageForm = document.getElementById("messageForm");
const msgForm_message = document.getElementById("msgForm_message");
const messageFormResult = document.getElementById("messageFormResult");
const msgForm_submitContainer_rateTime = document.getElementById("msgForm_submitContainer_rateTime");


// Message Form Placeholder Handle
const placeholderTexts = ["I have something to say…","What would you do with no judgment?","Not sure if I should say this…","I have a weird question…","This is anonymous right?","Never told anyone this…","Is it just me or…?","I think I messed up","Quick confession:","Kinda embarrassed to admit this…","Is it wrong to feel this?","I think I'm in love","Something embarrassing happened…","This story is real","Don't hate me for this","I swear it wasn't my fault","Sometimes I miss weird things","Spoiler: I ruined everything","What if I tell you the truth?","Shhh… nobody knows","Okay… I need advice","Promise you won't laugh","It was an accident… I think","Not sure if it was a good idea","My weirdest secret:","Should've said this earlier","I'm nervous typing this","Warning: cringe","I need help","I'm scared to admit this","Okay… awkward story:","This only happens once","Do YOU do this too?","Didn't know where else to say this","Plot twist: it was me","No idea how it happened","This is gonna be weird","Not sure if I regret it","What if it's normal?","I promise it's not a joke","It's weird but true","Maybe I'm overthinking","Something crazy happened","Okay… context:","Has this ever happened to you?","Fast confession mode:","Not sure if I should say all of it","This might sound stupid","No filter:","Alright… here I go"];

const randomPlaceholderIndex = Math.floor(Math.random() * placeholderTexts.length);

msgForm_message.placeholder = placeholderTexts[randomPlaceholderIndex];


// Submit Message Handle
checkRateLimit();

const rateTimeElement = document.createElement("div");
rateTimeElement.innerHTML = `
    <img src="icons/clock.svg" alt="clock" class="filterWhite" width="28px"/> 32
`;

messageForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const formData = new FormData(messageForm);
    const payload = {
        msg: formData.get("msgForm_message")
    };

    msgForm_message.disabled = true;
    messageForm.elements.msgForm_submitBtn.disabled = true;

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

            messageForm.elements.msgForm_submitBtn.title = "Come back later to send another message!"

            msgForm_submitContainer_rateTime.appendChild(rateTimeElement);
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
        //messageForm.elements.msgForm_submitBtn.disabled = false;
    }
});


async function checkRateLimit() {
    try {
        const res = await fetch("../server/rate_limit.php")

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            messageFormResult.textContent = "Server error: " + (err?.message || res.statusText);
            messageFormResult.className = "statusFailed";
            return;
        }
    } catch (err) {
        console.error(err);
        messageFormResult.textContent = "Unable connect to server";
        messageFormResult.className = "statusFailed";
    }
}