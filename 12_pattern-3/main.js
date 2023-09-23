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

  mat2 scale(vec2 scale){
    return mat2(scale.x, 0.0, 0.0, scale.y);
  }

  vec2 rotate2d(vec2 st, float angle) {
    st -= 0.5;
    st = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * st;
    st += 0.5;
    return st;
  }

  float circle(in vec2 st, in float radius, in vec2 origin) {
    // vec2 _origin = st + origin;
    vec2 len = st - vec2(0.5) + origin;
    return 1.0 - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(len, len) * 4.0);
  }

  float box(in vec2 st, in vec2 size) {
    size = vec2(0.5) - size * 0.5;
    vec2 uv = smoothstep(size, size + vec2(0.001), st);
    uv *= smoothstep(size, size + vec2(0.001), vec2(1.0) - st);
    return uv.x * uv.y;
  }

  float easeInOutCubic(float x) {
    return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
  }

  // ----------
  // 回転のパターン
  // ----------
  vec2 rotateTilePattern(vec2 _st){

    //  Scale the coordinate system by 2x2
    _st *= 2.0;

    //  Give each cell an index number
    //  according to its position
    float index = 0.0;
    index += step(1., mod(_st.x,2.0));
    index += step(1., mod(_st.y,2.0))*2.0;

    //      |
    //  2   |   3
    //      |
    //--------------
    //      |
    //  0   |   1
    //      |

    // Make each cell between 0.0 - 1.0
    _st = fract(_st);

    // Rotate Pattern 1
    // if(index == 1.0){
    //   //  Rotate cell 1 by 90 degrees
    //   _st = rotate2d(_st, PI * 0.5);
    // } else if(index == 2.0){
    //   //  Rotate cell 2 by -90 degrees
    //   _st = rotate2d(_st, PI * -0.5);
    // } else if(index == 3.0){
    //   //  Rotate cell 3 by 180 degrees
    //   _st = rotate2d(_st, PI);
    // }

    // Rotate Pattern 2
    if(index == 1.0){
      _st = rotate2d(_st, PI * -0.5);
    } else if(index == 2.0){
      _st = rotate2d(_st, PI * -0.5);
    } else if(index == 3.0){
      _st = rotate2d(_st, PI2);
    }

    return _st;
  }

  vec2 tile (vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
  }

  void main() {
    // vec2 st = gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    st = tile(st, 4.0);
    st = rotateTilePattern(st);
    // gl_FragColor = vec4(vec3(step(st.x,st.y)), 1.0);

    // Animation
    st = rotate2d(st, -PI * u_time * 0.25);

    float circle = circle(st, 4.0, vec2(0.5, -0.5));

    gl_FragColor = vec4(vec3(circle), 1.0);
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