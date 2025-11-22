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

showLastMessagesBtn.addEventListener("click", async(e) => {
   e.preventDefault();

   const payload = {
        quantity: 2
    };
   
   showLastMessagesBtn.disabled = true;

   lastMessagesGetResult.textContent = "Loading...";

   try {
        //await new Promise(resolve => setTimeout(resolve, 3000)); // <- Fake latency for testing
        
        const res = await fetch("../server/get_msg.php", {
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
            /*lastMessagesGetResult.innerHTML = `
                ${data.message}<br>
                {<br>
                    id: ${(data.data?.id || '-1')},<br>
                    sentMessage: ${(data.data?.sentMessage || '')},<br>
                }
            `;*/
            console.log(data.message);
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