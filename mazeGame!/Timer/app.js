const durationInput = document.querySelector('#duration');
const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');
// let howCute;
const howCute = new Audio('./audio/how-cute.mp3');
let duration;
let potato;
new Timer(durationInput)