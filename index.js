const Leap = require('leapjs');
const { Controller } = Leap;

const controllerOptions = {
  host: '127.0.0.1',
  port: 6437,
  enableGestures: false,
  frameEventName: 'deviceFrame',
  useAllPlugins: false
};

var controller = new Controller(controllerOptions)
  .connect()
  .on('frame', frame => { console.log(frame); });
