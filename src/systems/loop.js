import Stats from "stats.js";
import { Clock } from "three";

const clock = new Clock();

const fpsStats = new Stats();
fpsStats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

const debugFPS = document.querySelector("#debugFPS");
//debugFPS.appendChild(fpsStats.dom);

const toggleDebug = () => {
  const show = fpsStats.dom.isConnected;
  if (show) {
    debugFPS.removeChild(fpsStats.dom);
  } else {
    debugFPS.appendChild(fpsStats.dom);
  }
};

class Loop {
  constructor(camera, scene, renderer, composer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.composer = composer;
    this.updatables = [];

    window.addEventListener("keydown", (e) => {
      const key = e.key;
      const keyLower = key.toLowerCase();
      if (keyLower === "d") {
        toggleDebug();
      }
    });
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      fpsStats.begin();
      // render a frame
      this.tick();

      if (this.composer) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
      fpsStats.end();
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta();

    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
}

export { Loop };
