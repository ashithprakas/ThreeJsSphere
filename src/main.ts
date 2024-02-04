import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

//Create our sphere
const scene: THREE.Scene = new THREE.Scene();
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
//Sizes

var sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
//Lights
const light = new THREE.PointLight(0xfffffff, 1, 100);
light.intensity = 70;
light.position.set(0, 0, 10);
scene.add(light);
//Camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  5,
  100
);
camera.position.z = 20;
scene.add(camera);

//Renderer
const canvas: HTMLCanvasElement = document.querySelector(".webGLRender");
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //update camera
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

//Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo("h1", { opacity: "0" }, { opacity: "1" });

//Mouse Animation Color
let currentSphereColor = [];
let isMouseDown;
window.addEventListener("mousedown", () => {
  isMouseDown = true;
});
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", () => {
  isMouseDown = false;
});

function onMouseMove(e: MouseEvent) {
  if (!isMouseDown) return;
  currentSphereColor = [
    Math.round(e.pageX / sizes.width) * 255,
    Math.round(e.pageY / sizes.height) * 255,
    150,
  ];

  let newColor = new THREE.Color(`rgb(${currentSphereColor.join(",")})`);
  gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b });
}
