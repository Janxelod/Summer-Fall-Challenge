//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import * as THREE from './lib/three.min.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';

let camera, scene, renderer;
let mesh;

let audioUniforms;

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let analyser;

document.addEventListener( 'mousemove', onDocumentMouseMove );

const earthUniforms = {
    time: { value: 0 },
    ground: { type: "t", value: new THREE.TextureLoader().load( "./textures/earth.jpg" ) },
    mask: { type: "t", value: new THREE.TextureLoader().load( "./textures/mask.png" ) }    
};

const alpacaUniforms = {
   alpacaTexture: {type: "t", value: new THREE.TextureLoader().load( "./textures/Alpaca-marron.png" )}
}

function init() {

   scene = new THREE.Scene();
   camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
   //camera.position.z = 40;
   camera.position.set( 15, 20, 40 );

   renderer = new THREE.WebGLRenderer();
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);

   const controls = new OrbitControls( camera, renderer.domElement );
   controls.minDistance = 10;
   controls.maxDistance = 200;
   //controls.maxPolarAngle = Math.PI / 2;

   const fftSize = 128;

   const listener = new THREE.AudioListener();

   const sound = new THREE.Audio( listener );
   const file = './audio/Lonely-warrior.mp3';

   const loader = new THREE.AudioLoader();
      loader.load( file, function ( buffer ) {

         sound.setBuffer( buffer );
         sound.play();

      } );

   analyser = new THREE.AudioAnalyser( sound, fftSize );


   const format = ( renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;
   audioUniforms = {

      tAudioData: { value: new THREE.DataTexture( analyser.data, fftSize / 2, 1, format ) }

   };

   const audioMaterial = new THREE.ShaderMaterial( {

      uniforms: audioUniforms,
      vertexShader: audioVisualizer_vertexShader,
      fragmentShader: audioVisualizer_fragmentShader,
      glslVersion: THREE.GLSL3,
   } );

   const audioGeometry = new THREE.PlaneGeometry( 5, 5 );
   const audioMesh = new THREE.Mesh( audioGeometry, audioMaterial );
	//scene.add( audioMesh );

   const fbxLoader = new FBXLoader();
   const material = new THREE.MeshLambertMaterial();

   const alpacaMaterial = new THREE.ShaderMaterial({
      fragmentShader : alpaca_fragmentShader,
      vertexShader : alpaca_vertexShader,        
      uniforms : alpacaUniforms,
      glslVersion: THREE.GLSL3
   });

   fbxLoader.load(
      'models/AlpacaMarron.fbx',
      (object) => {
         object.traverse(function (child) {
             if ((child).isMesh) {
                
               (child).material = alpacaMaterial
               child.material.transparency = false;
             }
         })
         object.scale.set(0.2, 0.2, 0.2);
         object.position.set(0,0,0);
         scene.add(object);
         console.log("Adding object to the scene");
      },
      (xhr) => {
         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
         console.log(error)
      }
   );

   //const geometry = new THREE.SphereGeometry( 15, 100, 100);

   const plane = new THREE.PlaneGeometry(20, 20);

   const cubeMaterial = new THREE.ShaderMaterial({
      fragmentShader : earth_fragmentShader,
      vertexShader : earth_vertexShader,        
      uniforms : earthUniforms,
      glslVersion: THREE.GLSL3,
      side: THREE.DoubleSide
   });

   const light = new THREE.PointLight()
   light.position.set(0.8, 1.4, 1.0)
   scene.add(light)

   const ambientLight = new THREE.AmbientLight()
   scene.add(ambientLight)

   mesh = new THREE.Mesh(plane, cubeMaterial);
   scene.add(mesh);

   window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(millis) {

   let time = millis * 0.001;

   earthUniforms.time.value = time;

   // camera.position.x += ( mouseX - camera.position.x ) * .05;
   // camera.position.y += ( - mouseY - camera.position.y ) * .05;

   requestAnimationFrame(animate);

   mesh.rotation.x = 0.5;
   mesh.rotation.y = -1.5 - 0.5 * time;

   analyser.getFrequencyData();

   audioUniforms.tAudioData.value.needsUpdate = true;
   renderer.render(scene, camera);
}

function onDocumentMouseMove( event ) {
   mouseX = ( event.clientX - windowHalfX ) / 100;
   mouseY = ( event.clientY - windowHalfY ) / 100;
}

init();
animate();
