import * as THREE from "three";

/**
 * setup Three.js environment.
 * @param {*} vshader vertex shader
 * @param {*} fshader fragment shader
 * @param {*} uniforms unform values
 * @returns camera, renderer
 */
export const setupEnvironment = (vshader, fshader, uniforms) => {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const canvas = document.querySelector("#webgl");
  canvas.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(2, 2);

  const material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vshader,
    fragmentShader: fshader
  } );

  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  camera.position.z = 1;

  return {scene, camera, renderer, uniforms};
}