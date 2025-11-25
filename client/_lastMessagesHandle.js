const lastMessagesContainer = document.createElement("div");
lastMessagesContainer.setAttribute("id", "lastMessagesContainer")
lastMessagesContainer.innerHTML = `
    <br><hr>
    <button id="showLastMessagesBtn">Show Last Anonymous Messages</button><br><br>
    <div id="lastMessagesGetResult"></div><br>
    <div id="lastMessagesContent"></div>
    </div>
`;

document.body.appendChild(lastMessagesContainer);

const showLastMessagesBtn = document.getElementById("showLastMessagesBtn");
const lastMessagesGetResult = document.getElementById("lastMessagesGetResult");
const lastMessagesContent = document.getElementById("lastMessagesContent");

showLastMessagesBtn.addEventListener("click", async(e) => {
   e.preventDefault();

   const payload = {
        limit: 0
    };
   
   showLastMessagesBtn.disabled = true;

   lastMessagesContent.textContent = ""
   lastMessagesGetResult.textContent = "Loading...";

   try {
        //await new Promise(resolve => setTimeout(resolve, 3000)); // <- Fake latency for testing
        
        const res = await fetch("http://localhost:3000/messages/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            lastMessagesGetResult.textContent = "Server error: " + (err?.message || res.statusText);
            return;
        }

        const data = await res.json();
        if (data.status === "success") {
            if (data.data?.lastMessages.length > 0) {
                lastMessagesGetResult.textContent = data.message;

                data.data?.lastMessages.map((item) => {
                    const messageItem = document.createElement("div");
                    messageItem.innerHTML = `
                        id: ${item.id}<br>
                        message: ${item.msg}<br>
                        created_at: ${item.created_at}<br><br>
                    `;
                    lastMessagesContent.appendChild(messageItem);
                });
            } else {
                lastMessagesGetResult.textContent = "No messages found.";
            }
        } else {
            lastMessagesGetResult.textContent = (data.message || "Uknown error");
        }
    } catch (err) {
        console.error(err);
        lastMessagesGetResult.textContent = "Unable connect to server";
    } finally {
        showLastMessagesBtn.disabled = false;
    }
});