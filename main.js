import * as HandTrack from 'handtrackjs'

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const toggleButton = document.getElementById("toggleButton");

const leftHandResultText = document.getElementById("leftHand")
const rightHandResultText = document.getElementById("rightHand")

let isVideo = false;
let model = null;

video.hidden = true

const modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
};

function startVideo() {
    HandTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            isVideo = true;
            runDetection();
        } else {
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        startVideo();
    } else {
        HandTrack.stopVideo(video);
        isVideo = false;
    }
}

toggleButton.addEventListener("click", function () {
    toggleVideo();
});

function runDetection() {
    model.detect(video).then((predictions) => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);

        for (const prediction of predictions) {
            if (prediction.label === "face") {
                leftHandResultText.innerText = ""
                rightHandResultText.innerText = ""
                continue
            }

            const leftDistance = prediction.bbox[0]
            if (leftDistance < (canvas.width / 2)) {
                leftHandResultText.innerText = "left hand " + prediction.label
            }
            else {
                rightHandResultText.innerText = "right hand " + prediction.label
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
    toggleButton.disabled = false;
});
