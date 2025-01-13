function createTitle(title) {
    const container = document.createElement("div");
    container.classList.add('title-card');

    const poster = document.createElement("img");
    poster.setAttribute("src", title.poster);
    poster.setAttribute("width", "150px");
    poster.setAttribute("height", "200px");
    const headName = document.createElement("h2");
    headName.textContent = title.name;
    
    const listTag = document.createElement("p");
    listTag.textContent = title.list;
    container.appendChild(poster);
    container.appendChild(headName);
    container.appendChild(listTag);

    container.addEventListener("click", () => {
        const params = new URLSearchParams();
        params.append("imdbId", title.imdbId);
        const queryString = params.toString();
        window.location.assign(`../title/index.html?${queryString}`);
    })
    return container;
}

const contentDiv = document.getElementById("title-grid");

chrome.storage.sync.get('watchManList', function (data) {
    const storedTitles = data.watchManList ?? [];

    storedTitles.forEach((title) => {
        const container = createTitle(title);
        contentDiv.appendChild(container);
    });
});