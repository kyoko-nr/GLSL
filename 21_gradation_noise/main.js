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

  vec2 random2(vec2 st){
    st = vec2(
      dot(st,vec2(127.1,311.7)),
      dot(st,vec2(269.5,183.3))
    );
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float gNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix(
      mix(
        dot(random2(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)),
        dot(random2(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)),
        u.x
      ),
      mix(
        dot(random2(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
        dot(random2(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)),
        u.x
      ),
      u.y);
}


  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    st.x *= u_resolution.x / u_resolution.y;

    vec2 pos = vec2(st * 10.0);
    vec3 color = vec3(0.0);

    color = vec3(gNoise(pos) * 0.5 + 0.5);

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