import {  getMoney, setMoney,setTool1,getTool1,setTool2,getTool2,setTool3,getTool3,getx} from './共用.js';


// 更新 sharedData.money 為 sessionStorage 中的值
let money = getMoney();
let tool1 = getTool1();
let tool2 = getTool2();

//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context; 

let usebomb=0;
let bombexplode=0;
let uselaser=0;
let laserbreak=0;
//多球道具
let manyball=0;
let manyballbreak=0;
let useCoin=3;
//let coinquantity=0;
let countcoin=0;
let score = 0;
let gameOver = false;
let startgame = false;
//players
let playerWidth =80; //500 for testing, 80 normal
let playerHeight = 10;
let playerVelocityX = 10; //move 10 pixels each time

let player = {
    x : boardWidth/2 - playerWidth/2,
    y : boardHeight - playerHeight ,
    width: playerWidth,
    height: playerHeight,
    velocityX : playerVelocityX
}

//ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = Math.random() > 0.5 ?3 : -3; //15 for testing, 3 normal; //15 for testing, 3 normal
let ballVelocityY = -2; //10 for testing, 2 normal

let ball = {
    x : Math.random() * (boardWidth - ballWidth),
    y : boardHeight-ballHeight-15,
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
let blocknum=1;

//starting block corners top left 
let blockX = 15;
let blockY = 45;


//炸彈
let bombWidth =20;
let bombHeight = 20;
let bombVelocityX = Math.random() > 0.5 ? 3 : -3; //15 for testing, 3 normal
let bombVelocityY = -2; //10 for testing, 2 normal

let bomb = {
    x: Math.random() * (boardWidth - bombWidth), // 随机生成 x 坐标
    y : boardHeight - playerHeight - 5,
    width: bombWidth,
    height: bombHeight,
    velocityX : bombVelocityX,
    velocityY : bombVelocityY
}
console.log(bomb.x); // 输出炸弹的随机生成位置

//穿透球
let laserWidth = 30; 
let laserHeight = 30; 
let laserVelocityX = Math.random() > 0.5 ? 3 : -3; //15 for testing, 3 normal
let laserVelocityY = -2; 
let laser = {
    x: Math.random() * (boardWidth - bombWidth), // 随机生成 x 坐标
    y : boardHeight - playerHeight - 5,
    width: laserWidth,
    height: laserHeight,
    velocityX : laserVelocityX,
    velocityY : laserVelocityY
}
console.log(laser.x); 

// 新增變數來保存顏色
let ballColor = "white";  // 預設球顏色
let blockColor = "skyblue";  // 預設遊戲板顏色
let playerColor = "lightgreen";
let wordColor = "white";

// 新增返回初始畫面按鈕的功能
document.getElementById("goToInitialScreen").addEventListener("click", function() {
    window.location.href = "index.html";
});

//道具1按鈕觸發
document.getElementById("tool1-button").addEventListener("click", function() {
    if(getTool1()>1&&usebomb==0){
        usebomb=1;
        bomb = {
            x: Math.random() * (boardWidth - bombWidth), // 随机生成 x 坐标
            y : boardHeight - playerHeight - 5,
            width: bombWidth,
            height: bombHeight,
            velocityX : bombVelocityX,
            velocityY : bombVelocityY
        }
        bombexplode = 0;
        console.log(bomb.x); // 输出炸弹的随机生成位置
        setTool1(getTool1()-1);
        }
});

//道具2按鈕觸發
document.getElementById("tool2-button").addEventListener("click", function() {
    if(getTool2()>1&&uselaser==0){
        uselaser=1;
        laser = {
            x: Math.random() * (boardWidth - bombWidth), // 随机生成 x 坐标
            y : boardHeight - playerHeight - 5,
            width: laserWidth,
            height: laserHeight,
            velocityX : laserVelocityX,
            velocityY : laserVelocityY
        }
        laserbreak=0;
        console.log(laser.x);
        setTool2(getTool2()-1);
        }
});

document.getElementById("tool3-button").addEventListener("click", function() {
    if(getTool3()>1){
        manyball = 1; // 激活生成
        manyballbreak = 0; // 重置落地标志
        generateBalls(); // 生成球
        setTool3(getTool3()-1);
        }
});



window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    
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
   
    
    
    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    // 創建方塊
    createBlocks();
}

