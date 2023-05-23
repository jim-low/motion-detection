import * as HandTrack from 'handtrackjs'
import * as THREE from 'three'

// handtrack stuff
const container = document.getElementById("bigbigidk");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let isVideo = true;
let model = null;

video.hidden = true

const modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
};

// three js stuff
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
container.appendChild(renderer.domElement)

const cubeGeo = new THREE.BoxGeometry( 1, 1, 1 );
const cubeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.rotation.z = 5
scene.add(cube);

// wireframe
const wireGeo = new THREE.EdgesGeometry(cube.geometry)
const wireMat = new THREE.LineBasicMaterial({ color: 0x000000 })
const wireframe = new THREE.LineSegments(wireGeo, wireMat)
cube.add(wireframe)

camera.position.z = 5;

const speed = 0.05

function animateThreeScene() {
    requestAnimationFrame(animateThreeScene)
    renderer.render(scene, camera)
}

function startVideo() {
    HandTrack.startVideo(video).then(function (status) {
        runDetection();
    });
}

function runDetection() {
    model.detect(video).then((predictions) => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);

        for (const prediction of predictions) {
            if (prediction.label === "face") {
                continue
            }

            const leftDistance = prediction.bbox[0]
            if (leftDistance < (canvas.width / 2)) {
                if (prediction.label === "open") {
                    cube.rotateY(-speed)
                }
            }
            else {
                if (prediction.label === "open") {
                    cube.rotateY(speed)
                }
            }
        }

        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

// load the model
HandTrack.load(modelParams).then((lmodel) => {
    // detect objects in the image.
    model = lmodel;
    console.log(model);
    startVideo()
});

animateThreeScene()
