
async function contactContentScript() {
    try {
        let queryOptions = { active: true, currentWindow: true };
        let tab = await chrome.tabs.query(queryOptions);
        if (tab.length < 1)
            return

        chrome.tabs.sendMessage(
            tab[0].id,
            { from: 'background', to: 'content' },
            function (response) {
                if (chrome.runtime.lastError) {
                    chrome.action.setIcon({ path: "assets/gray32.png" });
                }
                else {
                    if (response.status === 200) {
                        chrome.action.setIcon({ path: "assets/glow32.png" });
                    }
                    else {
                        chrome.action.setIcon({ path: "assets/gray32.png" });
                    }
                }
            }
        );
    } catch (e) {
        console.log(e);
    }
}

async function contactPopup(dat) {
    try {
        const response = await chrome.runtime.sendMessage({
            from: "background",
            to: "popup",
            data: dat
        });
        console.log('response', response);
    } catch (e) {
        console.log(e);
    }
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
    contactContentScript();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    contactContentScript();
});