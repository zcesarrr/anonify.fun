const messageForm = document.getElementById("messageForm");
const result = document.getElementById("result");

messageForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const formData = new FormData(messageForm);
    const payload = {
        msg: formData.get("msgForm_message")
    };

    messageForm.elements.msgForm_message.disabled = true;
    messageForm.elements.msgForm_submitBtn.disabled = true;

    result.textContent = "Sending...";

    try {
        //await new Promise(resolve => setTimeout(resolve, 3000)); // <- Fake latency for testing
        
        const res = await fetch("../server/send_msg.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            result.textContent = "Server error: " + (err?.message || res.statusText);
            return;
        }

        const data = await res.json();
        if (data.status === "success") {
            result.innerHTML = data.message + '<br>{ sentMessage: ' + (data.data?.sentMessage || '') + " }";
        } else {
            result.textContent = (data.message || "Uknown error");
        }
    } catch (err) {
        console.error(err);
        result.textContent = "Unable connect to server";
    } finally {
        messageForm.elements.msgForm_message.disabled = false;
        messageForm.elements.msgForm_submitBtn.disabled = false;
    }
});