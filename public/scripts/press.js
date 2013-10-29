/*global document, exports */
/**
 * Creates a new Press.
 *
 * @constructor
 */
function Press(opt_options) {

  var options = opt_options, img;

  this.context = options.context || null;
  this.resolution = parseInt(options.resolution, 10) || 8;
  this.origin = options.origin || 'center';
  this.src = options.src || null;
  this.debug = !!options.debug;
  this.frames = [];

}

Press.prototype.name = 'Press';

Press.prototype.init = function(fileProps) {

  var me = this,
      img = new Image();

  this.src = fileProps.src;
  this.originX = fileProps.originX;
  this.originY = fileProps.originY;
  this.resolution = parseInt(fileProps.resolution, 10);
  this.index = fileProps.index;
  this.totalFiles = fileProps.totalFiles;
  this.socket = fileProps.socket;

  img.src = this.src;
  img.onload = function() {
    me.getImageData.call(me, img, me.resolution);
  };
};

Press.prototype.getImageData = function(img, resolution) {

  // clear canvas first
  this.context.clearRect(0, 0, 1000, 1000);

  // draw image in canvas
  this.context.drawImage(img, 0, 0);

  var imgData = this.context.getImageData(0, 0, img.width, img.height);
  if (imgData) {
    this.log('Getting data for ' + imgData.width + ' x ' + imgData.height + ' image. ' +
        imgData.width * imgData.height + ' total pixels.', this.debug);
    this.processImageData(imgData, resolution);
  }
};

Press.prototype.processImageData = function(imgData, resolution) {

  var x, y, red, green, blue, alpha, str,
      originOffsetX, originOffsetY, items = [];

  switch (this.originX) {
    case 'left':
      originOffsetX = 0;
      break;
    case 'center':
      originOffsetX = -imgData.width / 2;
      break;
    case 'right':
      originOffsetX = -imgData.width;
      break;
  }

  switch (this.originY) {
    case 'top':
      originOffsetY = 0;
      break;
    case 'center':
      originOffsetY = -imgData.height / 2;
      break;
    case 'bottom':
      originOffsetY = -imgData.height;
      break;
  }

  // dividing by four b/c image data is separated into 4 components. (red, green, blue, alpha)
  this.log('Processing image ' + (this.frames.length + 1) + ' of ' + this.totalFiles);
  this.log('Processing ' + (imgData.data.length / 4) + ' pixels.');
  this.log('Breaking into chunks of ' + resolution + ' X ' + resolution +
      ' pixels in a ' + (imgData.width / resolution) + ' X ' + (imgData.height / resolution) + ' grid of ' +
      ((imgData.width / resolution) * (imgData.height / resolution)) + ' blocks.', this.debug);

  for (y = 0; y < imgData.height; y += resolution) {
    for (x = 0; x < imgData.width; x += resolution) {

      red = imgData.data[((y * (imgData.width * 4)) + (x * 4)) + 0];
      green = imgData.data[((y * (imgData.width * 4)) + (x * 4)) + 1];
      blue = imgData.data[((y * (imgData.width * 4)) + (x * 4)) + 2];
      alpha = imgData.data[((y * (imgData.width * 4)) + (x * 4)) + 3];

      // do not add transparent blocks
      if (alpha !== 0 || (x + originOffsetX === 0 && y + originOffsetY === 0)) { // always add the first pixel block
        items.push({
          x: Math.floor((x + originOffsetX) / (resolution * 0.5)),
          y: Math.floor((y + originOffsetY) / (resolution * 0.5)),
          color: [red, green, blue],
          opacity: alpha,
          scale: 1
        });
      }
    }
  }

  this.frames.push({
    items: items
  });

  if (this.frames.length === this.totalFiles) {
    console.log(this.frames);
    if (this.socket) {
      this.socket.emit('setData', {
        frames: this.frames
      })
    }
  }

};

Press.prototype.log = function(msg) {
  if (this.debug && console) {
    console.log(msg);
  }
};
