const player = document.getElementById('player');
const ghost = document.getElementById('ghost');
const deathSound = document.getElementById('death');
const bgmAudio = document.getElementById('bgm');
const runAudio = document.getElementById('run');
const scoreDisplay = document.getElementById("score");

const layers = document.querySelectorAll('.background-layer');
const numLayers = layers.length;
const scrollSpeeds = [1, 2, 3]; 
const layerWidth = 3840; 

let canTriggerEvent = true 
let hasExecuted = false 
let isJumping = false;
let score = 0;
let scoreInterval;
let isGameActive = true;
let isScrolling = true;

bgmAudio.volume = 0.1;
runAudio.volume = 0.1;
deathSound.volume = 0.1;

const layerPositions = Array.from({ length: numLayers }, () => 0);

function scrollBackground() {
    for (let i = 0; i < numLayers; i++) {
        layerPositions[i] -= scrollSpeeds[i];
        layers[i].style.transform = `translateX(${layerPositions[i]}px)`;

        if (layerPositions[i] <= -layerWidth) {
            layerPositions[i] = 0;
        }
    }

    if (isScrolling) {
        requestAnimationFrame(scrollBackground);
    }
}
scrollBackground();

function jump() {
    if (!isJumping) {
        isJumping = true;
        player.style.transform = "translateY(-200px)";
        // player.style.transform = "translateX(50px)";

        setTimeout(() => {
            player.style.transform += " translateX(50px)";
        }, 0); 

        setTimeout(() => {
            player.style.transform = "translate(50px, 0px)";
            // player.style.transform = "translateX(50px)";
            isJumping = false;
        }, 750);
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key === " ") { 
        jump();
    }
});

document.addEventListener("click", function() {
    if (!isJumping) {
        jump();
    }
});

scoreInterval = setInterval(() => {
    score++;
    scoreDisplay.textContent = score;
}, 500);

function checkCollision() {
    if (!isGameActive) {
        return;
    }

    const playerRect = player.getBoundingClientRect();
    const ghostRect = ghost.getBoundingClientRect();

    console.log("Player:", playerRect);
    console.log("Ghost:", ghostRect);



    if (
        playerRect.right > ghostRect.left &&
        playerRect.bottom > ghostRect.top &&
        playerRect.left < ghostRect.right
    ) {
        isGameActive = false;
        stopAnimation();
        clearInterval(scoreInterval);
        scoreDisplay.style.display = "none";

        Swal.fire({
            title: 'Game Over',
            text: 'Score :  ' + score,
          }).then((result) => {
            if(result.isConfirmed){
                window.location.reload();
            }
          });

        deathSound.currentTime = 0;
        deathSound.play();

        hasExecuted = true;

        // Clear the score update interval
        clearInterval(scoreInterval);
    }
}

function stopAnimation(){
    isScrolling = false;
    ghost.style.animationPlayState = 'paused' 
    scoreDisplay.style.display = "none"
}

function stopAudio() {
    bgmAudio.pause();
    runAudio.pause();
}

setInterval(() => {
    if (isGameActive){
        checkCollision() 
    }
}, 100)