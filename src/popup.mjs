// open extension home page in new tab
function goToHomePage() {
    window.open("home/index.html", "_blank").focus();
}
document.getElementById("homeNavButton").addEventListener("click", goToHomePage);