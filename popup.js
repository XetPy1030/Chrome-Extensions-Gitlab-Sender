const grabBtn = document.getElementById("grabBtn");
grabBtn.addEventListener("click", () => {
    alert(123)
    chrome.tabs.query({active: true}, (tabs) => {
        const tab = tabs[0];
        if (tab) {
            alert(tab.id)
        } else {
            alert("There are no active tabs")
        }
    })
})