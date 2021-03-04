'use strict';

// Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
    audio: false,
    video: true
};

function startStreaming(stream) {
    const video = document.querySelector('video');
    const videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream; // make variable available to browser console
    if ("srcObject" in video) {
        video.srcObject = stream;
    } else { // for older browser compatibility
        video.src = window.URL.createObjectURL(stream);
    }
}

function processError(e) {
    if (e.name == 'ConstraintNotSatisfiedError') {
        const v = constraints.video;
        setErrMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    } else if (e.name === 'PermissionDeniedError') {
        setErrMsg('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
    }
    setErrMsg(`getUserMedia error: ${e.name}`, e);
}

function setErrMsg(msg, err) {
    const e = document.querySelector("#errMsg");
    e.innerHTML += `<p>${msg}</p>`;

    if (typeof(err) != 'undefined')
        console.error(err);
}

async function init(e) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        startStreaming(stream);
        e.target.disabled = true;
    } catch (e) {
        processError(e);
    }
}

document.querySelector("#showVideo").addEventListener('click', e => init(e));