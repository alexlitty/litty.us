import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

// Scene.
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

// Camera.
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

// Rendering pipeline.
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

let composer = new EffectComposer(renderer);
composer.setPixelRatio(1);

let ssaaPass = new SSAARenderPass(scene, camera);
ssaaPass.sampleLevel = 2;
ssaaPass.unbiased = true;
composer.addPass(ssaaPass);

// Adding first shapes.
let circleGeometry = new THREE.CircleGeometry(0.25, 32);
let material = new THREE.MeshBasicMaterial( { color: 0x333333 } );

let shapes = [ ];
for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
        let shape = new THREE.Mesh(circleGeometry, material);
        shape.position.x = i;
        shape.position.y = j;

        shapes.push(shape);
        scene.add(shape);
    }
}

// Mouse movement handling.
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function onPointerMove(event) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );

    for (let shape of shapes) {
        console.log(shape);
        let v = raycaster.ray.distanceToPoint(shape.position);
        if (v < 2) {
            shape.scale.x = 1.5;
            shape.scale.y = 1.5;
        } else {
            shape.scale.x = 1;
            shape.scale.y = 1;
        }
    }
}
window.addEventListener( 'pointermove', onPointerMove );

// Window resize handling.
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);
}
window.addEventListener( 'resize', onWindowResize );

// Animation loop.
function animate() {
    requestAnimationFrame(animate);
    composer.render(scene, camera);
}
animate();

export default function HeaderCanvas() {
    return <div className="canvas-container" ref={
        (nodeElement) => {
            nodeElement && nodeElement.appendChild(renderer.domElement)
        }
    }/>;
};
