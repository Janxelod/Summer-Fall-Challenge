import {
   TextureLoader,
   ShaderMaterial,
   Group,
   GLSL3,
   MathUtils
   } from 'three';

import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';

import {alpaca_fragmentShader} from "../shaders/alpacaFragment.glsl";
import {alpaca_vertexShader} from "../shaders/alpacaVertex.glsl";


const alpacaUniforms = {
   alpacaTexture: {type: "t", value: new TextureLoader().load( "./textures/Alpaca-marron.png" )}
}

const alpacaMaterial = new ShaderMaterial({
   fragmentShader : alpaca_fragmentShader,
   vertexShader : alpaca_vertexShader,        
   uniforms : alpacaUniforms,
   glslVersion: GLSL3
});

const rotation = MathUtils.degToRad(75);

function createAlpaca() {
   const fbxLoader = new FBXLoader();
   const objectGroup = new Group();

   objectGroup.position.set(0,0,0);

   fbxLoader.load(
      'models/AlpacaMarron.fbx',
      (object) => {
         object.traverse(function (child) {
             if ((child).isMesh) {
                
               (child).material = alpacaMaterial
               child.material.transparency = false;
             }
         })
         object.scale.set(0.05, 0.05, 0.05);
         object.position.set(0,-5,0);
         object.rotation.set(0,-rotation, 0);
         objectGroup.add(object);
         console.log("Loading object to the group");
      },
      (xhr) => {
         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
         console.log(error)
      }
   );
   
   return objectGroup;
}

export { createAlpaca };
