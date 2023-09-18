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

  mat2 scale(vec2 scale){
    return mat2(scale.x, 0.0, 0.0, scale.y);
  }

  mat2 rotate2d(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  }

  float box(in vec2 st, in vec2 size) {
    st += vec2(0.5);
    size = vec2(0.5) - size * 0.5;

    vec2 uv = smoothstep(size, size + vec2(0.001), st);
    uv *= smoothstep(size, size + vec2(0.001), vec2(1.0) - st);

    // vec2 uv = step(size, st);
    // uv *= step(size, vec2(1.0) - st);
    return uv.x * uv.y;
  }

  float drawCross(in vec2 st, float size) {
    return box(st, vec2(size, size * 0.25)) + box(st, vec2(size * 0.25, size));
  }

  void main() {
    vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);

    // Transtlation
    // vec2 translate = vec2(cos(u_time), sin(u_time));

    // Rotation
    // st += translate * 0.35;
    // st = rotate2d(sin(u_time) * PI2) * st;

    // Scaling
    st = rotate2d(sin(u_time) * PI) * scale(vec2(sin(u_time) + 1.0)) * st;

    vec3 color = vec3(0.0);

    color += vec3(drawCross(st, 0.3));

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