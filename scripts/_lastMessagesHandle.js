const lastMessagesContainer = document.createElement("div");
lastMessagesContainer.setAttribute("id", "lastMessagesContainer")
lastMessagesContainer.innerHTML = `
    <br><hr>
    <button id="showLastMessagesBtn">Show Last Anonymous Messages</button>
    <div id="lastMessagesContent"></div>
    </div>
`;

document.body.appendChild(lastMessagesContainer);

const showLastMessagesBtn = document.getElementById("showLastMessagesBtn");

showLastMessagesBtn.addEventListener("click", (e) => {
   e.preventDefault();

   
});
