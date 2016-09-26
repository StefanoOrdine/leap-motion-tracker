const Leap = require('leapjs');
const glMatrix = require('gl-matrix');
const { Controller } = Leap;

Leap.plugin('fingersAngles', () => {
  return {
    hand: hand => {
      hand.fingersAngles = hand.fingers
        .map(({ type, metacarpal, proximal, medial, distal }) => {
          const alpha = angle(metacarpal.direction(), proximal.direction());
          const beta = angle(proximal.direction(), medial.direction());
          const gamma = angle(medial.direction(), distal.direction());

          return { type, alpha, beta, gamma };
        });
    }
  };
});

const controllerOptions = {
  host: '127.0.0.1',
  port: 6437,
  enableGestures: false,
  frameEventName: 'deviceFrame',
  useAllPlugins: false
};

const FINGER_NAMES = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];

const angle = (v1, v2) => ((Math.PI - glMatrix.vec3.angle(v1, v2)).toPrecision(2));

const degrees = angle => ((angle * 180 / Math.PI).toPrecision(3));
const printFingersDegreesAnglesMatrix = (handId, angleMatrix = []) => {
  console.log(`${handId}\t|  α\t|  β\t|  γ\t`);
  angleMatrix.forEach(({ type, alpha, beta, gamma }) => {
    console.log(
      `${FINGER_NAMES[type]}\t| ${degrees(alpha)}°\t| ${degrees(beta)}°\t| ${degrees(gamma)}° `
    );
  })
  console.log('-----------------------------');
}

const anglesMatrix = () => {
  const { hands } = controller.frame();
  const matrix = hands.map(({ id, fingersAngles }) => ({ id, fingersAngles }));

  matrix.forEach(({ id, fingersAngles }) => printFingersDegreesAnglesMatrix(id, fingersAngles));

  return matrix;
}

const enqueueHandStatus = anglesMatrix;

const controller = new Controller(controllerOptions)
  .use('fingersAngles')
  .on('connect', () => { setInterval(enqueueHandStatus, 500); })
  .connect();
