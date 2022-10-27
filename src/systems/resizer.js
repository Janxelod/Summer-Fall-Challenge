class Resizer {
   constructor(container, camera, renderer) {
     // Set the camera's aspect ratio
     camera.aspect = container.clientWidth / container.clientHeight;
      
     console.log(container.clientWidth, container.clientHeight)
     // update the size of the renderer AND the canvas
     renderer.setSize(container.clientWidth, container.clientHeight);
 
     camera.updateProjectionMatrix();
     
     // set the pixel ratio (for mobile devices)
     renderer.setPixelRatio(window.devicePixelRatio);
   }
 }
 
 export { Resizer };