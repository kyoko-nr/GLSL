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

  float rect(vec2 st, vec2 pos, vec2 size) {
    vec2 lpos = step(pos, st);
    vec2 lsize = step(st, vec2(size.x + pos.x, size.y + pos.y));
    return lsize.x * lsize.y * lpos.x * lpos.y;
  }

  void main() {

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(1.0);

    // vec2 borders = smoothstep(vec2(0.1), vec2(0.2), st);
    // vec2 borders2 = smoothstep(vec2(0.1), vec2(0.2), 1.0 - st);
    // color = vec3(borders.x * borders.y * borders2.x * borders2.y);

    float rred1 = rect(st, vec2(0.0, 0.75), vec2(0.05, 0.25));
    vec3 red1 = cred * rred1;
    float rred2 = rect(st, vec2(0.07, 0.75), vec2(0.1, 0.25));
    vec3 red2 = cred * rred2;
    float rred3 = rect(st, vec2(0.0, 0.45), vec2(0.05, 0.25));
    vec3 red3 = cred * rred3;
    float rred4 = rect(st, vec2(0.07, 0.45), vec2(0.1, 0.25));
    vec3 red4 = cred * rred4;
    vec3 reds = red1 + red2 + red3 + red4;

    float ryellow1 = rect(st, vec2(0.9, 0.75), vec2(0.1, 0.25));
    vec3 yellow1 = cyellow * ryellow1;
    float ryellow2 = rect(st, vec2(0.9, 0.45), vec2(0.1, 0.25));
    vec3 yellow2 = cyellow * ryellow2;
    vec3 yellows = yellow1 + yellow2;

    float rblue1 = rect(st, vec2(0.9, 0.0), vec2(0.1, 0.2));
    vec3 blue1 = cblue * rblue1;
    float rblue2 = rect(st, vec2(0.6, 0.0), vec2(0.28, 0.2));
    vec3 blue2 = cblue * rblue2;
    vec3 blues = blue1 + blue2;

    float rwhite1 = rect(st, vec2(0.0, 0.0), vec2(0.17, 0.4));
    vec3 white1 = cwhite * rwhite1;
    float rwhite2 = rect(st, vec2(0.19, 0.0), vec2(0.39, 0.2));
    vec3 white2 = cwhite * rwhite2;
    vec3 whites = white1 + white2;

    color = reds + yellows + blues + whites;

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