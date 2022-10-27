import { DirectionalLight } from 'three';

function createLights() {
   // Create a directional light
   const light = new DirectionalLight('white', 8);
 
   light.position.set(10, 10, 10);
   
   light.tick = (delta) => {
      // increase the cube's rotation each frame
      light.position.y += 2 *delta;
   };
   return light;
 }

export { createLights };