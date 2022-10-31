import {
  Color,
  Scene,
  FogExp2,
  WebGLCubeRenderTarget,
  TextureLoader,
} from "three";
import { GLOBAL_CONFIG } from "../config";

function createScene(config) {
  const scene = new Scene();

  const loader = new TextureLoader();
  const texture = loader.load("./textures/belfast_sunset_puresky.webp", () => {
    const rt = new WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(config.renderer, texture);
    scene.background = rt.texture;
  });

  //scene.background = new Color(GLOBAL_CONFIG.FOG_PARAMS.fogHorizonColor);

  if (config) {
    const { useFog } = config;
    if (useFog) {
      scene.fog = new FogExp2(
        GLOBAL_CONFIG.FOG_PARAMS.fogHorizonColor,
        GLOBAL_CONFIG.FOG_PARAMS.fogDensity
      );
      GLOBAL_CONFIG.FOG_PARAMS.fog = scene.fog;
    }
  }
  return scene;
}

export { createScene };
