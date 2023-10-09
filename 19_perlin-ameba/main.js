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

    // float y = rand(i);
    // float y = mix(rand(i), rand(i + 1.0), f);
    float y = mix(rand(i), rand(i + 1.0), smoothstep(0.,1.,f));

    return y;
  }

  float noiseShape(vec2 st, vec2 center, float size, float complication, vec2 speed) {
    float noise = (
        noise(st.x * complication + sin(u_time * speed.x))
        + noise(st.y * complication + cos(u_time * speed.y))
      ) * 0.1;
    float shape = step(distance(st, center), size + noise);
    return shape;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
    vec3 color = vec3(0.0);

    float shape1 = noiseShape(st, vec2(0.3), 0.1, 8.0, vec2(0.8, 1.2));
    float shape2 = noiseShape(st, vec2(0.7), 0.12, 6.0, vec2(0.5, 0.8));
    vec3 outline = vec3(1.0 - shape1 - shape2);
    vec3 colored = shape1 * cred + shape2 * cblue;

    color = outline + colored;

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