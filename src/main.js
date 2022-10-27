import {
Camera,
Group,
Scene,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { World } from './world/World.js';

function main() {
   // Get a reference to the container element
   const container = document.querySelector('#scene-container');
 
   // 1. Create an instance of the World app
   const world = new World(container);
 
   // 2. Render the scene
   //world.render();
   world.start();
   console.log("Creating the world");
 }

// call main to start the app
main();