import{setboardColor,setballColor,setblockColor,setplayerColor,setwordColor}from './color.js';

//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context; 



//players
let playerWidth = 80; //500 for testing, 80 normal
let playerHeight = 10;
let playerVelocityX = 10; //move 10 pixels each time

let player = {
    x : boardWidth/2 - playerWidth/2,
    y : boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX : playerVelocityX
}

//ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 0; //15 for testing, 3 normal
let ballVelocityY = 2; //10 for testing, 2 normal

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width: ballWidth,
    height: ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8; 
let blockRows = 3; //add more as game goes on
let blockMaxRows = 10; //limit how many rows
let blockCount = 0;

//starting block corners top left 
let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;
let moneycount=0;



// 新增背景顏色變換的函數
function changeBackgroundColor() {
    const color = prompt("請選擇背景顏色 (輸入顏色名稱，如 'red', 'blue', 'green'):");
    if (color) {
        board.style.backgroundColor = color;
        // 將顏色保存到 sessionStorage 中
        setboardColor('backgroundColor', color);
    }
}





// 綁定按鈕點擊事件
document.getElementById("changeBackgroundColor").addEventListener("click", changeBackgroundColor);

// 新增返回初始畫面按鈕的功能
document.getElementById("goToInitialScreen").addEventListener("click", function() {
    window.location.href = "index.html";
});



// 新增變數來保存顏色
let ballColor = "white";  // 預設球顏色
let blockColor = "skyblue";  // 預設遊戲板顏色
let playerColor = "lightgreen";
let wordColor = "white";

// 用來改變球顏色的函數
function changeBallColor() {
    const color = prompt("請選擇球的顏色 (輸入顏色名稱，如 'red', 'blue', 'green'):");
    if (color) {
        ballColor = color; // 更新球的顏色
        setballColor('ballColor', color);
    }
}

// 用來改變方塊顏色的函數
function changeBlockColor() {
    const color = prompt("請選擇方塊顏色 (輸入顏色名稱，如 'red', 'blue', 'green'):");
    if (color) {
        blockColor = color; // 更新方塊顏色
        setblockColor('blockColor', color);
    }
}

// 用來改變玩家顏色的函數
function changePlayerColor() {
    const color = prompt("請選擇玩家顏色 (輸入顏色名稱，如 'red', 'blue', 'green'):");
    if (color) {
        playerColor = color; // 更新角色顏色
        setplayerColor('playerColor', color);
    }
}

// 用來改變文字顏色的函數
function changeWordColor() {
    const color = prompt("請選擇球的顏色 (輸入顏色名稱，如 'red', 'blue', 'green'):");
    if (color) {
        wordColor = color; // 更新球的顏色
        setwordColor('wordColor', color);
    }
}


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    // 檢查並應用背景顏色
    const savedBackgroundColor = sessionStorage.getItem('backgroundColor');
    if (savedBackgroundColor) {
        board.style.backgroundColor = savedBackgroundColor;
    }

    // 检查并应用球的颜色
    const savedBallColor = sessionStorage.getItem('ballColor');
    if (savedBallColor) {
        ballColor = savedBallColor;
    }

    // 检查并应用磚塊的颜色
    const savedBlockColor = sessionStorage.getItem('blockColor');
    if (savedBlockColor) {
        blockColor = savedBlockColor;
    }

    // 检查并应用玩家的颜色
    const savedPlayerColor = sessionStorage.getItem('playerColor');
    if (savedPlayerColor) {
        playerColor = savedPlayerColor;
    }

    // 检查并应用文字的颜色
    const savedWordColor = sessionStorage.getItem('wordColor');
    if (savedWordColor) {
        wordColor = savedWordColor;
    }


    //draw initial player
    //context.fillStyle="skyblue";
    //context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    //document.addEventListener("keydown", movePlayer);

    //create blocks
    createBlocks();

    // 新增：監聽背景顏色變更按鈕
    document.getElementById("changeBackgroundColor").addEventListener("click", changeBackgroundColor);
    // 新增：監聽球顏色變更按鈕
    document.getElementById("changeBallColor").addEventListener("click", changeBallColor);

    // 新增：監聽方塊顏色變更按鈕
    document.getElementById("changeBlockColor").addEventListener("click", changeBlockColor);

    // 新增：監聽玩家顏色變更按鈕
    document.getElementById("changePlayerColor").addEventListener("click", changePlayerColor);

    // 新增：監聽文字顏色變更按鈕
    document.getElementById("changeWordColor").addEventListener("click", changeWordColor);
}





function update() {
    requestAnimationFrame(update);
    //stop drawing
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // player
    context.fillStyle =playerColor;
    context.fillRect(player.x, player.y, player.width, player.height);

    // ball
    context.fillStyle = ballColor;
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //bounce the ball off player paddle
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1;   // flip y direction up or down
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1;   // flip x direction left or right
    }

    if (ball.y <= 0) { 
        // if ball touches top of canvas
        ball.velocityY *= -1; //reverse direction
    }
    else if (ball.x <= 0 || (ball.x + ball.width >= boardWidth)) {
        // if ball touches left or right of canvas
        ball.velocityX *= -1; //reverse direction
    }
    else if (ball.y + ball.height >= boardHeight) {
        // if ball touches bottom of canvas
        context.font = "20px sans-serif";
        context.fillStyle = wordColor;
        context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameOver = true;
    }

    //blocks
    context.fillStyle = blockColor;
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                   // block is broken
                ball.velocityY *= -1;   // flip y direction up or down
                            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                                ball.velocityX *= -1;   // flip x direction left or right
                            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    //next level
    if (blockCount == 0) {
        score += 100*blockRows*blockColumns; //bonus points :)
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

    //score
    context.font = "20px sans-serif";
    context.fillStyle = wordColor;
    context.fillText(score, 10, 25);
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
            console.log("RESET");
        }
        return;
    }
    if (e.code == "ArrowLeft") {
        // player.x -= player.velocityX;
        let nextplayerX = player.x - player.velocityX - 30;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
    }
    else if (e.code == "ArrowRight") {
        let nextplayerX = player.x + player.velocityX + 30;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
        // player.x += player.velocityX;    
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function topCollision(ball, block) { //a is above b (ball is above block)
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) { //a is above b (ball is below block)
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) { //a is left of b (ball is left of block)
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) { //a is right of b (ball is right of block)
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
    blockArray = []; //clear blockArray
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x : blockX + c*blockWidth + c*10, //c*10 space 10 pixels apart columns
                y : blockY + r*blockHeight + r*10, //r*10 space 10 pixels apart rows
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function resetGame() {
    gameOver = false;
    player = {
        x : boardWidth/2 - playerWidth/2,
        y : boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX : playerVelocityX
    }
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }
    blockArray = [];
    blockRows = 3;
    score = 0;
    createBlocks();
}

