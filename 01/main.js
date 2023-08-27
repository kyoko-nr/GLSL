import { setupEnvironment } from "../utils/three/setupEnvironment";
import { handleWindowSize } from "../utils/three/handleWindowSize";

const vshader = `
  uniform float u_time;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 1.0, 1.0);
  }
`;

const fshader = `
  uniform float u_time;

  void main() {
    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
  }
`;

const init = () => {
  const {scene, camera, renderer} = setupEnvironment(vshader, fshader);
  handleWindowSize(camera, renderer);
  renderer.render(scene, camera);
}

document.addEventListener("DOMContentLoaded", init);