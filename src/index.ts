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
const glassParams = gui.addFolder('glass-material-params');
glassParams.open();

let glassObject;

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
const params = {
    normalMap: true,
    color: '#ffffff',
    sheenColor: '#ffffff',
    attenuationColor: '#ffffff',
}

const loader = new THREE.TextureLoader();
const normalMap = loader.load('assets/Abstract_011_normal.jpg');

const background = loader.load('assets/tokyo.png');

const backgroundMesh = new THREE.Mesh(new THREE.PlaneGeometry(15,10), new THREE.MeshPhongMaterial({ map: background }));
backgroundMesh.rotation.y = Math.PI / 4;
backgroundMesh.position.y = 5;
scene.add(backgroundMesh);

function initGlassObject() {
    // for glass objects - ior (reflectivity), thickness, transmission > 0, clearcoat, roughness
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        normalMap: normalMap,
    } as THREE.MeshPhysicalMaterialParameters);
    // TODO sheen, roughnessMap, transmissionMap, attenuationTint, normalMap, environmentMap
    glassMaterial.color = new THREE.Color(params.color.replace('#','0x'));
    glassMaterial.clearcoat = 0.1;
    glassMaterial.ior = 1.15;
    glassMaterial.specularIntensity = 0.1;
    glassMaterial.roughness = 0.1;
    glassMaterial.thickness = 0.5;
    glassMaterial.transmission = 1.0;
    glassMaterial.sheen = 1.0;
    glassMaterial.sheenColor = new THREE.Color(params.sheenColor.replace('#','0x'));
    glassMaterial.attenuationColor = new THREE.Color(params.attenuationColor.replace('#','0x'));
    glassMaterial.attenuationDistance = 0.7;

    glassParams.add(glassMaterial, 'clearcoat').min(0).max(1);
    glassParams.add(glassMaterial, 'ior').min(1).max(2.33);
    glassParams.add(glassMaterial, 'specularIntensity').min(0).max(1);
    glassParams.add(glassMaterial, 'roughness').min(0).max(1);
    glassParams.add(glassMaterial, 'thickness').min(0).max(10);
    glassParams.add(glassMaterial, 'transmission').min(0).max(1);
    glassParams.add(glassMaterial, 'sheen').min(0).max(1);
    glassParams.add(glassMaterial, 'attenuationDistance').min(0).max(100);
    glassParams.add(params, 'normalMap').name('normal map').onChange( (v) => {
        if (params.normalMap)
            glassMaterial.normalMap = normalMap;
        else 
            glassMaterial.normalMap = null;
        glassMaterial.needsUpdate = true;
    });
    glassParams.addColor(params, 'color').onChange( c => {
        glassMaterial.color = new THREE.Color( parseInt(c.replace('#', '0x')) );
    });
    glassParams.addColor(params, 'sheenColor').onChange( c => {
        glassMaterial.sheenColor = new THREE.Color( parseInt(c.replace('#', '0x')) );
    });
    glassParams.addColor(params, 'attenuationColor').onChange( c => {
        glassMaterial.attenuationColor = new THREE.Color( parseInt(c.replace('#', '0x')) );
    });

    // IcosahedronGeometry
    glassObject = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), glassMaterial);
    glassObject.position.z = 2;
    glassObject.position.x = 2;
    glassObject.position.y = 3;
    glassObject.castShadow = true;
    scene.add(glassObject);
}

initGlassObject();
// initMetalObject();

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.25), new THREE.MeshPhongMaterial({ color: 0xFF7B54 }));
sphere.position.z = 5;
sphere.position.x = 3;
sphere.position.y = 1;
sphere.castShadow = true;
scene.add(sphere);


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

    if (glassObject) {
        glassObject.rotation.x += delta * 0.2;
        glassObject.rotation.z += delta * 0.2;
    }

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}