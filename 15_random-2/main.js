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

  const vec3 cgray = vec3(0.5, 0.5, 0.5);
  const vec3 cred = vec3(0.9, 0.1, 0.1);

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

  float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.2333))) * 3758.5453123);
  }

  vec3 randomCell (vec2 st) {
    st *= 100.0;
    float iposX = floor(st.x - u_time * 30.0);
    float iposY = floor(st.y);
    float randomed = step(random(vec2(iposX, iposY)), 0.9);
    return vec3(randomed);
  }

  vec3 randomBar (vec2 st) {
    float rate1 = abs(sin(st.x));
    float rate2 = abs(cos(st.x));
    if(st.y > 0.5) {
      // 上半分
      st *= 100.0 * rate1;
      float stX = (st.x - u_time * 30.0);
      float flooredX = floor(stX);
      float randomed = step(random(vec2(flooredX)), 0.9);
      return vec3(randomed);
    } else {
      // 下半分
      st *= 100.0 * rate2;
      float stX = (st.x + u_time * 30.0);
      float flooredX = floor(stX);
      float randomed = step(random(vec2(flooredX)), 0.9);
      return vec3(randomed);
    }
  }

  void main() {
    vec2 st = gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
    vec3 color = vec3(0.0);

    color = randomBar(st);
    // color = randomCell(st);

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