import { PerspectiveCamera } from "three";
import { GLOBAL_CONFIG } from "../config";

function createCamera() {
  const camera = new PerspectiveCamera(
    60, // fov = Field Of View
    window.innerWidth / window.innerHeight,
    0.1, // near clipping plane
    20000 // far clipping plane
  );

  camera.position.set(1.34, 1.37, 5.3);

  let timeSinceStart = 0;
  camera.tick = (delta) => {
    // GLOBAL_CONFIG.GetLogger().log("Cam posX: " + camera.position.x);
    // GLOBAL_CONFIG.GetLogger().log("Cam posY: " + camera.position.y);
    // GLOBAL_CONFIG.GetLogger().log("Cam posZ: " + camera.position.z);
    // GLOBAL_CONFIG.GetLogger().log("Time: " + timeSinceStart);
    timeSinceStart += delta;
  };

  return camera;
}

export { createCamera };
