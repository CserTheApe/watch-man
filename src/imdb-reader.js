let name, image;

const imdbId = document.head.querySelector('meta[property="imdb:pageConst"]').content;
const scriptData = JSON.parse(document.head.querySelector('script[type="application/ld+json"]').textContent);
// console.log("script", skript);
const subsetOfScriptData = (({ name, image, description, duration, genre, aggregateRating, datePublished }) => ({ name, image, description, duration, genre, aggregateRating, datePublished }))(scriptData);
const bodyScript = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!!name || !!imdbId) {
    if (request.from === "background" && request.to === "content") {
      sendResponse({ imdbId, status: 200 });
    }
    else if (request.from === "popup" && request.to === "content") {
      sendResponse({
        imdbId,
        scriptData,
        bodyScript,
        status: 200
      });
    }
    else {
      sendResponse({ status: 204 });
    }
  }
  else {
    sendResponse({ status: 404 });
  }

});