import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui'


const clock = new THREE.Clock();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(7, 10, 7);

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 0.9));

const spotLight = new THREE.SpotLight(new THREE.Color(0xF7FD04), 0.8, 15, 4);
spotLight.position.x = 5;
spotLight.position.y = 5;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
scene.add(spotLight);

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
const glassParams = gui.addFolder('glass-material-params');
glassParams.open();

let sphere, icosahedron;

const params = {
    normalMap: false,
    color: '#ffffff',
    sheenColor: '#ffffff',
    attenuationColor: '#ffffff',
}

const loader = new THREE.TextureLoader();

const envTexture = loader.load(
    "assets/chinese_garden.png"
);
envTexture.mapping = THREE.EquirectangularReflectionMapping; 

const normalMap = loader.load('assets/Abstract_011_normal.jpg');

const background = loader.load('assets/tokyo.png');
const backgroundMesh = new THREE.Mesh(new THREE.PlaneGeometry(15,10), new THREE.MeshPhongMaterial({ map: background }));
backgroundMesh.rotation.y = Math.PI / 4;
backgroundMesh.position.y = 5;
backgroundMesh.position.x = -1;
backgroundMesh.position.z = -1;
backgroundMesh.receiveShadow = true;
scene.add(backgroundMesh);

function initGlassObject() {

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        envMap: envTexture,
    } as THREE.MeshPhysicalMaterialParameters);

    glassMaterial.color = new THREE.Color( parseInt(params.color.replace('#','0x')) );
    glassMaterial.clearcoat = 0.8;
    glassMaterial.ior = 1.15;
    glassMaterial.specularIntensity = 0.6;
    glassMaterial.roughness = 0.0;
    glassMaterial.thickness = 0.5;
    glassMaterial.transmission = 1.0;
    glassMaterial.sheen = 0.0;
    glassMaterial.sheenColor = new THREE.Color( parseInt(params.sheenColor.replace('#','0x')) );

    glassParams.addColor(params, 'color').onChange( c => {
        glassMaterial.color = new THREE.Color( parseInt(c.replace('#', '0x')) );
    });
    glassParams.add(glassMaterial, 'transmission').min(0).max(1);
    glassParams.add(glassMaterial, 'ior').min(1).max(2.33);
    glassParams.add(glassMaterial, 'thickness').min(0).max(10);
    glassParams.add(glassMaterial, 'clearcoat').min(0).max(1);
    glassParams.add(glassMaterial, 'specularIntensity').min(0).max(1);
    glassParams.add(glassMaterial, 'roughness').min(0).max(1);
    glassParams.add(glassMaterial, 'sheen').min(0).max(1);
    glassParams.addColor(params, 'sheenColor').onChange( c => {
        glassMaterial.sheenColor = new THREE.Color( parseInt(c.replace('#', '0x')) );
    });
    glassParams.add(params, 'normalMap').name('normal map').onChange( (v) => {
        if (params.normalMap)
            glassMaterial.normalMap = normalMap;
        else 
            glassMaterial.normalMap = null;
        glassMaterial.needsUpdate = true;
    });
    sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), glassMaterial);
    sphere.position.z = 2;
    sphere.position.x = 2;
    sphere.position.y = 3;
    sphere.castShadow = true;
    scene.add(sphere);

    icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), glassMaterial);
    icosahedron.position.z = 0;
    icosahedron.position.x = 4;
    icosahedron.position.y = 3;
    icosahedron.castShadow = true;
    scene.add(icosahedron);
}

initGlassObject();

const ground = new THREE.Mesh(new THREE.BoxGeometry(15, 15), new THREE.MeshPhongMaterial({ color: 0xF54748 }));
ground.rotation.x = - Math.PI / 2;
ground.rotation.x = - Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

animate();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    TWEEN.update();

    const delta = clock.getDelta();

    if (sphere) {
        sphere.rotation.x += delta * 0.2;
        sphere.rotation.z += delta * 0.2;
    }
    if (icosahedron) {
        icosahedron.rotation.x -= delta * 0.2;
        icosahedron.rotation.z -= delta * 0.2;
    }

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}