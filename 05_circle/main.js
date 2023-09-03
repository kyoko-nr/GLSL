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

  vec3 cred = vec3(0.66, 0.13, 0.13);
  vec3 cyellow = vec3(0.99, 0.76, 0.14);
  vec3 cblue = vec3(0.0, 0.37, 0.60);
  vec3 cwhite = vec3(1.0);

  float PI = 3.14159265359;

  float circle1(vec2 st, vec2 center, float radius) {
    return 1.0 - step(distance(st, center), radius);
  }

  float circle2(vec2 st, vec2 center, float radius) {
    vec2 dist = st - center;
    return 1.0 - smoothstep(
      radius - (radius * 0.01),
      radius + (radius * 0.01),
      dot(dist, dist) * 4.0);
      // @see https://thebookofshaders.com/glossary/?search=dot
      // 同じベクトル同士の内積はベクトルの長さ（sqrtを返す）
      // sqrtは計算負荷が高いのでベクトルの長さを計算するときはdotの方が軽量
  }

  void main() {

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float pct = 0.0;

    pct = circle2(st, vec2(0.5), 0.3);

    vec3 color = vec3(pct);

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