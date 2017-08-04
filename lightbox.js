/**
 * @summary Lightbox class, displays images from json object pulled from Imgur.com
 *
 *
 * @since 0.0.1
 * @deprecated x.x.x Use new_function_name() instead.
 * @access private
 *
 * @class
 * @augments JSON of image objects
 *
 * @images images to be displayed in the lightbox
 * @currentIndex Current image displayed
 * @prevBtn A reference to the previous button
 * @nextBtn A reference to the next button
 * @infoIndex A reference to the infoIndex DOM Object
 * @infoLength A reference to the ingoLength DOM Object
 *
 * @_getImageURL Returns image URL based on index
 * @_getImageTitle Returns image title based on index
 * @_getImages Returns the images object
 * @_setImages Sets the images object
 * @_setCurrentImageIndex Sets the current index
 * @_getCurrentImageIndex Returns the current index
 * @_showThumbnails Renders the images object into the thumbnails
 * @_prevImage Renders the previous image
 * @_nextImage Renders the next image
 *
 */

class Lightbox {

  constructor(images) {
    this.images = images.data.images;
    this.currentIndex = 0;
    this.prevBtn = document.getElementById('btn--prev').addEventListener('click', this._prevImage.bind(this));
    this.nextBtn = document.getElementById('btn--next').addEventListener('click', this._nextImage.bind(this));
    this.infoIndex = document.getElementById('info__index').innerHTML = parseInt(this._getCurrentImageIndex(), 10) + 1;
    this.infoLength = document.getElementById('info__length').innerHTML = this._getImages().length;
    this._showThumbs();
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

  _loadInfo() {
    document.getElementById('info__index').innerHTML = parseInt(this._getCurrentImageIndex(), 10) + 1;
    document.getElementById('info__length').innerHTML = this._getImages().length;
  }

  _showThumbs() {
    let images = this._getImages();
    console.log(this)
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

  _prevImage() {
    let currentIndex = this._getCurrentImageIndex();

    if (currentIndex > 0) {
      let newIndex = parseInt(this._getCurrentImageIndex(), 10) - 1;
      this._setCurrentImageIndex(newIndex);
      document.getElementById('photo--image').style.backgroundImage = "url('" + this._getImageURL(newIndex) + "')";
      document.getElementById('photo--image').innerHTML = "";
      document.getElementById('photo--title').innerHTML = this._getImageTitle(newIndex) != "null" ? this._getImageTitle(newIndex) : "...";
      this._loadInfo();
    }
  }

  _nextImage() {
    let currentIndex = this._getCurrentImageIndex();

    if (currentIndex <= this._getImages().length) {
      let newIndex = parseInt(this._getCurrentImageIndex(), 10) + 1;
      this._setCurrentImageIndex(newIndex);
      document.getElementById('photo--image').style.backgroundImage = "url('" + this._getImageURL(newIndex) + "')";
      document.getElementById('photo--image').innerHTML = "";
      document.getElementById('photo--title').innerHTML = this._getImageTitle(newIndex) != "null" ? this._getImageTitle(newIndex) : "...";
      this._loadInfo();
    }
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
  }
}

function loadImage(e) {
  images._setCurrentImageIndex(e.target.dataset.index);
  document.getElementById('photo--image').style.backgroundImage = "url('" + e.target.src + "')";
  document.getElementById('photo--image').innerHTML = "";
  document.getElementById('photo--title').innerHTML = e.target.dataset.title != "null" ? e.target.dataset.title : "...";
  images._loadInfo();
}

/* Initialize after DOM is ready */
let init = function () {
  requestAlbum();
};

if (!!(window.addEventListener))
  window.addEventListener("DOMContentLoaded", init)
else // MSIE to be safe
  window.attachEvent("onload", init);

