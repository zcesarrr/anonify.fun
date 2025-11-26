const currentPage = document.getElementById("components-logic-script").dataset.currentIndex;
if (currentPage === "1") {
    document.getElementById("header-nav-home").classList.add("nav-button-selected");
} else if (currentPage === "2") {
    document.getElementById("header-nav-messages").classList.add("nav-button-selected");
} else if (currentPage === "3") {
    document.getElementById("header-nav-about").classList.add("nav-button-selected");
}