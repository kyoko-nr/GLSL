import * as THREE from "three";
import { setupEnvironment } from "../utils/three/setupEnvironment";
import { handleWindowSize } from "../utils/three/handleWindowSize";
import { handleMouse } from "../utils/three/handleMouse";

const vshader = `
  void main() {
    // gl_Position = vec4( position, 1.0 );
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 1.0, 1.0);
  }
`;

const fshader = `
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;

  float plot(vec2 st) {
    // y = x の関数グラフ
    // abs(st.y - st.x)が0.0以上0.01以下の場合に0.0〜1.0の値を返す
    return smoothstep(0.01, 0.0,abs(st.y - st.x));
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(st.x);
    // Plot a line
    float pct = plot(st);
    color = (1.0 - pct) * color + pct * vec3(0.0,1.0,0.0);
    // color = pct * color + pct * vec3(0.0, 1.0, 0,0);
    // color = 1.0 - pct * vec3(0.0, 1.0, 0.0);

    gl_FragColor = vec4(color,1.0);
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