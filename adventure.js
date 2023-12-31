/*
* ADVENTURE.JS by exitcas
* MODERN PLAYER, FOR A NICHE GENRE
*
* vAlpha1.0
* GitHub: https://github.com/exitcas/adventure.js
* Under the MIT License
*/

class Adventure {
  static VERSION = "Adventure.js vAlpha1.0 (2023-10-07)";
  header = document.createElement("h2");
  img = document.createElement("img");
  body = document.createElement("div");
  nav = document.createElement("ul");
  controls = document.createElement("p");

  constructor(setup) {
    this.advId = setup.advId;
    this.screensFolder = setup.screensFolder;
    this.initialScreen = setup.initialScreen;
    
    if (typeof setup.loading !== "undefined")
      this.loadingScreen = setup.loadingScreen;
    else
      this.loadingScreen = "./loading.gif";
    
    this.showLoadingScreen();

    this.advTag = document.getElementById(this.advId);

    this.advTag.className = "adventure";
    this.header.className = "header";
    this.img.className = "img";
    this.body.className = "body";
    this.nav.className = "nav";
    this.controls.className = "controls";

    this.controls.style = "display: none;";
    this.controls.innerHTML = `<a href="#" onclick="${this.advId}.bookmark();" title="Bookmark: Saves the screen you are, so you can visit it later.">Bookmark</a> - <a href="#" onclick="${this.advId}.autoBookmark();" title="COMING SOON! Auto-bookmark: Saves the screen you are when as soon as you load it, so you can visit it later.">Auto-bookmark</a> - <a href="#" onclick="${this.advId}.load();" title="Load: Loads saved page.">Load</a> - <a href="#" onclick="${this.advId}.nukeData();" title="Nuke data: Deletes all data (bookmarks and auto-bookmarks).">Nuke data</a>`;

    this.bookmarkId = this.advId + "Bookmark";
    this.autoBookmarkId = this.advId + "Bookmark";

    if (this.#getURItag() == "")
      this.setScreen(this.initialScreen);
    else
      this.setScreen(this.#getURItag());
  }

  showLoadingScreen() {
    this.header.innerHTML = "...";
    this.img.setAttribute("style", `background: center / contain no-repeat black url('${this.loadingScreen}');`);
    this.img.setAttribute("alt", "...");
    this.img.setAttribute("title", "...");
    this.resetImgAttributes(this.img);
    this.nav.innerHTML = "";
    this.body.innerHTML = "";
    this.controls.style = "display: none;";
  }

  setScreen(screenId) {
    var request = new XMLHttpRequest();

    this.showLoadingScreen();
    this.screenId = screenId;
    this.#setURItag(screenId);

    request.open("GET", this.screensFolder + encodeURI(screenId) + ".json", true);
    request.send();

    request.onloadend = () => {
      if (request.status != 200) {
        this.advTag.appendChild(this.header);
        this.header.innerText = "Screen not found";
      } else {
        this.#renderScreen(request);
      }
    };
  }

  hideScreen() {
    this.advTag.removeChild(this.header);
    this.advTag.removeChild(this.img);
    this.advTag.removeChild(this.body);
    this.advTag.removeChild(this.nav);
    this.advTag.removeChild(this.controls);
  }

  showScreen() {
    this.advTag.appendChild(this.header);
    this.advTag.appendChild(this.img);
    this.advTag.appendChild(this.body);
    this.advTag.appendChild(this.nav);
    this.advTag.appendChild(this.controls);
  }

  #renderScreen(request) {
    var screenData = JSON.parse(request.response),
      optionLi,
      optionA;

    this.header.innerHTML = screenData["header"];

    if (typeof screenData["img"] !== "undefined" && typeof screenData["img"]["src"] !== "undefined") {
      this.img.src = screenData["img"]["src"];

      if (typeof screenData["img"]["alt"] !== "undefined")
        this.img.alt = screenData["img"]["alt"];
      else
        this.img.alt = screenData["img"]["src"];

      if (typeof screenData["img"]["title"] !== "undefined")
        this.img.title = screenData["img"]["title"];
    }

    this.body.innerHTML = screenData["body"];
    this.nav.innerHTML = "";

    for (var i = 0; i < screenData["options"].length; i++) {
      optionLi = document.createElement("li");
      optionA = document.createElement("a");
      optionA.innerText = screenData["options"][i][1];
      optionA.setAttribute("onclick", `${this.advId}.setScreen('${screenData["options"][i][0]}');`);
      optionLi.appendChild(optionA);
      this.nav.appendChild(optionLi);
    }

    this.controls.style = "display: block;";
    this.showScreen();
  }

  
  bookmark() {
    this.bookmarkData = this.screenId;
  }
  autoBookmark() {
    /*localStorage.setItem(this.autoBookmarkId, true); this.bookmark();*/
    alert("WIP! Coming soon!");
  }
  load() {
    if (typeof localStorage.getItem(this.bookmarkId) === "undefined")
      alert("No bookmarked element");
    else
      setScreen(localStorage.getItem(this.bookmarkId));
  }
  nukeData() {
    localStorage.removeItem(this.bookmarkId);
    localStorage.removeItem(this.autoBookmarkId);
    alert("Data nuked!");
  }
  

  get bookmarkData() {
    return localStorage.getItem(this.bookmarkId);
  }
  set bookmarkData(data) {
    localStorage.setItem(this.bookmarkId, data);
  }

  
  resetImgAttributes(img) {
    img.src = "";
    img.alt = "";
    img.title = "";
  }

  #getURItag() {
    var tag = window.location.href;
    tag = tag.split("#");

    if (tag.length == 1)
      tag = "";
    else
      tag = tag[1];

    return tag;
  }

  #setURItag(tag) {
    var url = window.location.href;
    url = url.split("#");

    if (url.length == 1)
      url.push(tag);
    else
      url[1] = tag;

    url = url.join("#");
    window.location.href = url;
  }
}