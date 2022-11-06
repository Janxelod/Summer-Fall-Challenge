import { AudioListener, Audio, AudioLoader } from "three";
import { GLOBAL_CONFIG } from "./config.js";

import { World } from "./world/World.js";

const listener = new AudioListener();
const sound = new Audio(listener);
let loadSound = false;
let world;

function main() {
  const container = document.querySelector("#scene-container");
  world = new World(container);

  const startButton1 = document.getElementById("startButton1");
  const startButton2 = document.getElementById("startButton2");

  startButton1.addEventListener("click", init);
  startButton2.addEventListener("click", init);

  audioModulo();
}

function init(event) {
  if (!loadSound) return;
  
  if(event.srcElement.id === "startButton2")
  {
      world.setNoPixelated();
  }

  const overlay = document.getElementById("overlay");
  overlay.remove();

  //world.render();
  world.start();
  world.initControls();
  world.startCameraSequence();

  sound.play();
}

function audioModulo() {
  const fftSize = 128;

  const file = "../audio/Lonely-warrior.mp3";
  const loader = new AudioLoader();
  loader.load(file, function (buffer) {
    sound.setBuffer(buffer);
    loadSound = true;
  });
}

main();
