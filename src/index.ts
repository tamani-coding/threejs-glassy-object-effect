import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui'


const clock = new THREE.Clock();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(7, 3, 7);

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 0.9));

const spotLight = new THREE.SpotLight(new THREE.Color(0xF7FD04), 0.8);
spotLight.position.x = 5;
spotLight.position.y = 5;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
scene.add(spotLight);

// const dirLight = new THREE.DirectionalLight(0xffffff, 1);
// dirLight.position.set(5, 10, 7.5);
// dirLight.castShadow = true;
// dirLight.shadow.camera.right = 3;
// dirLight.shadow.camera.left = - 3;
// dirLight.shadow.camera.top = 3;
// dirLight.shadow.camera.bottom = - 3;
// dirLight.shadow.mapSize.width = 1024;
// dirLight.shadow.mapSize.height = 1024;
// scene.add(dirLight);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x453C67);
window.addEventListener('resize', onWindowResize);
document.body.appendChild(renderer.domElement);


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 20;
controls.update();

// GUI
const gui = new GUI();
// const stencilParams = gui.addFolder('stencilParams');
// stencilParams.add(params.stencilMesh, 'z').min(- 1).max(1).onChange(d => {
//         stencilMesh.position.z = d
//         stencilHelper.update();
// });
// stencilParams.open();

const envTexture = new THREE.CubeTextureLoader().load([
    'assets/pos-x.png',
    'assets/neg-x.png',
    'assets/pos-y.png',
    'assets/neg-y.png',
    'assets/pos-z.png',
    'assets/neg-z.png',
])
envTexture.mapping = THREE.CubeReflectionMapping
scene.environment = envTexture
scene.background = envTexture


const highlightedMaterial = new THREE.MeshPhysicalMaterial({
    // thickness: 1.0,
    roughness: 0.1,
    clearcoat: 0.1,
    transmission: 0.77,
    ior: 1.7,
    color: 0x72147E,
} as THREE.MeshPhysicalMaterialParameters);

const octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 0), highlightedMaterial);
octahedron.position.z = 2;
octahedron.position.x = 2;
octahedron.position.y = 1;
octahedron.castShadow = true;
scene.add(octahedron);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.25), new THREE.MeshPhongMaterial( { color : 0xFF7B54 } ));
sphere.position.z = 0;
sphere.position.x = 0;
sphere.position.y = 1;
sphere.castShadow = true;
scene.add(sphere);


const plane = new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.MeshPhongMaterial( { color: 0xF54748 } ));
plane.rotation.x = - Math.PI / 2;
plane.rotation.x = - Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

animate();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    TWEEN.update();

    const delta = clock.getDelta();
    octahedron.rotation.y += delta * 0.1;

    octahedron.position.y = 1.5 + Math.sin(Date.now() * 0.005) * 0.15

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}