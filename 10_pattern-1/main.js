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

  vec2 tile(vec2 st, vec2 scale) {
    st *= scale;
    return fract(st);
  }

  float circle(in vec2 st, in float radius) {
    vec2 len = st - vec2(0.5);
    return 1.0 - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(len, len) * 4.0);
  }

  float box(in vec2 st, in vec2 size) {
    size = vec2(0.5) - size * 0.5;
    vec2 uv = smoothstep(size, size + vec2(0.001), st);
    uv *= smoothstep(size, size + vec2(0.001), vec2(1.0) - st);
    return uv.x * uv.y;
  }

  float drawCross(in vec2 st, float size) {
    st -= vec2(0.5);
    st = rotate2d(PI * 0.25) * st;
    st += vec2(0.5);
    return box(st, vec2(size, size * 0.25)) + box(st, vec2(size * 0.25, size));
  }

  float drawTicTacToe(in vec2 st) {
    vec2 st2 = st * vec2(1.5, 3.0);
    vec2 tiledSt = fract(st2);
    vec2 floored = floor(st2);
    float modded = mod(floored.x + floored.y, 2.0);
    float result = circle(tiledSt, 0.5) * modded + drawCross(tiledSt, 0.5);
    return result;
  }

  void main() {
    // vec2 st = gl_FragCoord.xy / u_resolution.xy;
    // vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);

    vec2 st = gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
    vec3 color = vec3(0.0);

    color = vec3(drawTicTacToe(st));

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