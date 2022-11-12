import { GLOBAL_CONFIG } from "../config";

const setSize = (container, camera, renderer, composer) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  composer.setSize(
    container.clientWidth / GLOBAL_CONFIG.SIZE_FACTOR,
    container.clientHeight / GLOBAL_CONFIG.SIZE_FACTOR
  );

  renderer.setSize(container.clientWidth, container.clientHeight);
};

class Resizer {
  constructor(container, camera, renderer, composer) {
    this.container = container;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;

    // Set the camera's aspect ratio
    setSize(container, camera, renderer, composer);

    window.addEventListener("resize", () => {
      // set the size again if a resize occurs
      setSize(container, camera, renderer, composer);
      this.onResize();
    });

    window.addEventListener("keydown", (e) => {
      const key = e.key;
      const keyLower = key.toLowerCase();
      if (keyLower === "f") {
        GLOBAL_CONFIG.toggleSizeFactor();
        setSize(container, camera, renderer, composer);
      }
    });
  }

  setNoPixelated() {
    GLOBAL_CONFIG.SIZE_FACTOR = 1;
    setSize(this.container, this.camera, this.renderer, this.composer);
  }

  onResize() {}
}

export { Resizer };
