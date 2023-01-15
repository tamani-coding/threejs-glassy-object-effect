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
const materialParams = gui.addFolder('physical-material-params');
materialParams.open();

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


const physicalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x72147E,
} as THREE.MeshPhysicalMaterialParameters);
// TODO sheen, roughnessMap, transmissionMap, attenuationTint, normalMap, environmentMap
physicalMaterial.clearcoat = 0.1;
physicalMaterial.ior = 1.7;
physicalMaterial.reflectivity = 0.5;
physicalMaterial.specularIntensity = 0.1;
physicalMaterial.roughness = 0.1;
physicalMaterial.thickness = 1;
physicalMaterial.transmission = 0.77;
physicalMaterial.metalness = 0.1;

materialParams.add(physicalMaterial, 'clearcoat').min(0).max(1);
materialParams.add(physicalMaterial, 'ior').min(1).max(2.33);
materialParams.add(physicalMaterial, 'reflectivity').min(0).max(1);
materialParams.add(physicalMaterial, 'specularIntensity').min(0).max(1);
materialParams.add(physicalMaterial, 'roughness').min(0).max(1);
materialParams.add(physicalMaterial, 'thickness').min(0).max(10);
materialParams.add(physicalMaterial, 'transmission').min(0).max(1);
materialParams.add(physicalMaterial, 'metalness').min(0).max(1);

const object = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 0), physicalMaterial);
object.position.z = 2;
object.position.x = 2;
object.position.y = 1;
object.castShadow = true;
scene.add(object);

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
    object.rotation.x += delta * 0.2;
    object.rotation.z += delta * 0.2;

    object.position.y = 1.5 + Math.sin(Date.now() * 0.005) * 0.15

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}