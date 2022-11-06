import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";

import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";

import { SepiaShader } from "three/examples/jsm/shaders/SepiaShader.js";
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";

let composer;
let passDictionary = {};

const createComposer = (renderer, scene, camera) => {
  composer = new EffectComposer(renderer);
  composer.setPixelRatio(window.devicePixelRatio);
  composer.addPass(new RenderPass(scene, camera));

  const gammaCorrection = new ShaderPass(GammaCorrectionShader);

  const effectFilm = new FilmPass(0.35, 0.025, 648, false);

   addPass("EffectGammaCorrection", gammaCorrection);
   addPass("EffectFilm", effectFilm);

  return composer;
};

const addEffectSepia = () => {
  const effectSepia = new ShaderPass(SepiaShader);

  composer.insertPass(effectSepia, 1);
  passDictionary["Effectsepia"] = effectSepia;
};

const addEffectVignette = () => {
  const effectVignette = new ShaderPass(VignetteShader);
  effectVignette.uniforms["offset"].value = 0.95;
  effectVignette.uniforms["darkness"].value = 1.6;

  composer.insertPass(effectVignette, 3);
  passDictionary["EffectVignette"] = effectVignette;
};

const addEffectGlitch = () => {
  const effectGlitch = new GlitchPass();
  composer.addPass(effectGlitch);
  passDictionary["EffectGlitch"] = effectGlitch;
};

const addPass = (passType, newPass, inde) => {
  composer.addPass(newPass);
  passDictionary[passType] = newPass;
};

const removePass = (passType) => {
  const pass = passDictionary[passType];
  if (pass) {
    console.log("Removing pass: " + passType);
    composer.removePass(pass);
    delete passDictionary[passType];
  }
};

export {
  createComposer,
  removePass,
  addEffectSepia,
  addEffectVignette,
  addEffectGlitch,
};
