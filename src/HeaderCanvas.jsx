import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js';

// Utility.
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getMiddleElement(arr) {
    if (arr.length > 0) {
        return arr[Math.floor((arr.length - 1) / 2)];
    } else {
        return null;
    }
}

// Scene.
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdfbbcc);

// Camera.
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

// Frustum bounds detection.
let frustum = new THREE.Frustum();
function updateFrustum() {
    camera.updateMatrix();
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();
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

// Mouse movement handling.
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function onPointerMove(event) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
}
window.addEventListener('pointermove', onPointerMove);

// Shape creation.
let shapes = [ ];
let shapeGrid = [ ];
let shapeVelocity = new THREE.Vector3(0.0025, 0.005, 0);

function generateShapes() {
    // Destroy old shapes, if any.
    for (let shape of shapes) {
        shape.removeFromParent();
    }

    shapes = [ ];
    shapeGrid = [ ];

    // Loosely find the boundaries of the canvas.
    let x = 1;
    while (x < 30 && frustum.containsPoint(new THREE.Vector3(x, 0, 0))) {
        x++;
    }

    let y = 1;
    while (y < 30 && frustum.containsPoint(new THREE.Vector3(0, y, 0))) {
        y++;
    }

    let circleGeometry = new THREE.CircleGeometry(0.25, 32);

    for (let i = -y; i <= y; i += 0.5) {
        let shapeRow = [ ];
        for (let j = -x; j <= x; j += 0.5) {
            // Every shape should have its own material, so that it may have its
            // own independent color.
            let shape = new THREE.Mesh(circleGeometry, new THREE.MeshBasicMaterial({
                color: 0x333333
            }));

            shape.position.x = j;
            shape.position.y = i;

            shapeRow.push(shape);
            shapes.push(shape);
            scene.add(shape);
        }
        shapeGrid.push(shapeRow);
    }
}
generateShapes();

let scalePoints = [ ];
scalePoints.push({
    scaleValue: 0.5,
    position: new THREE.Vector3(0, 0, 0),
    rotation: null
});

scalePoints.push({
    scaleValue: 0.75,
    position: new THREE.Vector3(0, 3, 0),
    rotation: {
        axis: new THREE.Vector3(0, 0, -1),
        radians: 0.01
    }
});

scalePoints.push({
    scaleValue: 0.75,
    position: new THREE.Vector3(0, -3, 0),
    rotation: {
        axis: new THREE.Vector3(0, 0, -1),
        radians: 0.01
    }
});

scalePoints.push({
    scaleValue: 0.6,
    position: new THREE.Vector3(0, 1, 0),
    rotation: {
        axis: new THREE.Vector3(0, 0, 1),
        radians: 0.03
    }
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

colorPoints.push({
    color: new THREE.Color(0x006600),
    position: new THREE.Vector3(0, 5, 0),
    rotation: {
        axis: new THREE.Vector3(0, 0, 1),
        radians: 0.02
    }
});

function moveTopRow() {
    let delta = shapeGrid.length * 0.5;
    let row = shapeGrid.pop();
    for (let shape of row) {
        shape.position.y -= delta;
    }
    shapeGrid.unshift(row);
}

function moveBottomRow() {
    let delta = shapeGrid.length * 0.5;
    let row = shapeGrid.shift();
    for (let shape of row) {
        shape.position.y += delta;
    }
    shapeGrid.push(row);
}

function moveRightColumn() {
    let delta = shapeGrid[0].length * 0.5;
    for (let row of shapeGrid) {
        let shape = row.pop();
        shape.position.x -= delta;
        row.unshift(shape);
    }
}

function moveLeftColumn() {
    let delta = shapeGrid[0].length * 0.5;
    for (let row of shapeGrid) {
        let shape = row.shift();
        shape.position.x += delta;
        row.push(shape);
    }
}

function isTopRowOob() {
    if (shapeVelocity.y <= 0) {
        return false;
    }

    let shape = getMiddleElement(shapeGrid[shapeGrid.length - 1]);
    let point = new THREE.Vector3(0, -0.5, 0);
    point.add(shape.position);

    return !frustum.containsPoint(point);
}

function isBottomRowOob() {
    if (shapeVelocity.y >= 0) {
        return false;
    }

    let shape = getMiddleElement(shapeGrid[0]);
    let point = new THREE.Vector3(0, 0.5, 0);
    point.add(shape.position);

    return !frustum.containsPoint(point);
}

function isRightColumnOob() {
    if (shapeVelocity.x <= 0) {
        return false;
    }

    let middleRow = getMiddleElement(shapeGrid);
    let shape = middleRow[middleRow.length - 1];
    let point = new THREE.Vector3(-0.5, 0, 0);
    point.add(shape.position);

    return !frustum.containsPoint(point);
}

function isLeftColumnOob() {
    if (shapeVelocity.x >= 0) {
        return false;
    }

    let shape = getMiddleElement(shapeGrid)[0];
    let point = new THREE.Vector3(0.5, 0, 0);
    point.add(shape.position);

    return !frustum.containsPoint(point);
}

function moveGrid() {
    if (isTopRowOob()) {
        moveTopRow();
    } else if (isBottomRowOob()) {
        moveBottomRow();
    }

    if (isLeftColumnOob()) {
        moveLeftColumn();
    } else if (isRightColumnOob()) {
        moveRightColumn();
    }
}

function updateShapes() {
    // Color and scale.
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

        shape.position.add(shapeVelocity);
    }
}

function advancePointMotion(point) {
    if (point && point.position && point.rotation) {
        point.position.applyAxisAngle(point.rotation.axis, point.rotation.radians);
    }
}

function updateScalePoints() {
    scalePoints.forEach((point) => advancePointMotion(point));
    colorPoints.forEach((point) => advancePointMotion(point));
}

// Window resize handling.
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    updateFrustum();

    renderer.setSize(width, height);
    composer.setSize(width, height);
    generateShapes();
}
window.addEventListener( 'resize', onWindowResize );

// Animation loop.
function animate() {
    updateScalePoints();
    moveGrid();
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
