import { ClearingLogger } from "./clearingLogger";

const logger = new ClearingLogger(document.querySelector("#debug pre"));
// Using arbitrary value to downscale the resolution of the canvas in order to give a look retro
const PIXELATED_SIZE_FACTOR = window.devicePixelRatio * 6;

const GLOBAL_CONFIG = {
  DEBUG: true,

  GetLogger() {
    if (this.DEBUG) {
      return logger;
    }
    return false; // Change it later...
  },

  FOG_PARAMS: {
    fogNearColor: 0xfc4848,
    fogHorizonColor: 0x0,
    fogDensity: 0.09,
    fogNoiseSpeed: 100,
    fogNoiseFreq: 0.0012,
    fogNoiseImpact: 0.5,
  },

  SIZE_FACTOR: PIXELATED_SIZE_FACTOR,
  toggleSizeFactor: function () {
   this.SIZE_FACTOR = (this.SIZE_FACTOR === 1 ? PIXELATED_SIZE_FACTOR : 1)
  } 
};

export { GLOBAL_CONFIG };
