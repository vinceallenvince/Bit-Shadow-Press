/**
 * Creates a new ImageUploader.
 *
 * @param {Object} opt_options A map of initial properties.
 * @constructor
 */
var ImageUploader = function(opt_options, callback) {

  var options = opt_options || {};

  this.inputId = options.inputId || 'imageFileInput';
  this.imageDisplayContainer = options.imageDisplayContainer || document.body;
  this.callback = callback;
}

/**
 * Adds an event listener to file input to request a new file system
 * when a file or files are selected.
 */
ImageUploader.prototype.init = function() {

  var me = this;

  document.getElementById(this.inputId).addEventListener('change', function(e) {
    (window.requestFileSystem || window.webkitRequestFileSystem).call(window, window.TEMPORARY,
        5*1024*1024, me.onInitFs.bind(me, document.querySelector('form'), this.files), me.onError);
  }, false);
};

/**
 * Iterates over items and saves file system object returned
 * from file system request.
 *
 * @param {Object} files A list of files retuned from file input.
 * @param {Object} fs The file system object.
 */
ImageUploader.prototype.onInitFs = function(form, files, fs) {

  var i, max, file,
      originX = form.querySelector('#imageOriginX').value,
      originY = form.querySelector('#imageOriginY').value,
      resolution = form.querySelector('#imageResolution').value;

  this.fs = fs;

  for (i = 0, max = files.length; i < max; i++) {
    file = files[i];
    this.writeFile(this.fs.root, file, originX, originY, resolution, i, files.length);
  }
};

/**
 * Writes a passed file to the file system. On successful write,
 * calls displayImage to visually confirm write.
 *
 * @param {String} parentDirectory The parent folder to contain the file.
 * @param {Object} file The file to write.
 */
ImageUploader.prototype.writeFile = function(parentDirectory, file, originX, originY, resolution, i, totalFiles) {

  var me = this;

  parentDirectory.getFile(file.name, {create: true, exclusive: false},
    function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.onwrite = function(e) {
          me.callback.call(me, fileEntry.toURL(), originX, originY, resolution, i, totalFiles);
        };
        fileWriter.onerror = function(e) {
          me.onError();
        };
        fileWriter.write(file);
      }, me.onError);
    },
    me.onError
  );
};

/**
 * Called on any file system error.
 */
ImageUploader.prototype.onError = function(e) {

  var msg = '';

  switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
          msg = 'QUOTA_EXCEEDED_ERR';
          break;
      case FileError.NOT_FOUND_ERR:
          msg = 'NOT_FOUND_ERR';
          break;
      case FileError.SECURITY_ERR:
          msg = 'SECURITY_ERR';
          break;
      case FileError.INVALID_MODIFICATION_ERR:
          msg = 'INVALID_MODIFICATION_ERR';
          break;
      case FileError.INVALID_STATE_ERR:
          msg = 'INVALID_STATE_ERR';
          break;
      default:
          msg = 'Unknown Error';
          break;
  }

  console.log('Error: ' + msg);
};
