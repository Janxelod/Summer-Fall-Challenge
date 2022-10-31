import { TextureLoader, Group, MathUtils, MeshBasicMaterial } from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const alpacaMaterial = new MeshBasicMaterial({
  wireframe: false,
  map: new TextureLoader().load("./textures/Jarjacha-marron.png"),
});

const rotation = MathUtils.degToRad(75);
let changeMaterial = false;

function createJarjacha() {
  const fbxLoader = new FBXLoader();
  const objectGroup = new Group();
  let objectMesh;
  objectGroup.position.set(0, 0, 0);

  fbxLoader.load(
    "models/Jarjacha2.fbx",
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

  objectGroup.tick = (delta) => {
    if (changeMaterial) {
      //console.log("Updating uniform");
      alpacaUniforms.time.value += delta;
    }
  };

  return objectGroup;
}

export { createJarjacha };
