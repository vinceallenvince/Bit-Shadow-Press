var connect = require('connect'),
    fs = require('fs'),
    io = require('socket.io').listen(1337),
    EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();

var map = function(value, min1, max1, min2, max2) { // returns a new value relative to a new range
  var unitratio = (value - min1) / (max1 - min1);
  return (unitratio * (max2 - min2)) + min2;
};

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
      socket.emit('dataSet', data);
    });
  });

  // control frame rate slider
  emitter.on('potFrameRate', function(data) {
    socket.emit('potFrameRate', data);
  });

});