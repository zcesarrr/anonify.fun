const messageForm = document.getElementById("messageForm");
const result = document.getElementById("result");

messageForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const formData = new FormData(messageForm);
    const payload = {
        msg: formData.get("message")
    };

    result.textContent = "Sending...";

    try {
        const res = await fetch("../server/send_msg.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            result.textContent("Server error: " + (err?.message || res.statusText));
            return;
        }

        const data = await res.json();
        if (data.status === "success") {
            result.innerHTML = data.message + '<br>message: ' + (data.data?.message || '');
        } else {
            result.textContent = (data.message || "Uknown error");
        }
    } catch (err) {
        console.error(err);
        result.textContent = "Unable connect to server";
    }
});