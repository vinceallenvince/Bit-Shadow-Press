var connect = require('connect'),
    fs = require('fs'),
    io = require('socket.io').listen(1337),
    EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();

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

//

var five = require('johnny-five'),
    board = new five.Board();

board.on('ready', function() {

   // Create a new `potentiometer` hardware instance.
  potentiometer = new five.Sensor({
    pin: 'A2',
    freq: 60
  });

  // Inject the `sensor` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    pot: potentiometer
  });

  // "data" get the current reading from the potentiometer
  potentiometer.on('data', function() {
    emitter.emit('potFrameRate', this.value);
  });

});