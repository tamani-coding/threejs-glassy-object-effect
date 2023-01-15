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

const normalMap = new THREE.TextureLoader().load('assets/Abstract_011_normal.jpg');

// for glass objects - ior (reflectivity), thickness, transmission > 0, clearcoat, roughness
const glassMaterial = new THREE.MeshPhysicalMaterial({
    normalMap: normalMap,
    // color: 0x72147E,
    color: 0xFFFFFF,
} as THREE.MeshPhysicalMaterialParameters);
// TODO sheen, roughnessMap, transmissionMap, attenuationTint, normalMap, environmentMap
glassMaterial.clearcoat = 0.1;
glassMaterial.ior = 1.5;
// physicalMaterial.reflectivity = 0.5;
glassMaterial.specularIntensity = 0.1;
glassMaterial.roughness = 0.1;
glassMaterial.thickness = 1;
glassMaterial.transmission = 0.99;
glassMaterial.metalness = 0.0;
glassMaterial.sheen = 0.7;
glassMaterial.sheenColor = new THREE.Color(0xFFFFFF);


materialParams.add(glassMaterial, 'clearcoat').min(0).max(1);
materialParams.add(glassMaterial, 'ior').min(1).max(2.33);
// materialParams.add(physicalMaterial, 'reflectivity').min(0).max(1);
materialParams.add(glassMaterial, 'specularIntensity').min(0).max(1);
materialParams.add(glassMaterial, 'roughness').min(0).max(1);
materialParams.add(glassMaterial, 'thickness').min(0).max(10);
materialParams.add(glassMaterial, 'transmission').min(0).max(1);
materialParams.add(glassMaterial, 'metalness').min(0).max(1);
materialParams.add(glassMaterial, 'sheen').min(0).max(1);

// IcosahedronGeometry
const glassObject = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), glassMaterial);
glassObject.position.z = 2;
glassObject.position.x = 2;
glassObject.position.y = 1.5;
glassObject.castShadow = true;
scene.add(glassObject);

// for metal objects - transmission = 0, metalness, clearcoat, roughness


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
    glassObject.rotation.x += delta * 0.2;
    glassObject.rotation.z += delta * 0.2;

    // object.position.y = 1.5 + Math.sin(Date.now() * 0.005) * 0.15

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}