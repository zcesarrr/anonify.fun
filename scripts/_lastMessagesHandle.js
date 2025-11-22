/*const lastMessagesTemplate = document.getElementById("lastMessagesTemplate");

const lastMessagesContainer = document.getElementById("lastMessagesContainer");

const clonedContent = lastMessagesTemplate.content.cloneNode(true);

lastMessagesContainer.appendChild(clonedContent);*/

const lastMessagesContainer = document.createElement("div");
lastMessagesContainer.innerHTML = `
    <br><hr>
    <div id="lastMessagesContent">
        <button>Show Last Anonymous Messages</button>
        <div id="lastMessagesShower"></div>
    </div>
`;

document.body.appendChild(lastMessagesContainer);