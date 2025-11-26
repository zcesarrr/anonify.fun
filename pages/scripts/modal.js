const modalCloseButtons = document.getElementsByClassName("close-modal-btn");

for (let i = 0; i < modalCloseButtons.length; i++) {
    modalCloseButtons[i].addEventListener('click', () => {
        modalCloseButtons[i].parentElement.parentElement.style.display = "none";
    });
}