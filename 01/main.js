import * as THREE from "three";
import { setupEnvironment } from "../utils/three/setupEnvironment";
import { handleWindowSize } from "../utils/three/handleWindowSize";

const vshader = `
  uniform float u_time;

  void main() {
  }
`;

const fshader = `
  uniform float u_time;

  void main() {
    gl_FragColor = vec4(1.0,0.0,1.0,1.0);
  }
`;

const init = () => {
  console.log("hello")
  const {camera, renderer} = setupEnvironment(vshader, fshader);
  handleWindowSize(camera, renderer);
}

document.addEventListener("DOMContentLoaded", init);