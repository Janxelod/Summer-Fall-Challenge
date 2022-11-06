import { ClearingLogger } from "./clearingLogger";

const logger = new ClearingLogger(document.querySelector("#debug pre"));
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

  SIZE_FACTOR: 4
};

export { GLOBAL_CONFIG };
