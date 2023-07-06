// Get reference to canvas
const canvas = document.getElementById('arkanoidGame');
const context = canvas.getContext('2d');

// Set the dimensions of the canvas
canvas.width = 800;
canvas.height = 600;

// Define the paddle
const paddleWidth = 75, paddleHeight = 20;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight;
let paddleDX = 4;

// Define the ball
let ballX = canvas.width / 2, ballY = canvas.height - 30;
let ballRadius = 10;
let ballDX = 2, ballDY = -2;



let score = 0;
function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Score: " + score, 8, 20);
}


// Draw the paddle
function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

// Draw the ball
function drawBall() {
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}


// Draw the game
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle();
    drawBlocks();
    drawBall();
    drawScore();

    
    
    if(checkWin()) {
        showGameOverModal("YOU WIN, CONGRATULATIONS!");
        return;
    }
    
    // Move the paddle
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleDX;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= paddleDX;
    }

    // Move the ball
    ballX += ballDX;
    ballY += ballDY;

    
    // Collision detection
    for(let c = 0; c < blockColumnCount; c++) {
        for(let r = 0; r < blockRowCount; r++) {
            let b = blocks[c][r];
            if(b.status == 1) {
                if(ballX > b.x && ballX < b.x+blockWidth && ballY > b.y && ballY < b.y+blockHeight) {
                    ballDY = -ballDY;
                    b.status = 0;
                    score++;
                }
            }
        }
    }  
    
    let paddleInf = false;
    // Ball and wall collision detection
    if(ballX + ballDX > canvas.width-ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX;
    }
    if(ballY + ballDY < ballRadius) {
        ballDY = -ballDY;
    } else if(ballY + ballDY > canvas.height-ballRadius) {
        if(ballX > paddleX && ballX < paddleX + paddleWidth) {
            let hitPoint = ballX - (paddleX + paddleWidth / 2);
            let ballSpeed = Math.sqrt(ballDX * ballDX + ballDY * ballDY);  // Total speed of the ball
            let hitRatio = hitPoint / (paddleWidth / 2);  // Normalize to -1..1

            ballDX = ballSpeed * hitRatio;
            ballDY = -Math.sqrt(ballSpeed * ballSpeed - ballDX * ballDX);  // Adjust ballDY based on ballDX
        } else {
            showGameOverModal("GAME OVER");
            return;
        }
    }

    requestAnimationFrame(draw);
}


let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event) {
    if(event.key === "Right" || event.key === "ArrowRight") {
        rightPressed = true;
    } else if(event.key === "Left" || event.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(event) {
    if(event.key === "Right" || event.key === "ArrowRight") {
        rightPressed = false;
    } else if(event.key === "Left" || event.key === "ArrowLeft") {
        leftPressed = false;
    }
}



// Define the blocks
const blockRowCount = 3;
const blockColumnCount = 5;
const blockWidth = 75;
const blockHeight = 20;
const blockPadding = 10;
const blockOffsetTop = 30;
const blockOffsetLeft = 30;

let blocks = [];
for(let c = 0; c < blockColumnCount; c++) {
    blocks[c] = [];
    for(let r = 0; r < blockRowCount; r++) {
        blocks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBlocks() {
    for(let c = 0; c < blockColumnCount; c++) {
        for(let r = 0; r < blockRowCount; r++) {
            if(blocks[c][r].status == 1) {
                let blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
                let blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;
                context.beginPath();
                context.rect(blockX, blockY, blockWidth, blockHeight);
                context.fillStyle = "#0095DD";
                context.fill();
                context.closePath();
            }
        }
    }
}



function checkWin() {
    let isWin = true;
    for(let c = 0; c < blockColumnCount; c++) {
        for(let r = 0; r < blockRowCount; r++) {
            if(blocks[c][r].status == 1) {
                isWin = false;
                break;
            }
        }
    }
    return isWin;
}


function restartGame() {
    let modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
    document.location.reload();
}

function closeModal() {
    let modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
}

function showGameOverModal(message) {
    let modal = document.getElementById("gameOverModal");
    let gameOverMessage = document.getElementById("gameOverMessage");
    gameOverMessage.textContent = message;
    modal.style.display = "block";
}

draw();


