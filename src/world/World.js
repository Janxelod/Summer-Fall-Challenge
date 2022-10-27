import { createCamera } from '../components/camera.js';
import { createCube } from '../components/cube.js';
import { createLights } from '../components/lights.js';
import { createScene } from '../components/scene.js';

import { Loop } from '../systems/loop.js';
import { createRenderer } from '../systems/renderer.js';
import { Resizer } from '../systems/resizer.js';

import { createAlpaca} from "../objects/alpaca.js";

let camera;
let renderer;
let scene;
let loop;

class World {
   // 1. Create an instance of the World app
   constructor(container) {
      camera = createCamera();
      scene = createScene();
      renderer = createRenderer();
      loop = new Loop(camera, scene, renderer);
      container.append(renderer.domElement);
      
      const cube = createCube({ color: 'purple' });
      const cube2 = createCube({ color: 'green' });
      const light = createLights();

      const alpaca = createAlpaca();

      
      loop.updatables.push(camera);
      loop.updatables.push(cube);
      //loop.updatables.push(light);

      scene.add(light);
      scene.add(cube);
      scene.add(cube2);
      
      scene.add(alpaca);
      //cube.rotation.set(-0.5, -0.1, 0.8);

      cube.position.x = -5;

      cube2.position.x = 5;

      const resizer = new Resizer(container, camera, renderer);
    }
 
   render() {
   // draw a single frame
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