//遊戲開始前畫面
function renderInitialState() {
    // 绘制所有内容，包括砖块、球、玩家、道具和金币
    context.clearRect(0, 0, board.width, board.height);

    // 绘制玩家
    context.fillStyle = playerColor;
    context.fillRect(player.x, player.y, player.width, player.height);

    // 绘制球
    context.fillStyle = ballColor;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    

    // 绘制所有砖块
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            context.fillStyle = blockColor;
            context.fillRect(block.x, block.y, block.width, block.height);
            context.fillStyle = wordColor;
            context.font = "bold 11px Arial";
            let text = block.hits.toString();
            let textWidth = context.measureText(text).width;
            let blocktextX = block.x + (block.width - textWidth) / 2;
            let blocktextY = block.y + (block.height / 2) + 4;
            context.fillText(text, blocktextX, blocktextY);
        }
    }

    //score
  context.font = "20px sans-serif";
  context.fillStyle = wordColor;
  context.fillText(score, 10, 25);

   //coin
   context.font = "20px sans-serif";
   context.fillStyle = wordColor;
   context.fillText(getMoney()-1,485+getx(getMoney()-1), 25);
  
   //usecoin
    //context.font = "20px sans-serif";
    //context.fillStyle = wordColor;
    //context.fillText(useCoin,485+getx(useCoin), 42);

    //道具1
   //context.font = "15px sans-serif";
   //context.fillStyle = wordColor;
   //context.fillText("爆炸",465, 180);
   context.font = "20px sans-serif";
   context.fillText(getTool1()-1,485+getx(getTool1()-1), 180);
   //道具2
   //context.font = "15px sans-serif";
   //context.fillStyle = wordColor;
   //context.fillText("穿透",465, 240);
   context.font = "20px sans-serif";
   context.fillText(getTool2()-1,485+getx(getTool2()-1), 240);
   //道具3
   context.font = "20px sans-serif";
   context.fillText(getTool3()-1,485+getx(getTool3()-1), 300);

    // 显示提示信息：按空白键开始游戏
    context.font = "20px sans-serif";
    context.fillStyle = wordColor;
    context.fillText("點擊空白鍵開始遊戲", 160, 350);  // 显示提示信息
}

