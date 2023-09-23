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

  vec2 rotate2d(vec2 st, float angle) {
    st -= 0.5;
    st = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * st;
    st += 0.5;
    return st;
  }

  float easeInOutCubic(float x) {
    return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
  }

  vec2 tile (vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
  }

  float drawVerLine(in vec2 st, in float width, in float posX) {
    float halfWidth = width / 2.0;
    float outline = 1.0 - step(posX - halfWidth, st.x);
    float line = step(posX + halfWidth, st.x);
    return 1.0 - (line + outline);
  }

  float drawHolLine(in vec2 st, in float width, in float posY) {
    float halfWidth = width / 2.0;
    float outline = 1.0 - step(posY - halfWidth, st.y);
    float line = step(posY + halfWidth, st.y);
    return 1.0 - (line + outline);
  }

  const vec3 cgray = vec3(0.5, 0.5, 0.5);
  const vec3 cred = vec3(0.9, 0.1, 0.1);

  void main() {
    vec2 st = gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
    vec3 color = vec3(0.0);
    // vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // st = tile(st, 4.0);
    // st = rotateTilePattern(st);
    // gl_FragColor = vec4(vec3(step(st.x,st.y)), 1.0);

    // Animation
    // st = rotate2d(st, -PI * u_time * 0.25);

    vec3 line1 = cgray * drawVerLine(st, 0.08, 0.1);
    vec3 line2 = cgray * drawVerLine(st, 0.08, 0.4);
    vec3 line3 = cgray * drawVerLine(st, 0.08, 0.7);
    vec3 line4 = cgray * drawHolLine(st, 0.08, 0.1);
    vec3 line5 = cgray * drawHolLine(st, 0.08, 0.4);
    vec3 line6 = cgray * drawHolLine(st, 0.08, 0.7);

    vec3 line7 = cred * drawVerLine(st, 0.04, 0.9);
    vec3 line8 = cred * drawHolLine(st, 0.04, 0.9);

    color = line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8;

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