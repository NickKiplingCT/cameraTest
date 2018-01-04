(function () {

  /**
     * Manage and list photos
     * @attribute {number} [captureWidth] - Width restriction on captured photos
     * @attribute {number} [captureHeight] - Height restriction on captured photos
     * @attribute {number=50|75|90|100} [captureQuality] - QUality setting for captured photos
     * @attribute {string} [captureCategory] - Optional category identifier to assign to photos when captured.
     * @attribute {string} [displayCategory] - Optional category on which to filter display of photos
     * @attribute {number} [maxPhotos] - Maximum number of photos that can be captured in this category (default is 3)
     * @event captureComplete - Fired when a photo has been captured
     * @event editPhoto - Fired when user selects edit option
     * @event maxPhotosTaken - Fired when we have taken the maximum number of photos in this category
     */
  customElements.define("photo-manager", class PhotoManager extends HTMLElement {

    /*
        Please note:

        This component currently relies on photos being stored in a particular structure. This needs to
        be made configurable.

        Storage location: cti.store.media.photos
        This array will maintain a record describing each photo in the following object structure:

        {
        	"id": string           // a unique ID to represent the photo - allows us to delete against a filtered list etc
            "src": string          // the file system url of the photo
            "category": string     // category of the photo - used in filtering etc
            "description": string  // user entered description
            "filename": string     // assignable filename (for integration)
            "uploaded": boolean		// has the image been transferred to the server
            "modified": boolean		// has the data been modified
        }

        */

    constructor(self) {
      self = super(self);
      self._initialized = false;
      return self;
    }

    static get observedAttributes() {
      return ["captureWidth", "captureHeight", "captureQuality", "captureCategory", "displayCategory", "captureComplete"]
    }

    connectedCallback() {
      this._initialized = true;
      this._buildElements();
      this._render();
    }

    attributeChangedCallback(attrName) {
    }

    /**
         * Take a photo
         * @param {string} [filename] - A filename to allocate to the capture photo
         */
    takePhoto(filename) {
      if (cti.store.media === undefined && cti.store.media.photos === undefined) {
        cti.store.media.photos = [];
      }

      var instance = this;         
      if (instance._maxPhotosTaken()) {
        return false;
      }

      var d = moment().format('DD MMM YYYY HH:mm');
      var n = d.getTime();
      var id = "job-" + n;
      var thisPhoto = { 
        "id": id, 
        "src": id + ".jpg", 
        "category": instance.getAttribute("captureCategory") || "(none)",
        "description": "",
        "date": d,
        "internalName": id + ".jpg",
        "uploaded": false,
        "modified": false
      }

      function addPhoto() {
        cti.store.media.photos.push(thisPhoto);
        // Display the photo in the UI
        instance._renderPhoto(thisPhoto);
        instance._fireEvent("captureComplete");
        // Run the check to see if we've taken max number of photos
        instance._maxPhotosTaken();
      }

      if (!window.cordova) {
        thisPhoto.src = "data:image/gif;base64,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";
        addPhoto();
      }
      else {
        // We're on device 

        // TODO Use the proper attributes
        window.navigator.camera.getPicture(onCameraSuccess, onCameraError, {
          quality: instance.getAttribute("captureQuality") || 75,
          destinationType: 1,
          sourceType: 1,
          allowEdit: false,
          encodingType: 0,
          saveToPhotoAlbum: false,
          correctOrientation: true,
          targetWidth: instance.getAttribute("captureWidth") || 1024,
          targetHeight: instance.getAttribute("captureHeight") || 768,
          cameraDirection: 0
        }); 

        function onCameraSuccess(img) {
          console.log('debug:: Camera got photo: %s', img);
          movePhoto(img);
        }
        function onCameraError(r) {
          console.log('error:: Camera error: %s', r);
        }
        function movePhoto(file) {
          window.resolveLocalFileSystemURI(file, gotImage, resOnError);
        }
        function resOnError(error) {
          console.log('error:: %s', JSON.stringify(error));
        }
        function gotImage(entry) {
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
                                   function(filesys) {
            entry.moveTo(filesys.root, thisPhoto.internalName, function(new_entry) {
              thisPhoto.src = new_entry.toURL();
              addPhoto();
            }, 
                         function(e2) {
              console.log('debug:: File system error: %s', JSON.stringify(e2));
            });
          }, 
                                   function(e1) {
            console.log('error:: File system error: %s', JSON.stringify(e1));
          });
        } 
      }      
    }

    /**
         * Delete a photo
         * @param {string} id - The internal id of the photo to remove
         */
    deletePhoto(id) {
      this._doDeletePhoto(id);
    }

    /**
         * Clear photos
         */
    clearPhotos() {
      alert('Clear photos - not yet implemented');
    }

    deletePhotoHandler(e) {
      e = e || window.event;
      var targ = e.target || e.srcElement;
      var id = targ.getAttribute("data-photo-id");
      var that = document.getElementsByTagName('photo-manager')[0];
      that._doDeletePhoto(id);
    }

    editPhotoHandler(e) {
      e = e || window.event;
      var targ = e.target || e.srcElement;
      var id = targ.getAttribute("data-photo-id");
      var that = document.getElementsByTagName('photo-manager')[0];
      var detail = { "id": id, "photosContainer": cti.store.media.photos };
      if (cti.fn_edit_photo !== undefined) {
        cti.fn_edit_photo(detail);
      }
      else {
        that._fireEvent("editPhoto", detail);
      }
    }

    _doDeletePhoto(id) {
      var index = undefined;
      for (var k in cti.store.media.photos) {
        if (cti.store.media.photos[k].id == id) {
          index = k;
          break;
        }
      }

      if (index === undefined) {
        console.log("debug:: Photo id " + id + " not found for deletion");
        return false;
      }

      var elem = document.getElementById(id);
      if (!window.cordova) {
        cti.store.media.photos.splice(index, 1);
        if(cti.store.media.photos.length === 0) {
          delete cti.store.media.photos;
          cti.utils.updatePage();
        } 
        elem.remove();
        return false;
      }

      // TODO Remove from the file system
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
                               function(fileSys) { 
        window.resolveLocalFileSystemURI(cti.store.media.photos[index].src, function(entry) {
          entry.remove(function(){
            cti.store.media.photos.splice(index, 1);
            elem.remove();
          },function(e1){
            console.log("error:: Problem removing file - " + JSON.stringify(e1));
          },function(){
            console.log("error:: Problem removing file - probably does not exist");
          });
        }, function(e2) {
          console.log("error:: Problem resolving file URL - " + JSON.stringify(e2));
        });
      },
                               function(e3) {
        console.log("error:: Problem getting file system - " + JSON.stringify(e3));
      });
    }

    _maxPhotosTaken() {
      // Check that we're able to take more photos
      var category = this.getAttribute("captureCategory");
      var maxPhotos = this.getAttribute("maxPhotos") || 3;
      var photosTaken = 0;
      for (var k in cti.store.media.photos) {
        if (category === undefined || category == null || category.toLowerCase() == cti.store.media.photos[k].category.toLowerCase()) {
          photosTaken++;
        }
      }
      var result = (maxPhotos === 0) || (photosTaken >= maxPhotos);
      if (result) {
        this._fireEvent("maxPhotosTaken", { "maxPhotos": maxPhotos });
      }
      return result;
    }

    _buildElements() {
      if (cti.store.media === undefined) {
        cti.store.media = { }
      }
      let html = '<div id="photoArea"></div>';
      this.innerHTML = html;
    }

    _render() {
      if (!this._initialized) return;

      var displayCategory = this.getAttribute("displayCategory");

      if (cti.store.media.photos !== undefined) {
        for (var k in cti.store.media.photos) {
          // Display all photos if we've not specified a display category
          if (displayCategory === undefined || displayCategory === null || displayCategory.toLowerCase() == ccti.store.media.photos[k].category.toLowerCase()) {
            this._renderPhoto(cti.store.media.photos[k]);
          }
        }
      }
    }

    _renderPhoto(photoObject) {
      if (photoObject.category === undefined) { photoObject.category = "(not set)"; }
      if (photoObject.date === undefined) { photoObject.date = new Date(); }

      var photoRow = document.createElement('div');
      photoRow.setAttribute("data-photo-id", photoObject.id);
      photoRow.className = 'photo-row';
      photoRow.id = photoObject.id;

      var photoContainer = document.createElement('div');
      photoContainer.className = 'photo-container';

      var photoInfoContainer = document.createElement('div');
      photoInfoContainer.className = 'photo-info-container';

      var photoInfoBanner = document.createElement("div");
      photoInfoBanner.className = 'photo-info-banner';

      var descriptionOption = document.createElement("span");
      descriptionOption.className = 'description-option';
      descriptionOption.innerHTML = 'Edit...';
      descriptionOption.setAttribute("data-photo-id", photoObject.id);
      descriptionOption.onclick = this.editPhotoHandler;

      /*
          	var deleteOption = document.createElement("span");
    	    deleteOption.className = 'delete-option';
          	deleteOption.innerHTML = 'Delete';
          	deleteOption.setAttribute("data-photo-id", photoObject.id);
          	deleteOption.onclick = this.deletePhotoHandler;
			*/

      // Add the info elements
      var categoryInfo = document.createElement("div");
      categoryInfo.className = 'photo-info';
      categoryInfo.innerHTML = '<span>Category</span>' + photoObject.category;

      var dateInfo = document.createElement("div");
      dateInfo.className = 'photo-info';
      dateInfo.innerHTML = '<span>Date</span>' + photoObject.date;

      var notesInfo = document.createElement("div");
      notesInfo.className = 'photo-info';
      notesInfo.innerHTML = '<span>Notes</span>' + (photoObject.description || "(no description)");

      var img = document.createElement('img');
      img.src = photoObject.src;
      photoContainer.appendChild(img);
      photoInfoBanner.appendChild(descriptionOption);
      //photoInfoBanner.appendChild(deleteOption);
      photoInfoContainer.appendChild(photoInfoBanner);
      photoInfoContainer.appendChild(categoryInfo);
      photoInfoContainer.appendChild(dateInfo);
      photoInfoContainer.appendChild(notesInfo);
      photoRow.appendChild(photoContainer);
      photoRow.appendChild(photoInfoContainer);

      // Add to page
      var container = this.childNodes[0];
      container.appendChild(photoRow);
    }

    _fireEvent(eventName, detail) {
      if (!this._initialized) return;
      this.dispatchEvent(new CustomEvent(eventName, { 'detail': detail }));
    }      
  });

})();