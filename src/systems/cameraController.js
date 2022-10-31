import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

const cameraController = {
  controls: null,
  camera: null,
  cameraSequences: [],
  tick(delta) {
    TWEEN.update();
    this.controls.update();
    //console.log("update tween");
  },
};

const createCameracontroller = (cam, controls) => {
  cameraController.controls = controls;
  cameraController.camera = cam;
  return cameraController;
};

const addSequence = (sequence) => {
  const currentTween = new TWEEN.Tween(cameraController.camera.position)
    .to(sequence.to, sequence.duration)
    .easing(sequence.easing || TWEEN.Easing.Quadratic.InOut)
    .delay(sequence.delay || 0)
    .onStart(function () {
      sequence.onStart?.();
    })
    .onUpdate(function (object) {
      sequence.onUpdate?.(object);
    })
    .onComplete(function () {
      sequence.onComplete?.();
    });

  cameraController.cameraSequences.push(currentTween);
};

const startSequences = () => {
  const cameraSequences = cameraController.cameraSequences;
  let prevTween;
  cameraSequences.forEach((currentTween) => {
    if (prevTween) {
      prevTween.chain(currentTween);
    }
    prevTween = currentTween;
  });

  cameraSequences[0].start();
};

export { createCameracontroller, addSequence, startSequences };
