var connect = require('connect'),
    fs = require('fs'),
    io = require('socket.io').listen(1337),
    ImageUploader = require('image-uploader').ImageUploader;

connect(connect.static(__dirname + '/public')).listen(8000);

var img = new ImageUploader();


io.sockets.on('connection', function(socket) {

  socket.on('formInit', function(data) {
    console.log(data);
  });

  socket.on('setData', function(data) {
    var stream;
    if (data) {
    	stream = fs.createWriteStream('frames.js');
    } else {
      return;
    }

    stream.on('open', function() {
      stream.end('var frames = ' + JSON.stringify(data.frames) + ';', 'utf-8');
    });

    socket.emit('dataSet', data);
  });
});