function update() {
    requestAnimationFrame(update);
    if (!startgame) {
        renderInitialState();  // 绘制初始状态的所有元素
        return;  // 不进行后续绘制，等待玩家按下空白键开始游戏
    }
    
    //stop drawing
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // player
    context.fillStyle = playerColor;
    context.fillRect(player.x, player.y, player.width, player.height);

    // ball
    context.fillStyle = ballColor;
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    //context.arc(ball.x, ball.y, ball.width/2, 0, Math.PI * 2);

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
        if(useCoin>=1&&getMoney()-1>=10){
            context.font = "20px sans-serif";
            context.fillStyle = wordColor;
            context.fillText("是否花費10金幣復活?點擊Y復活,N取消重新開始", 40, 350);
            context.fillText("可復活次數:"+useCoin, 190, 400);
        } 
        else{
            context.font = "20px sans-serif";
            context.fillStyle = wordColor;
            context.fillText("遊戲結束，點擊空白鍵重新開始", 120, 350);
        }
        gameOver = true;
    }

    // bomb
	if(usebomb==1&&bombexplode==0){
        context.fillStyle = "red";
        bomb.x += bomb.velocityX;
        bomb.y += bomb.velocityY;
        context.fillRect(bomb.x, bomb.y, bomb.width, bomb.height);

        if (bomb.y <= 0) { 
        // if bomb touches top of canvas
               bomb.velocityY *= -1; //reverse direction
        }
        else if (bomb.x <= 0 || (bomb.x + bomb.width >= boardWidth)) {
        // if bomb touches left or right of canvas
            bomb.velocityX *= -1; //reverse direction
        }
        else if (bomb.y + bomb.height -15> boardHeight) {
            // if laser touches bottom of canvas
            bombexplode=1;
            usebomb=0;
            }
    }

    // 穿透
	if(uselaser==1&&laserbreak==0){
        context.fillStyle = "yellow";
        laser.x += laser.velocityX;
        laser.y += laser.velocityY;
        context.fillRect(laser.x, laser.y, laser.width, laser.height);

        if (laser.y <= 0) { 
        // if laser touches top of canvas
               laser.velocityY *= -1; //reverse direction
        }
        else if (laser.x <= 0 || (laser.x + laser.width >= boardWidth)) {
        // if laser touches left or right of canvas
            laser.velocityX *= -1; //reverse direction
        }
        else if (laser.y + laser.height -15> boardHeight) {
        // if laser touches bottom of canvas
        laserbreak=1;
        uselaser=0;
        }
    }
    //道具3
    if(manyball==1&&manyballbreak==0){
        
        updateBalls();
        
    }
    

    //blocks
   // context.fillStyle = blockColor;
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.hits -= 1; // 減少磚塊需要的碰撞次數
                if (block.hits == 0) {
                    block.break = true; // 磚塊被打破
                    score += 100;
                    blockCount -= 1;
                    countcoin+=1;
                }
                ball.velocityY *= -1;   // flip y direction up or down
                
                if(countcoin==5){
                    setMoney(getMoney()+1);
		            countcoin=0;
                }
               
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.hits -= 1; // 減少磚塊需要的碰撞次數
                if (block.hits == 0) {
                    block.break = true; // 磚塊被打破
                    score += 100;
                    blockCount -= 1;
                    countcoin+=1;
                }
                ball.velocityX *= -1;   // flip x direction left or right
                
                if(countcoin==5){
                    setMoney(getMoney()+1);
		            countcoin=0;
                }

            }

            //炸彈碰撞磚頭
	        if (!bombexplode&&(topCollision(bomb, block) || bottomCollision(bomb, block)||leftCollision(bomb, block)|| 		rightCollision(bomb, block))) {
                block.hits -= 1; // 減少磚塊需要的碰撞次數
                bombexplode=1;
                usebomb=0;
                if (block.hits == 0) {
                    block.break = true; // 磚塊被打破
                    score += 100;
                    blockCount -= 1;
                    countcoin+=1;
                }
                if(countcoin==5){
                    setMoney(getMoney()+1);
		            countcoin=0;
                }
            // 波及周围一圈方块
                destroySurroundingBlocks(block);
            }

            //穿透覆蓋磚頭
	        if(!laserbreak&&(topCollision(laser, block)||bottomCollision(laser, block)||leftCollision(laser,block)|| 		rightCollision(laser, block))) {
                block.hits -= 1; // 減少磚塊需要的碰撞次數
                if (block.hits == 0) {
                    block.break = true; // 磚塊被打破
                    score += 100;
                    blockCount -= 1;
                    countcoin+=1;
                }
                if(countcoin==5){
                    setMoney(getMoney()+1);
		            countcoin=0;
                }
            }

            context.fillStyle = blockColor;
            context.fillRect(block.x, block.y, block.width, block.height);
            context.fillStyle = wordColor;
            context.font = "bold 11px Arial";
            let text = block.hits.toString();
            let textWidth = context.measureText(text).width;
            let blocktextX = block.x + (block.width - textWidth) / 2;
            let blocktextY = block.y + (block.height / 2) + 4;

            context.fillText(text, blocktextX, blocktextY);
        }
    }

    //next level
    if (blockCount == 0&&(ball.y + ball.height+10 >= boardHeight)) {
        blocknum+=1;
        score += 100; //bonus points :)
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }
  //score
  context.font = "20px sans-serif";
  context.fillStyle = wordColor;
  context.fillText(score, 10, 25);

   //coin
   context.font = "20px sans-serif";
   context.fillStyle = wordColor;
   context.fillText(getMoney()-1,485+getx(getMoney()-1), 25);
  
  

    //道具1
   //context.font = "15px sans-serif";
   //context.fillStyle = wordColor;
   //context.fillText("爆炸",465, 180);
   context.font = "20px sans-serif";
   context.fillText(getTool1()-1,485+getx(getTool1()-1), 180);
   //道具2
   //context.font = "15px sans-serif";
   //context.fillStyle = wordColor;
   //context.fillText("穿透",465, 240);
   context.font = "20px sans-serif";
   context.fillText(getTool2()-1,485+getx(getTool2()-1), 240);

   //道具3
   context.font = "20px sans-serif";
   context.fillText(getTool3()-1,485+getx(getTool3()-1), 300);
   

}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code == "KeyY"&&useCoin>=1&&getMoney()-1>=10) {
            ContinueGame();
        }
        else if (e.code=="KeyN" && useCoin>=1&&getMoney()-1>=10) {
            resetGame();
        }
        else if (e.code=="Space" && (useCoin<1||getMoney()-1<=10)) {
            resetGame();
        }
        return;
    }
    
    if(!startgame){
        if (e.code == "Space") {
            startgame=true;
            console.log("RESET");
        }
    }
    
    if (e.code == "ArrowLeft") {
        // player.x -= player.velocityX;
        let nextplayerX = player.x - player.velocityX-8;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
    }
    else if (e.code == "ArrowRight") {
        let nextplayerX = player.x + player.velocityX+8;
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
                break : false,
                hits: Math.floor(Math.random() *blocknum) + 1 // 磚塊需要的碰撞次數
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
    
}
function ContinueGame() {
    if (getMoney() > 1) {
        setMoney(getMoney()-10);
        useCoin-=1;
        gameOver = false;
        player.x = boardWidth / 2 - playerWidth / 2;
        ball.x = Math.random() * (boardWidth - ballWidth),
        ball.y = boardHeight-ballHeight-15,
        ball.velocityX = ballVelocityX;
        ball.velocityY = ballVelocityY;
        
    }
}

