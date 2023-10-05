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
  const vec3 cblue = vec3(0.3, 0.45, 0.85);

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

  float plot(vec2 st) {
    // abs(st.y - st.x)が0.0以上0.05以下の場合に0.0〜1.0の値を返す
    return smoothstep(0.05, 0.0,abs(st.y - st.x));
  }

  float random (float x) {
    return fract(sin(dot(vec2(x), vec2(12.9898, 78.2333))) * 3758.5453123);
  }

  float rand (float x) {
    float y = fract(sin(x) * 1.0);
    return y;
  }

  float noise (float x) {
    float i = floor(x);
    float f = fract(x);

    float y = rand(i);
    // float y = mix(rand(i), rand(i + 1.0), f);
    // float y = mix(rand(i), rand(i + 1.0), smoothstep(0.,1.,f));

    return y;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
    st *= 10.0;
    vec3 color = vec3(0.0);

    float x = st.x;
    float y = noise(st.x);

    color = vec3(0, y, y) + vec3(plot(vec2(x, y + st.y)));

    // color = vec3(plot(vec2(x, y + st.y)));

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