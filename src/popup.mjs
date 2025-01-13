import { LISTS } from "./constants.js";
let name, poster, imdbId, description, runtime, genres, releaseDate, type;



// open extension main page in new tab
function goToMainPage() {
    window.open("main/index.html", "_blank").focus();
}
document.getElementById("homeNavButton").addEventListener("click", goToMainPage);

// open extension main page in new tab
function goToTitlePage() {
    const params = new URLSearchParams();
    params.append("imdbId", imdbId);
    const queryString = params.toString();
    window.open(`title/index.html?${queryString}`, "_blank").focus();
}
document.getElementById("titleNavButton").addEventListener("click", goToTitlePage);


// function updateWatchlist() {
//     chrome.storage.sync.get('watchManList', function (data) {
//         const storedTitles = data.watchManList ?? [];
//         const newTitles = [];

//         storedTitles.forEach((elem, indx) => {
//             const newTitle = { name: elem.name, poster: elem.poster, imdbId: elem.imdbId };
//             newTitles.push(newTitle);
//         });
//         chrome.storage.sync.set({ 'want-to-watch': newTitles });
//         console.log('updated');
//     });
// }
// document.getElementById("syncButton").addEventListener("click", updateWatchlist);



function addToWatchlist(event, list = 'want-to-watch') {
    const newTitle = {}
    newTitle[imdbId] = {
        name,
        poster,
        description,
        runtime,
        genres,
        releaseDate,
        type
    };

    if(!LISTS.some(x => x === list)) {
        console.error("Invalid list name");
        console.log(LISTS, list, LISTS.some(x => x === list));
        return;
    }

    chrome.storage.sync.set(newTitle);

    chrome.storage.sync.get(list, function (data) {
        const storedTitles = data?.[list] ?? [];
        const tempObject = {}
        if (!storedTitles.some(title => title.imdbId === imdbId)) {
            storedTitles.push({ name, poster, imdbId });
            tempObject[list] = storedTitles;
            chrome.storage.sync.set(tempObject);
            const addBtn = document.getElementById("addButton");
            addBtn.setAttribute("disabled", "true");
            addBtn.textContent = "Added to watchlist";
        }
        else {
            console.log("Title is already in list");
        }
    });
}
document.getElementById("addButton").addEventListener("click", addToWatchlist);

function syncTitleData() {
    const newTitle = {}
    newTitle[imdbId] = {
        name,
        poster,
        description,
        runtime,
        genres,
        releaseDate,
        type
    };
    chrome.storage.sync.set(newTitle);
}
document.getElementById("syncButton").addEventListener("click", syncTitleData);

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
                // not on a tmdb title page
                if (chrome.runtime.lastError) {
                    chrome.storage.sync.get('watchManList', function (data) {
                        const storedTitles = data.watchManList ?? [];
                        if (storedTitles.length < 1) {
                            document.getElementById("title-found").style.display = "none";
                            document.getElementById("no-title").style.display = "flex";
                        }
                        let randTitle = storedTitles[Math.floor(Math.random() * storedTitles.length)];

                        document.getElementById("random-title-name").textContent = randTitle.name;
                        document.getElementById("random-title-poster").setAttribute("src", randTitle.poster);
                        document.getElementById("random-title").style.display = "flex";
                        document.getElementById("no-title").style.display = "none";
                    });
                }

                // on tmdb title page
                else {
                    if (response.status === 200) {
                        console.log('response', response);
                        name = response.scriptData.name;
                        poster = response.scriptData.image;
                        imdbId = response.imdbId;
                        description = response.bodyScript.props.pageProps.aboveTheFoldData.plot.plotText.plainText;
                        genres = response.bodyScript.props.pageProps.aboveTheFoldData.genres.genres.map(x => x.text);
                        releaseDate = response.bodyScript.props.pageProps.aboveTheFoldData.releaseDate;
                        runtime = response.bodyScript.props.pageProps.aboveTheFoldData.runtime.displayableProperty.value.plainText;
                        type = response.bodyScript.props.pageProps.aboveTheFoldData.titleType.displayableProperty.value.plainText;


                        chrome.storage.sync.get('watchManList', function (data) {
                            const storedTitles = data.watchManList ?? [];
                            if (storedTitles.some(title => title.imdbId === imdbId)) {
                                const addBtn = document.getElementById("addButton");
                                addBtn.setAttribute("disabled", "true");
                                addBtn.textContent = "Added to watchlist";
                            }
                        });


                        document.getElementById("found-title-name").textContent = name;
                        document.getElementById("found-title-poster").setAttribute("src", poster);
                        document.getElementById("title-found").style.display = "flex";
                        document.getElementById("no-title").style.display = "none";
                    }
                }
            }
        );
    } catch (e) {
        console.log(e);
    }
}

contactContentScript();