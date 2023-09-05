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

  vec3 pattern(vec2 st) {
    // Remap the space to -1. to 1.
    st = st * 2.0 - 1.0;

    // Make the distance field
    float distance = length(abs(st) - 0.3);
    // float distance = length( min(abs(st) - 0.3, 0.0) );
    // float distance = length( max(st - 0.0, 0.0) );

    // シマシマのパターン
    // return vec3(fract( distance * 10.0));
    // パキッとした形
    // return vec3(step(0.3, distance));
    // 外側の線
    // return vec3(step(0.3, distance) * step(distance, 0.31));
    // 外側の線（滑らか）
    return vec3(smoothstep(0.3, 0.4, distance) * smoothstep(0.6, 0.5, distance));
  }

  void main() {

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // float radius = abs(sin(u_time)) * 0.1;

    // float pct1 = circle2(st, vec2(0.2, 0.5), radius);
    // float pct2 = circle2(st, vec2(0.8, 0.5), radius);

    // vec3 color = vec3(pct1) + vec3(pct2);

    vec3 color = pattern(st);

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