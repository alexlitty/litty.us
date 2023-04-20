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

// Frustum bounds detection.
let frustum = new THREE.Frustum();
function updateFrustum() {
    camera.updateMatrix();
    camera.updateMatrixWorld();
    let matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matrix);
}
updateFrustum();

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
let shapes = [ ];

function generateShapes() {
    // Loosely find the boundaries of the canvas.
    let x = 1;
    while (x < 30 && frustum.containsPoint(new THREE.Vector3(x, 0, 0))) {
        x++;
    }

    let y = 1;
    while (y < 30 && frustum.containsPoint(new THREE.Vector3(0, y, 0))) {
        y++;
    }

    let shapeRaycaster = new THREE.Raycaster();
    let circleGeometry = new THREE.CircleGeometry(0.25, 32);

    for (let i = -x; i <= x; i += 0.5) {
        for (let j = -y; j <= y; j += 0.5) {
            let shape = new THREE.Mesh(circleGeometry, new THREE.MeshBasicMaterial({
                color: 0x333333
            }));

            shape.position.x = i;
            shape.position.y = j;

            shapes.push(shape);
            scene.add(shape);
        }
    }
}
generateShapes();

// Mouse movement handling.
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function onPointerMove(event) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );
}
window.addEventListener( 'pointermove', onPointerMove );

let scalePoints = [ ];
scalePoints.push({
    scaleValue: 0.5,
    position: new THREE.Vector3(0, 0, 0)
});

let colorPoints = [ ];
colorPoints.push({
    color: new THREE.Color(0xcc3311),
    position: new THREE.Vector3(3, -3, 0)
});

colorPoints.push({
    color: new THREE.Color(0x0000FF),
    position: new THREE.Vector3(1, 1, 0)
});

function updateShapes() {
    for (let shape of shapes) {
        let scale = Math.min(1, 1 / raycaster.ray.distanceSqToPoint(shape.position));
        for (let scalePoint of scalePoints) {
            scale = Math.max(scale, Math.min(scalePoint.scaleValue, 1 / scalePoint.position.distanceToSquared(shape.position)));
        }
        shape.scale.x = shape.scale.y = scale;

        let color = new THREE.Color(0x333333);
        for (let colorPoint of colorPoints) {
            let d = Math.min(1, 1 / shape.position.distanceTo(colorPoint.position));
            let tmpColor = colorPoint.color.clone();
            tmpColor.multiplyScalar(d);
            color.add(tmpColor);
        }
        shape.material.color = color;

        shape.position.y += 0.005;
    }
}

// Window resize handling.
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    updateFrustum();

    renderer.setSize(width, height);
    composer.setSize(width, height);
}
window.addEventListener( 'resize', onWindowResize );

// Animation loop.
function animate() {
    updateShapes();
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