class Lightbox {

  constructor(images) {
    this.images = images.data.images;
    this.currentIndex = 0;
  }

  _getImageURL(index) {
    return this.images[index].link;
  }

  _getImageTitle(index) {
    return this.images[index].description;
  }

  _getImages() {
    return this.images;
  }

  _setImages(images) {
    this.images = images.data.images;
  }

  _setCurrentImageIndex(index) {
    this.currentIndex = index;
  }

  _getCurrentImageIndex() {
    return this.currentIndex;
  }

  _showThumbs() {
    let images = this._getImages();
    images.forEach(function (element, index) {

      let image = document.createElement('img');
      image.setAttribute('src', element.link);
      image.setAttribute('class', 'filmstrip__thumb');
      image.setAttribute('data-index', index);
      image.setAttribute('data-title', element.description);
      image.addEventListener('click', loadImage);
      document.getElementById('filmstrip').appendChild(image);
    });
  }
}

function loadImage() {
  images._setCurrentImageIndex(this.dataset.index);
  document.getElementById('photo--image').style.backgroundImage = "url('"+this.src+"')";
  document.getElementById('photo--title').innerHTML = this.dataset.title;
}

function prevImage() {
  let currentIndex = images._getCurrentImageIndex();

  if (currentIndex > 0) {
    let newIndex = parseInt(images._getCurrentImageIndex(),10) - 1;
    images._setCurrentImageIndex(newIndex);
    document.getElementById('photo--image').style.backgroundImage = "url('"+ images._getImageURL(newIndex)+"')";
    document.getElementById('photo--title').innerHTML = images._getImageTitle(newIndex);
  }
}

function nextImage() {
  let currentIndex = images._getCurrentImageIndex();

  if (currentIndex < images._getImages().length) {
    let newIndex = parseInt(images._getCurrentImageIndex(),10) + 1;
    images._setCurrentImageIndex(newIndex);
    document.getElementById('photo--image').style.backgroundImage = "url('"+ images._getImageURL(newIndex)+"')";
    document.getElementById('photo--title').innerHTML = images._getImageTitle(newIndex);
  }
}

let album_id = 'nFMJR';
let api_key = '95535bfe33eb803';
let request_url = 'https://api.imgur.com/3/album/' + album_id;
let images;

function requestAlbum() {
  let req = new XMLHttpRequest();

  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      processRequest(req.responseText);
    } else {
      console.log('Error with Imgur Request.');
    }
  };

  req.open("GET", request_url, true); // true for asynchronous
  req.setRequestHeader('Authorization', 'Client-ID ' + api_key);
  req.send(null);
}

function processRequest(response_text) {
  if (response_text == "Not found") {
    console.log("Imgur album not found.");
  } else {
    let json = JSON.parse(response_text);
    images = new Lightbox(json);
    document.getElementById('btn--prev').addEventListener('click', prevImage);
    document.getElementById('btn--next').addEventListener('click', nextImage);
    images._showThumbs();
  }
}

/* Initialize after DOM is ready */
let init = function () {
  requestAlbum();
};

if (!!(window.addEventListener))
  window.addEventListener("DOMContentLoaded", init)
else // MSIE to be safe
  window.attachEvent("onload", init);

