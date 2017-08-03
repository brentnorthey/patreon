class Lightbox {

  constructor(images) {
    this.images = images.data.images;
  }

  _getImageURL(index) {
    console.log(this.images[index].link);
  }

  _getImageTitle(index) {
    console.log(this.images[index].description);
  }

  _getImages() {
    return this.images;
  }

  _showThumbs() {
    let images = this._getImages();
    let output = [];
    images.forEach(function (element, index) {

      let image = document.createElement('img');
      image.setAttribute('src', element.link);
      image.setAttribute('class', 'filmstrip__thumb');
      image.setAttribute('data-imageid', index);
      document.getElementById('filmstrip').appendChild(image);
    });
  }
}

class Image {
  constructor(image) {
    this.image = image;
  }

  _setImage(image) {
    this.image = image;
  }

  _getImage(image) {
    return this.image;
  }

  _nextImage() {
    console.log("load next image called");
  }

  _previousImage() {
    console.log("load previous called");
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
    images._showThumbs();
  }
}

/* Initialize after DOM is ready */
let execute = function () {
  requestAlbum();
};

if (!!(window.addEventListener))
  window.addEventListener("DOMContentLoaded", execute)
else // MSIE to be safe
  window.attachEvent("onload", execute)

/*
  btn.addEventListener('click', function () {
    this.style.display = 'none';
    request.send();
  });

*/

