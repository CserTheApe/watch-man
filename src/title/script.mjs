import { MONTH_NAMES } from "../constants.js";

const urlParams = new URLSearchParams(window.location.search);
const imdbId = urlParams.get('imdbId');

console.log('imdbid',imdbId);

chrome.storage.sync.get(imdbId, function (data) {
    const titleData = data[imdbId];

    if(!titleData) {
        // window.location.assign(`https://www.imdb.com/title/${imdbId}/`);
    }

    document.getElementById("imdb-link").setAttribute("href", `https://www.imdb.com/title/${imdbId}/`);

    document.getElementById("header").textContent = titleData.name;
    document.getElementById("title-poster").setAttribute("src", titleData.poster);
    document.getElementById("subheader").textContent = `${titleData.runtime} | ${titleData.type}`;
    document.getElementById("release-date").textContent = `${titleData.releaseDate.day} ${MONTH_NAMES[titleData.releaseDate.month]} ${titleData.releaseDate.year}`;
    document.getElementById("description").textContent = titleData.description;

    for(let genre of titleData.genres) {
        const badge = document.createElement("span");
        badge.classList.add('genre-badge');
        badge.textContent = genre;
        document.getElementById("genres").appendChild(badge);
    }
    
});

// document.getElementById("header").textContent = myParam;