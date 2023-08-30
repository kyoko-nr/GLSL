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

  vec3 colorA = vec3(0.458, 0.615, 0.767);
  vec3 colorB = vec3(0.925, 0.933, 0.505);

  float PI = 3.14159265359;

  float easeInOutQuint(float x) {
    return x < 0.5 ? 16.0 * x * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 5.0) / 2.0;
    }

  float easeOutExpo(float x) {
    return x == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x);
  }

  float easeInOutBack(float x) {
    float c1 = 1.70158;
    float c2 = c1 * 1.525;

    return x < 0.5
    ? (pow(2.0 * x, 2.0) * ((c2 + 1.0) * 2.0 * x - c2)) / 2.0
    : (pow(2.0 * x - 2.0, 2.0) * ((c2 + 1.0) * (x * 2.0 - 2.0) + c2) + 2.0) / 2.0;
  }

  float plot (vec2 st, float pct){
    return  smoothstep( pct-0.05, pct, st.y) -
            smoothstep( pct, pct+0.05, st.y);
  }

  float plotLower (vec2 st, float percentage) {
    return smoothstep( percentage + 0.5, percentage - 1.5, st.y);
  }

  float plotUpper (vec2 st, float percentage) {
    return smoothstep( percentage - 0.5, percentage, st.y);
  }

  vec4 drawTurner (vec2 st, float u_time) {
    vec3 beige = vec3(0.87,0.81,0.66);
    vec3 blue = vec3(0.33,0.46,0.69);
    vec3 red = vec3(0.74,0.32,0.07);

    vec3 color = beige;

    vec3 pct = vec3(st.x);

    float amountR = abs(sin(u_time * 0.1));
    float amountB = 1.0 - amountR;

    pct.r = smoothstep(0.0, 1.0, amountR + st.x);
    pct.g = sin(st.x*PI);
    pct.b = easeOutExpo(amountB + st.x);

    color = mix(color,beige,plotLower(st,pct.g));
    color = mix(color,blue,plotUpper(st,pct.b));
    color = mix(color,red,plotLower(st,pct.r));

    return vec4(color,1.0);
  }

  vec4 drawRainbow (vec2 st) {
    vec3 color = vec3(1.0);

    vec3 cViloet = vec3(0.82, 0, 0.97);

    float pViolet = sin(st.x * PI * 0.8 + 0.3) - 0.6;
    float pIndigo = sin(st.x * PI * 0.8 + 0.3) - 0.5;
    float pBlue = sin(st.x * PI * 0.8 + 0.3) - 0.4;
    float pGreen = sin(st.x * PI * 0.8 + 0.3) - 0.3;
    float pYellow = sin(st.x * PI * 0.8 + 0.3) - 0.2;
    float pOrane = sin(st.x * PI * 0.8 + 0.3) - 0.1;
    float pRed = sin(st.x * PI * 0.8 + 0.3);
    
    color = mix(color, cViloet, plot(st, pViolet));

    return vec4(color, 1.0);
  }

  void main() {

    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // vec4 color = drawTurner(st, u_time);
    vec4 color = drawRainbow(st);

    gl_FragColor = color;
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