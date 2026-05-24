import {  getMoney, setMoney,setTool1,getTool1,setTool2,getTool2,setTool3,getTool3,getx } from './共用.js';


// 更新 sharedData.money 為 sessionStorage 中的值
let money = getMoney();
let tool1 = getTool1();
let tool2 = getTool2();
let tool3 = getTool3();


//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context; 

//遊戲初始
let useCoin=1;
//let coinquantity=2;
let countcoin=0;
let score = 0;


let wordColor = "white";


// 新增返回初始畫面按鈕的功能
document.getElementById("goToInitialScreen").addEventListener("click", function() {
    window.location.href = "index.html";
});


// 當前提示
let currentPrompt = null; // 當前提示道具 ("tool1" 或 "tool2")
let promptPosition = null; // 提示文字的位置
let promptyPosition = null;
let nomoney= 0; // 是否餘額不足

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board
    requestAnimationFrame(update);
    
    document.getElementById("tool1-button").addEventListener("click", () => {showPrompt("tool1",100,200);
    nomoney = 0;
    });
    document.getElementById("tool2-button").addEventListener("click", () => {showPrompt("tool2",300,200);
    nomoney = 0;
    });
    document.getElementById("tool3-button").addEventListener("click", () => {showPrompt("tool3",100,360);
    nomoney = 0;
    });
    document.getElementById("tool4-button").addEventListener("click", () => {showPrompt("tool4",300,360);
        nomoney = 0;
        });
    document.addEventListener("keydown", handleKeyPress);  
    
    const savedBackgroundColor = sessionStorage.getItem('backgroundColor');
    if (savedBackgroundColor) {
        board.style.backgroundColor = savedBackgroundColor;
    }

    // 检查并应用文字的颜色
    const savedWordColor = sessionStorage.getItem('wordColor');
    if (savedWordColor) {
        wordColor = savedWordColor;
    }   
}




function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    
    //coin
   context.font = "20px sans-serif";
   context.fillStyle = wordColor;
   context.fillText(getMoney()-1,485+getx(getMoney()-1), 25);
  
   //道具1
   context.font = "15px sans-serif";
   context.fillStyle = wordColor;
   context.fillText("道具1",455, 180);
   context.font = "20px sans-serif";
   context.fillText(getTool1()-1,485+getx(getTool1()-1),205);
   //道具2
   context.font = "15px sans-serif";
   context.fillStyle = wordColor;
   context.fillText("道具2",455, 240);
   context.font = "20px sans-serif";
   context.fillText(getTool2()-1,485+getx(getTool2()-1), 265);

   //道具3
   context.font = "15px sans-serif";
   context.fillStyle = wordColor;
   context.fillText("道具3",455, 300);
   context.font = "20px sans-serif";
   context.fillText(getTool3()-1,485+getx(getTool3()-1), 325);

   //如果有按下按鈕，顯示提示文字
   if (currentPrompt) {
        context.font = "15px sans-serif";
        context.fillStyle = wordColor;
        context.fillText("確定購買? (Y/N)", promptPosition,promptyPosition );   
   }
   if(nomoney){
        context.font = "15px sans-serif";
        context.fillStyle = wordColor;
	context.fillText("金幣不足", promptPosition,promptyPosition );
   }
}

function showPrompt(tool, position,yposition) {
    currentPrompt = tool; // 設定當前提示道具
    promptPosition = position; // 提示顯示位置
    promptyPosition = yposition; 
}


// 處理鍵盤按鍵
function handleKeyPress(e) {
    if (!currentPrompt) return; // 如果沒有提示，不執行任何操作

    if (e.code === "KeyY") { // 檢查按下的鍵是否是 "Y"
        // 確定購買
        if (getMoney() > 1) {
            
            if (currentPrompt === "tool1") {
                setMoney(getMoney()-10); // 扣除硬幣
                setTool1(getTool1()+1); // 增加道具1數量
            } 
            else if (currentPrompt === "tool2") {
                setMoney(getMoney()-5); // 扣除硬幣
                setTool2(getTool2()+1); // 增加道具2數量
            }
            else if (currentPrompt === "tool3") {
                setMoney(getMoney()-30); // 扣除硬幣
                setTool3(getTool3()+1); // 增加道具3數量
            }
            else if (currentPrompt === "tool4") {
                setMoney(getMoney()-10); // 扣除硬幣
                const randomTool = Math.floor(Math.random() * 3); // 生成0到2的隨機數
                if (randomTool === 0) {
                    setTool1(getTool1() + 1); // 隨機增加道具1
                } else if (randomTool === 1) {
                    setTool2(getTool2() + 1); // 隨機增加道具2
                } else {
                    setTool3(getTool3() + 1); // 隨機增加道具3
                }
            }
        } else {
            currentPrompt = null; // 清除提示
	        nomoney=1;
        }
        currentPrompt = null; // 清除提示
    } else if (e.code === "KeyN") { // 檢查按下的鍵是否是 "N"
        // 取消購買
        currentPrompt = null; // 清除提示
    }
}



