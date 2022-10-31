import {
  DoubleSide,
  GLSL3,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
  Clock,
  LinearMipMapLinearFilter,
  TextureLoader,
  Group,
  BufferGeometry,
  PlaneBufferGeometry,
  // BufferGeometryUtils,
} from "three";

import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

import { GLOBAL_CONFIG } from "../config";
import { clouds_fragment } from "../shaders/clouds_fragment.glsl";
import { clouds_vertex } from "../shaders/clouds_vertex.glsl";

const cloudsUniforms = {
  itime: { value: 0 },
  iResolution: { value: new Vector3(window.innerWidth, window.innerHeight, 0) },
};

const cloudsMaterial = new ShaderMaterial({
  fragmentShader: clouds_fragment,
  //side: DoubleSide,
  glslVersion: GLSL3,
  uniforms: cloudsUniforms,
});

const createClouds = () => {
  const start_time = Date.now();

  let geometry = new BufferGeometry();

  var texture = new TextureLoader().load("./textures/clouds.png");

  const material = new ShaderMaterial({
    uniforms: {
      map: { type: "t", value: texture },
      fogColor: { type: "c", value: GLOBAL_CONFIG.FOG_PARAMS.fog.color },
      fogNear: { type: "f", value: GLOBAL_CONFIG.FOG_PARAMS.fog.near },
      fogFar: { type: "f", value: GLOBAL_CONFIG.FOG_PARAMS.fog.far },
    },
    vertexShader: clouds_vertex,
    fragmentShader: clouds_fragment,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    side: DoubleSide,
  });

  const planes = [];
  for (var i = 0; i < 1000; i++) {
    let plane = new PlaneGeometry(128, 128);

    plane.translate(
      Math.random() * 1000 - 500,
      -Math.random() * Math.random() * 200 - 15,
      -i * 10
    );
    // plane.position.x = Math.random() * 1000 - 500;
    // plane.position.y = -Math.random() * Math.random() * 200 - 15;
    // plane.position.z = i;
    plane.rotateZ(Math.random() * Math.PI);
    plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

    planes.push(plane);
  }

  geometry = BufferGeometryUtils.mergeBufferGeometries(planes, false);

  const mesh = new Mesh(geometry, material);
  const clock = new Clock();
  let position;

  mesh.tick = (delta) => {
    //console.log(clock.getElapsedTime());
    position = ((Date.now() - start_time) * 0.03) % 3600;

    cloudsUniforms.itime.value = clock.getElapsedTime();

    mesh.position.z = position;
  };
  return mesh;
};

export { createClouds };