function resetGame() {
    //startgame=false;
    gameOver = false;
    player = {
        x : boardWidth/2 - playerWidth/2,
        y : boardHeight - playerHeight ,
        width: playerWidth,
        height: playerHeight,
        velocityX : playerVelocityX
    }
    ball = {
        x : Math.random() * (boardWidth - ballWidth),
        y : boardHeight-ballHeight-15,
        width: ballWidth,
        height: ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }
    
    bomb = {
        x: Math.random() * (boardWidth - bombWidth), // 随机生成 x 坐标
        y : boardHeight - playerHeight - 5,
        width: bombWidth,
        height: bombHeight,
        velocityX : bombVelocityX,
        velocityY : bombVelocityY
    }
    usebomb=0;
    bombexplode = 0;
    console.log(bomb.x); // 输出炸弹的随机生成位置

    laser = {
    	x: Math.random() * (boardWidth - bombWidth), // 随机生成 x 坐标
    	y : boardHeight - playerHeight - 5,
    	width: laserWidth,
    	height: laserHeight,
    	velocityX : laserVelocityX,
    	velocityY : laserVelocityY
    }
    uselaser=0;
    laserbreak=0;
    console.log(laser.x); 

    balls = [];
    manyball=0;
    manyballbreak=1;
    
    
    blockArray = [];
    blockRows = 3;
    score = 0;
    useCoin=3;
    createBlocks();
   
}

//波及周圍磚頭
function destroySurroundingBlocks(centerBlock) {
    let surroundingOffsets = [
        { dx: -1, dy: -1 }, // 左上
        { dx: 0, dy: -1 },  // 上
        { dx: 1, dy: -1 },  // 右上
        { dx: -1, dy: 0 },  // 左
        { dx: 1, dy: 0 },   // 右
        { dx: -1, dy: 1 },  // 左下
        { dx: 0, dy: 1 },   // 下
        { dx: 1, dy: 1 }    // 右下
    ];

    for (let offset of surroundingOffsets) {
        let targetX = centerBlock.x + offset.dx * (blockWidth + 10); // 10 是间隔
        let targetY = centerBlock.y + offset.dy * (blockHeight + 10);

        for (let block of blockArray) {
            if (!block.break && block.x === targetX && block.y === targetY) {
                block.hits -= 1; // 減少磚塊需要的碰撞次數
                if (block.hits == 0) {
                    block.break = true; // 磚塊被打破
                    score += 100;
                    blockCount -= 1;
                    countcoin+=1;
                }
                if(countcoin==5){
                    setMoney(getMoney()+1);
		            countcoin=0;
                }
            }
        }
    }
}

let balls = [];

function createBall() {
    const newBall = {
        x : Math.random() * (boardWidth - ballWidth),
        y : boardHeight-ballHeight-15,
        width: ballWidth,
        height: ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    };
    balls.push(newBall); // 将新球加入 balls 数组 // 将新球加入到数组中
}

// 使用道具生成 5 个球
function generateBalls() {
    for (let i = 0; i < 20; i++) {
        createBall(); // 每次调用 createBall 都会向数组中加入一个新的球
    }
}

function updateBalls() {
    balls = balls.filter(ball => {
    
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillStyle = 'red';
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    //context.arc(ball.x, ball.y, ball.width/2, 0, Math.PI * 2);
    checkBrickCollision(ball);
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
    return ball.y + ball.height < boardHeight; // 只保留未触底的球 // 返回 false 表示移除该球
    });
    if (balls.length === 0) {
        manyball=0;
        manyballbreak = 1;
    }
}

function checkBrickCollision(ball) {
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) { // 检测未破坏的砖块
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.hits -= 1; // 减少砖块需要的碰撞次数
                if (block.hits === 0) {
                    block.break = true; // 标记砖块为已破坏
                    score += 100;
                    blockCount -= 1;
                    countcoin += 1;
                }
                ball.velocityY *= -1; // 翻转 Y 方向

                // 检测金币累积
                if (countcoin === 5) {
                    setMoney(getMoney() + 1);
                    countcoin = 0;
                }
            } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.hits -= 1; // 减少砖块需要的碰撞次数
                if (block.hits === 0) {
                    block.break = true; // 标记砖块为已破坏
                    score += 100;
                    blockCount -= 1;
                    countcoin += 1;
                }
                ball.velocityX *= -1; // 翻转 X 方向

                // 检测金币累积
                if (countcoin === 5) {
                    setMoney(getMoney() + 1);
                    countcoin = 0;
                }
            }
        }
    }
}
