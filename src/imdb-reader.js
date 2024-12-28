let name, image;

const imdbId = document.head.querySelector('meta[property="imdb:pageConst"]').content;
const skript = JSON.parse(document.head.querySelector('script[type="application/ld+json"]').textContent);
// console.log("script", skript);
name = skript.name;
image = skript.image;


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!!name || !!imdbId) {
    if (request.from === "background" && request.to === "content") {
      sendResponse({ imdbId, status: 200 });
    }
    else if (request.from === "popup" && request.to === "content") {
      console.log("called from popup");
      sendResponse({
        imdbId,
        name,
        image,
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