import {
  TextureLoader,
  ShaderMaterial,
  Group,
  GLSL3,
  MathUtils,
  MeshBasicMaterial,
} from "three";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import { alpaca_fragmentShader } from "../shaders/alpacaFragment.glsl";
import { alpaca_vertexShader } from "../shaders/alpacaVertex.glsl";

const alpacaUniforms = {
  alpacaTexture: {
    type: "t",
    value: new TextureLoader().load("./textures/Alpaca-marron.png"),
  },
  time: { type: "f", value: 1.0 },
};

const alpacaMaterial = new MeshBasicMaterial({
  wireframe: false,
  map: new TextureLoader().load("./textures/Alpaca-marron.png"),
});

const alpacaDistortedMaterial = new ShaderMaterial({
  vertexShader: alpaca_vertexShader,
  fragmentShader: alpaca_fragmentShader,
  uniforms: alpacaUniforms,
  glslVersion: GLSL3,
});

const rotation = MathUtils.degToRad(75);
let changeMaterial = false;

function createAlpaca() {
  const fbxLoader = new FBXLoader();
  const objectGroup = new Group();
  let objectMesh;
  objectGroup.position.set(0, 0, 0);

  fbxLoader.load(
    "models/AlpacaMarron.fbx",
    (object) => {
      object.traverse(function (child) {
        if (child.isMesh) {
          child.material = alpacaMaterial;
          child.material.transparency = false;
        }
      });

      object.scale.set(0.05, 0.05, 0.05);
      object.position.set(0, -5, 0);
      object.rotation.set(0, -rotation, 0);
      objectMesh = object;
      objectGroup.add(object);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );

  let isFlying = false;
  objectGroup.startFlying = () => {
    if (objectMesh) {
      isFlying = true;
      objectMesh.rotateZ(rotation / 5);

      let initialRotation = objectMesh.rotation.z;

      new TWEEN.Tween({ z: initialRotation })
        .to({ z: -rotation / 5 }, 250 / 2)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .repeat(4 * 11 * 2)
        .yoyo(true)
        .onUpdate((object) => {
          objectMesh.rotation.z = object.z;
        })
        .onComplete((object) => {
          objectMesh.rotation.set(0, -rotation, 0);
        })
        .start();
    }
  };

  objectGroup.tick = (delta) => {
    if (changeMaterial) {
      //console.log("Updating uniform");
      alpacaUniforms.time.value += delta;
    }
  };

  objectGroup.changeToDistortedMaterial = () => {
    console.log("Change to distorted material");
    changeMaterial = true;
    objectMesh.traverse(function (child) {
      if (child.isMesh) {
        child.material = alpacaDistortedMaterial;
      }
    });
  };

  return objectGroup;
}

export { createAlpaca };
