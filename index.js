const Leap = require('leapjs');
const glMatrix = require('gl-matrix');
const { Controller } = Leap;

const controllerOptions = {
  host: '127.0.0.1',
  port: 6437,
  enableGestures: false,
  frameEventName: 'deviceFrame',
  useAllPlugins: false
};

const printFingersAngles = (matrix) => {
  console.log('| finger | alpha | beta | gamma |');
  matrix.forEach(({ type, alpha, beta, gamma }) => {
    console.log(`| ${type} | ${alpha} | ${beta} | ${gamma} |`);
  })
}

const FINGER_NAMES = ['THUMB', 'INDEX', 'MIDDLE', 'RING', 'PINKY'];

const calculateAngle = (v1, v2) => (glMatrix.vec3.angle(v1, v2) * 180 / Math.PI).toPrecision(2);

const sampleAngles = () => {
  const { fingers } = controller.frame();
  const samples = fingers
    .map(({ metacarpal, proximal, medial, distal, type }) => {
      const alpha = calculateAngle(metacarpal.direction(), proximal.direction());
      const beta = calculateAngle(proximal.direction(), medial.direction());
      const gamma = calculateAngle(medial.direction(), distal.direction());
      return { type, alpha, beta, gamma };
    });
  printFingersAngles(samples);
  return samples
}

const controller = new Controller(controllerOptions)
  .on('connect', () => { setInterval(sampleAngles, 500); })
  .connect();
