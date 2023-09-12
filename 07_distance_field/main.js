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

  float shape1(float angle, float u_time) {
    float f = cos(angle * abs(sin(u_time) + 2.0) * 5.0);
    // f = abs(cos(angle *3.));
    // f = abs(cos(angle *2.5))*.5+.3;
    // f = abs(cos(angle *12.)*sin(angle *3.))*.8+.1;
    // f = smoothstep(-.5,1., cos(angle *10.))*0.2+0.5;
    return f;
  }

  float withHole() {
    return 0.0;
  }

  void main() {

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(0.5) - st;

    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);

    float f = shape1(a, u_time);

    color = vec3( 1.-smoothstep(f,f+0.02,r) );

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