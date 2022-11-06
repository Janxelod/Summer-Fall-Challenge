import { createCamera } from "../components/camera.js";
import { createScene } from "../components/scene.js";

import { Loop } from "../systems/loop.js";
import { createRenderer } from "../systems/renderer.js";
import { Resizer } from "../systems/resizer.js";

import { createAlpaca } from "../objects/alpaca.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { AxesHelper, Vector2, Vector3 } from "three";
import { GLOBAL_CONFIG } from "../config.js";
import {
  addSequence,
  createCameracontroller,
  startSequences,
} from "../systems/cameraController.js";

import {
  changeOrbitMeshesMaterial,
  createOrbitMeshes,
} from "../objects/orbitMeshes.js";

import { createClouds } from "../objects/clouds.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";

import {
  addEffectGlitch,
  addEffectVignette,
  createComposer,
  removePass,
} from "../components/postprocessing.js";
import { createJarjacha } from "../objects/jarjacha.js";

let camera;
let renderer;
let scene;
let loop;
let cameraController;
let controls;

let orbitMeshes;
let clouds;
let alpaca;
let jarjacha;
let initialAlpacaPosition;

let resizer;

let composer;
class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene({ useFog: true, renderer: renderer });

    composer = createComposer(renderer, scene, camera);

    loop = new Loop(camera, scene, renderer, composer);
    container.append(renderer.domElement);

    clouds = createClouds();

    alpaca = createAlpaca();

    jarjacha = createJarjacha();

    orbitMeshes = createOrbitMeshes("models/AlpacaMarron.fbx", 500);

    loop.updatables.push(camera);
    loop.updatables.push(alpaca);

    scene.add(alpaca);

    initialAlpacaPosition = alpaca.position.clone();

    // if (GLOBAL_CONFIG.DEBUG) {
    //   scene.add(new AxesHelper(100));

    //   loop.updatables.push(GLOBAL_CONFIG.GetLogger());
    // }

    resizer = new Resizer(container, camera, renderer, composer);

    resizer.onResize = () => {
      this.render();
    };
  }

  setNoPixelated() {
   resizer.setNoPixelated();
  }

  startCameraSequence() {
    addSequence({
      to: { x: 3.2, y: 3.27, z: 12.67 },
      duration: 6000,
      easing: TWEEN.Easing.Cubic.In,
      onComplete: () => {
        controls.autoRotateSpeed = (30 / 6) * 2; // speed of 2 does an orbit in 30 secs
        controls.autoRotate = true;
        //controls.enabled = true;

        //alpaca.changeToDistortedMaterial();
      },
    });

    addSequence({
      to: { x: 1, y: 167, z: -5000 },
      delay: 3000,
      duration: 250,
      onStart: () => {
        //camera.position.z = -5000;

        controls.autoRotate = false;
        loop.updatables.push(clouds);
        scene.add(clouds);
      },
      onComplete: () => {
        alpaca.position.set(-67, -78, -5000 - 100);

        // removePass("PixelPass");
      },
    });

    addSequence({
      to: { x: 3.2, y: 3.27, z: 12.67 },
      duration: 10000,
      easing: TWEEN.Easing.Sinusoidal.Out,
      onStart: () => {
        // loop.updatables.push(clouds);
        // scene.add(clouds);
        loop.updatables.push(orbitMeshes);
        scene.add(orbitMeshes);

        alpaca.startFlying?.();
      },
      onComplete: () => {
        //addEffectSepia();

        controls.autoRotate = true;
        new TWEEN.Tween(alpaca.position)
          .to(initialAlpacaPosition, 1500)
          .start();
      },
      onUpdate: (object) => {
        if (alpaca.position.z < -100) {
          alpaca.position.set(object.x, object.y, object.z + 15);
        }
      },
    });

    addSequence({
      to: {},
      duration: 1500,
      onStart: () => {
        controls.autoRotateSpeed = (30 / 6) * 4 * 2; // speed of 2 does an orbit in 30 secs
        controls.autoRotate = true;
      },
      onComplete: () => {
        controls.autoRotate = false;
      },
    });

    addSequence({
      to: {},
      duration: 3000,
      delay: 3000,
      onStart: () => {
        addEffectVignette();
        addEffectGlitch();
      },
      onComplete: () => {
        removePass("EffectVignette");
        removePass("EffectGlitch");
        //removePass("EffectFilm");
        changeOrbitMeshesMaterial();

        alpaca.changeToDistortedMaterial?.();
      },
    });

    addSequence({
      to: {},
      duration: 1500 * 3,
      delay: 2000,
      onStart: () => {
        controls.autoRotateSpeed = (30 / 6) * 4 * 2;
        //removePass("EffectGammaCorrection");
        controls.autoRotate = true;
      },
      onComplete: () => {
        controls.autoRotate = false;
      },
    });

    addSequence({
      to: { x: 8.8, y: 8.8, z: 31 },
      duration: 6000,
      onStart: () => {
        // controls.autoRotateSpeed = (30 / 6) * 2 * 2;
        removePass("EffectGammaCorrection");
        scene.remove(alpaca);
        scene.add(jarjacha);
        // controls.autoRotate = true;
      },
      onComplete: () => {},
    });

    addSequence({
      to: { x: 1.84, y: 1.57, z: 6.86 },
      duration: 8000,
      onStart: () => {
        // controls.autoRotateSpeed = (30 / 6) * 2 * 2;
        //removePass("EffectFilm");
      },
      onComplete: () => {},
    });

    addSequence({
      to: { x: -5, y: -2, z: 377 },
      duration: 4000,
      onStart: () => {
        // controls.autoRotateSpeed = (30 / 6) * 2 * 2;
        //removePass("EffectFilm");
      },
      onComplete: () => {
        scene.remove(orbitMeshes);
      },
    });

    addSequence({
      to: { x: -5, y: 2, z: -6.86 },
      duration: 4000,
      onStart: () => {
        // controls.autoRotateSpeed = (30 / 6) * 2 * 2;
        //removePass("EffectFilm");
      },
      onComplete: () => {},
    });

    addSequence({
      to: {},
      duration: 1000,
      onStart: () => {
        let finalDestiny = new Vector3();
        finalDestiny = jarjacha.getWorldDirection(finalDestiny);
        finalDestiny.multiplyScalar(500);
        controls.target = jarjacha.position;
        new TWEEN.Tween(jarjacha.position).to(finalDestiny, 12000).start();
      },
      onComplete: () => {},
    });

    addSequence({
      to: {},
      delay: 5000,
      duration: 3000,
      onStart: () => {
        this.finishScene();
        console.log("End of last scene...");
      },
      onComplete: () => {
        window.location.reload();
      },
    });

    startSequences();
  }

  finishScene() {
    var div = document.getElementById("curtain");
    div.classList.add("scene-end");
    div.style.zIndex = 3;
  }

  initControls() {
    controls = new OrbitControls(camera, renderer.domElement);

    controls.minDistance = 2;
    controls.maxDistance = 5000;

    controls.enableDamping = true;

    controls.enablePan = false;
    controls.enableRotate = false;
    controls.enableZoom = false;

    controls.enabled = false;

    cameraController = createCameracontroller(camera, controls);
    loop.updatables.push(cameraController);
  }

  render() {
   composer.render();
   renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
