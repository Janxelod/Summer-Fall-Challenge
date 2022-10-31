class Resizer {
  constructor(container, camera, renderer) {
    // Set the camera's aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;

    renderer.setSize(container.clientWidth, container.clientHeight);

    camera.updateProjectionMatrix();

    renderer.setPixelRatio(window.devicePixelRatio);
  }
}

export { Resizer };
