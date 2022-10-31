import {
  Matrix4,
  InstancedMesh,
  Vector3,
  Euler,
  Quaternion,
  Group,
  MeshNormalMaterial,
  Object3D,
  DynamicDrawUsage,
  ShaderMaterial,
  RepeatWrapping,
  TextureLoader,
} from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { lava_vertex } from "../shaders/lavaVertex.glsl";
import { lava_fragment } from "../shaders/lavaFragment.glsl";

let objectGroup;
let instancedMesh;
let changeOrbitMaterial = false;
let customUniforms;
function createOrbitMeshes(filepath, count) {
  const fbxLoader = new FBXLoader();
  let material;
  objectGroup = new Group();

  fbxLoader.load(
    filepath,
    (geometry) => {
      material = new MeshNormalMaterial();

      instancedMesh = makeInstanced(
        geometry.children[0].geometry,
        material,
        count
      );
      objectGroup.add(instancedMesh);

      let matrix = new Matrix4();
      const mesh = objectGroup.children[0];

      for (let i = 0; i < mesh.count; i++) {
        mesh.getMatrixAt(i, matrix);
        let position = new Vector3(),
          quaternion = new Quaternion(),
          scale = new Vector3();
        matrix.decompose(position, quaternion, scale);
      }
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );

  const dummy = new Object3D();

  function changeRotation(mesh, index, childrenMatrix, dummy, newRotation) {
    mesh.getMatrixAt(index, childrenMatrix);

    childrenMatrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

    dummy.position.applyQuaternion(newRotation);
    dummy.quaternion.multiply(newRotation);

    childrenMatrix.compose(dummy.position, dummy.quaternion, dummy.scale);

    mesh.setMatrixAt(index, childrenMatrix);
  }

  objectGroup.tick = (delta) => {
    if (changeOrbitMaterial) {
      customUniforms.time.value += delta;
    }

    const rotation = new Quaternion();
    rotation.setFromAxisAngle(
      new Vector3(0, 1, 0).normalize(),
      (Math.PI / 4) * delta
    );

    const mesh = objectGroup.children[0];
    let matrix = new Matrix4();

    for (let i = 0; i < mesh.count; i++) {
      changeRotation(mesh, i, matrix, dummy, rotation);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };
  return objectGroup;
}

function makeInstanced(geometry, material, count) {
  const matrix = new Matrix4();
  const mesh = new InstancedMesh(geometry, material, count);

  for (let i = 0; i < count; i++) {
    randomizeMatrix(matrix);
    mesh.setMatrixAt(i, matrix);
  }

  mesh.instanceMatrix.setUsage(DynamicDrawUsage);

  return mesh;
}

const randomizeMatrix = (function () {
  const position = new Vector3();
  const rotation = new Euler();
  const quaternion = new Quaternion();
  const scale = new Vector3();

  return function (matrix) {
    position.x = Math.random() * 40 - 20;
    position.y = Math.random() * 40 - 20;
    position.z = Math.random() * 40 - 20;

    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;

    quaternion.setFromEuler(rotation);

    scale.x = scale.y = scale.z = 0.5 * Math.random() * 1;

    matrix.compose(position, quaternion, scale);
  };
})();

const changeOrbitMeshesMaterial = () => {
  changeOrbitMaterial = true;
  // base image texture for mesh
  const lavaTexture = new TextureLoader().load("./textures/lava.jpg");
  lavaTexture.wrapS = lavaTexture.wrapT = RepeatWrapping;
  // multiplier for distortion speed
  const baseSpeed = 0.02;
  // number of times to repeat texture in each direction
  let repeatS,
    repeatT = 4.0;

  // texture used to generate "randomness", distort all other textures
  const noiseTexture = new TextureLoader().load("./textures/cloud.png");
  noiseTexture.wrapS = noiseTexture.wrapT = RepeatWrapping;
  // magnitude of noise effect
  const noiseScale = 0.5;

  // texture to additively blend with base image texture
  const blendTexture = new TextureLoader().load("./textures/lava.jpg");
  blendTexture.wrapS = blendTexture.wrapT = RepeatWrapping;
  // multiplier for distortion speed
  const blendSpeed = 0.01;
  // adjust lightness/darkness of blended texture
  const blendOffset = 0.25;

  // texture to determine normal displacement
  const bumpTexture = noiseTexture;
  bumpTexture.wrapS = bumpTexture.wrapT = RepeatWrapping;
  // multiplier for distortion speed
  const bumpSpeed = 0.15;
  // magnitude of normal displacement
  const bumpScale = 4.0;

  // use "this." to create global object
  customUniforms = {
    baseTexture: { type: "t", value: lavaTexture },
    baseSpeed: { type: "f", value: baseSpeed },
    repeatS: { type: "f", value: repeatS },
    repeatT: { type: "f", value: repeatT },
    noiseTexture: { type: "t", value: noiseTexture },
    noiseScale: { type: "f", value: noiseScale },
    blendTexture: { type: "t", value: blendTexture },
    blendSpeed: { type: "f", value: blendSpeed },
    blendOffset: { type: "f", value: blendOffset },
    bumpTexture: { type: "t", value: bumpTexture },
    bumpSpeed: { type: "f", value: bumpSpeed },
    bumpScale: { type: "f", value: bumpScale },
    alpha: { type: "f", value: 1.0 },
    time: { type: "f", value: 1.0 },
  };

  // create custom material from the shader code above
  //   that is within specially labeled script tags
  const customMaterial = new ShaderMaterial({
    uniforms: customUniforms,
    vertexShader: lava_vertex,
    fragmentShader: lava_fragment,
  });

  instancedMesh.material = customMaterial;
  //instancedMesh.bufferGeometry =
};

export { createOrbitMeshes, changeOrbitMeshesMaterial };
