function goToMainPage() {
    window.open("main/index.html", "_blank").focus();
}
document.getElementById("newTabButton").addEventListener("click", goToMainPage);


// function updateWatchlist() {
//     chrome.storage.sync.get('watchManList', function (data) {
//         const storedTitles = data.watchManList ?? [];
//         const newTitles = [];

//         storedTitles.forEach((elem, indx) => {
//             const newTitle = { ...elem, list: 'want-to-watch' };
//             newTitles.push(newTitle);
//         });
//         chrome.storage.sync.set({ 'watchManList': newTitles });
//     });
// }
// document.getElementById("blah").addEventListener("click", updateWatchlist);



let name, poster, imdbId;

function addToWatchlist() {
    const newTitle = {
        name,
        poster,
        imdbId,
        list: 'want-to-watch'
    };
    // const storedTitles = JSON.parse(localStorage.getItem("watchManList")) ?? [];
    // if (!storedTitles.some(title => title.imdbId === imdbId)) {
    //     storedTitles.push(newTitle);
    //     localStorage.setItem("watchManList", JSON.stringify(storedTitles));
    // }
    chrome.storage.sync.get('watchManList', function (data) {
        const storedTitles = data.watchManList ?? [];
        if (!storedTitles.some(title => title.imdbId === imdbId)) {
            storedTitles.push(newTitle);
            chrome.storage.sync.set({ 'watchManList': storedTitles });
            const addBtn = document.getElementById("addButton");
            addBtn.setAttribute("disabled", "true");
            addBtn.textContent = "Added to watchlist";
        }
    });
}

document.getElementById("addButton").addEventListener("click", addToWatchlist);

async function contactContentScript() {
    try {
        let queryOptions = { active: true, currentWindow: true };
        let tab = await chrome.tabs.query(queryOptions);
        if (tab.length < 1)
            return;

        chrome.tabs.sendMessage(
            tab[0].id,
            { from: 'popup', to: 'content' },
            function (response) {
                if (chrome.runtime.lastError) {
                    console.log("oops");
                }
                else {
                    if (response.status === 200) {
                        name = response.name;
                        poster = response.image;
                        imdbId = response.imdbId;


                        chrome.storage.sync.get('watchManList', function (data) {
                            const storedTitles = data.watchManList ?? [];
                            if (storedTitles.some(title => title.imdbId === imdbId)) {
                                const addBtn = document.getElementById("addButton");
                                addBtn.setAttribute("disabled", "true");
                                addBtn.textContent = "Added to watchlist";
                            }
                        });
                        // const storedTitles = JSON.parse(localStorage.getItem("watchManList")) ?? [];
                        // if (storedTitles.some(title => title.imdbId === imdbId)) {
                        //     const addBtn = document.getElementById("addButton")
                        //     addBtn.setAttribute("disabled", "true");
                        //     addBtn.textContent = "Added to watchlist";
                        // }


                        document.getElementById("title-name").textContent = name;
                        document.getElementById("title-poster").setAttribute("src", poster);
                        document.getElementById("title-found").style.display = "block";
                        document.getElementById("no-title").style.display = "none";
                    }
                    else {
                        const storedTitles = JSON.parse(localStorage.getItem("watchManList")) ?? [];
                        if (storedTitles.length < 1) {
                            document.getElementById("title-found").style.display = "none";
                            document.getElementById("no-title").style.display = "block";
                        }
                    }
                }
            }
        );
    } catch (e) {
        console.log(e);
    }
}

contactContentScript();