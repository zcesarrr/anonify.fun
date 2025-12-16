const buttonToOpen = document.getElementById("open-rules");

buttonToOpen.addEventListener("click", openRulesModal);

function openRulesModal(e) {
    e.preventDefault();

    document.getElementById("rulesModal").style.display = "flex";
}