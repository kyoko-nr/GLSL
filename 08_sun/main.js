import * as THREE from "three";
import { setupEnvironment } from "../utils/three/setupEnvironment";
import { handleWindowSize } from "../utils/three/handleWindowSize";
import { handleMouse } from "../utils/three/handleMouse";

const vshader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 1.0, 1.0);
  }
`;

const fshader = `
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;

  const float PI = 3.1415926;
  const float PI2 = PI * 2.0;

  vec3 cSun = vec3(0.99, 0.32, 0.01);

  float drawSun(float len) {
    float outline = 1.0 - step(len, 0.5);
    vec3 sun = step(len, 0.5) * cSun;
    float ring = abs(0.01 / (len - 0.5));
    return ring;
  }

  void main() {

    vec2  p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
    float len = length(p);

    float wave = sin((atan(p.y, p.x) + PI) / PI2 * PI * 100.0);
    float circle = 1.5 / abs(sin(length(p * 50.0) - u_time * 9.0 + len + wave));

    float outline = 1.0 - step(len, 0.5);
    vec3 sun = step(len, 0.5) * cSun;

    float ring = abs(0.01 / (len - 0.5));

    vec3 color = vec3(circle) * cSun * outline + sun + ring;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const init = () => {
  const uniforms = {
    u_color: {value: new THREE.Color(0xffff00)},
    u_time: {value: 0.0 },
    u_mouse: {value: {x: 0.0, y: 0.0}},
    u_resolution: {value: {x: 0, y: 0}}
  }

  const {scene, camera, renderer} = setupEnvironment(vshader, fshader, uniforms);
  handleWindowSize(camera, renderer, uniforms.u_resolution);
  handleMouse(uniforms.u_mouse);

  const clock = new THREE.Clock();

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    uniforms.u_time.value = clock.getElapsedTime();
  }

  animate();
}

document.addEventListener("DOMContentLoaded", init);