import * as HandTrack from 'handtrackjs'

const video = document.getElementById("videoElement")

navigator.mediaDevices.getUserMedia({ video: true })
    .then(doSomethingWithHandTrackIGuess)
    .catch(e => {
    })

document.getElementById('stopButton').addEventListener('click', () => {
    const stream = video.srcObject
    const tracks = stream.getTracks()

    for (let i = 0; i < tracks.length; ++i) {
        tracks[i].stop()
    }

    video.srcObject = null
})

async function doSomethingWithHandTrackIGuess(stream) {
    video.srcObject = stream

    console.log("this is being run")
    const model = await HandTrack.load()
    console.log("and so is this")
    const predictions = await model.detect(video.srcObject)
    console.log(predictions)
}
