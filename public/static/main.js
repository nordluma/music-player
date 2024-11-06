import io from "socket.io-client";

const dropArea = document.getElementById("dropArea");
const canvas = document.getElementById("canvas");
const audio = document.getElementById("audio");
const filenameDisplay = document.getElementById("file-name");

const ctx = canvas.getContext("2d");
const socket = io();

let audioCtx, analyser, dataArr;

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
});
dropArea.addEventListener("drop", async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const fileUrl = URL.createObjectURL(file);

    audio.src = fileUrl;
    await audio.play();

    filenameDisplay.textContent = `Playing: ${file.name}`;

    if (!audioCtx) initAudioCtx();
});

function initAudioCtx() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();

    analyser.fftSize = 256;
    const bufferLen = analyser.frequencyBinCount;
    dataArr = new Uint8Array(bufferLen);

    src.connect(analyser);
    analyser.connect(audioCtx.destination);

    animate();
}

function animate() {
    requestAnimationFrame();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / dataArr.length) * 2.5;
    let x = 0;
    for (let i = 0; i < dataArr.length; i++) {
        const barHeight = dataArr[i];
        ctx.fillStyle = `rgb(0, 0, 0)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}
