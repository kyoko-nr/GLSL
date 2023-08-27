/**
 * Handle window resize. update camera and renderer
 * @param {THREE.Camera} camera
 * @param {THREE.WebGLRenderer} renderer
 */
export const handleWindowSize = (camera, renderer) => {

  const onWindowResize = (e) => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    let width, height;
    if (aspectRatio>=1){
      width = 1;
      height = (window.innerHeight / window.innerWidth) * width;
    }else{
      width = aspectRatio;
      height = 1;
    }
    camera.left = -width;
    camera.right = width;
    camera.top = height;
    camera.bottom = -height;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  window.addEventListener( 'resize', onWindowResize, false );
}