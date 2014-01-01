var connect = require('connect'),
    fs = require('fs'),
    io = require('socket.io').listen(1337),
    FSUpload = require('fsupload').FSUpload,
    PixelPress = require('pixelpress').PixelPress;

connect(connect.static(__dirname + '/public')).listen(8000);

io.sockets.on('connection', function(socket) {

  socket.emit('connected');
  
  socket.on('setData', function(data) {
    
    var stream;
    
    if (data) {
    	stream = fs.createWriteStream(__dirname + '/public/frames.js');
    } else {
      return;
    }

    stream.on('open', function() {
      stream.end('var frames = ' + JSON.stringify(data) + ';', 'utf-8');
      socket.emit('dataSet', data.length);
    });
  });
});