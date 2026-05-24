// =============================================
// 共用.js — 共用資料與工具函數
// =============================================
// 注意：所有金幣與道具數量都直接讀寫 sessionStorage，
// 不使用模組內區域變數，避免多頁面間資料不同步的問題。


// ── 預設初始值（只在第一次開啟時設定）──
if (sessionStorage.getItem('money') === null) {
    sessionStorage.setItem('money', '50');
}
if (sessionStorage.getItem('tool1') === null) {
    sessionStorage.setItem('tool1', '5');
}
if (sessionStorage.getItem('tool2') === null) {
    sessionStorage.setItem('tool2', '5');
}
if (sessionStorage.getItem('tool3') === null) {
    sessionStorage.setItem('tool3', '5');
}


// ── 金幣 ──

/**
 * 取得目前金幣數量（每次都從 sessionStorage 重新讀取，確保最新值）
 * @returns {number}
 */
function getMoney() {
    return parseInt(sessionStorage.getItem('money')) || 0;
}

/**
 * 設定金幣數量，並同步儲存到 sessionStorage
 * @param {number} newMoney
 */
function setMoney(newMoney) {
    sessionStorage.setItem('money', String(newMoney));
}


// ── 道具數量 ──

/**
 * 取得指定道具的數量
 * @param {1|2|3} toolNum - 道具編號
 * @returns {number}
 */
function getToolCount(toolNum) {
    return parseInt(sessionStorage.getItem('tool' + toolNum)) || 0;
}

/**
 * 設定指定道具的數量
 * @param {1|2|3} toolNum - 道具編號
 * @param {number} value
 */
function setToolCount(toolNum, value) {
    sessionStorage.setItem('tool' + toolNum, String(value));
}

// 為了相容舊程式碼，保留個別的 get/set 函數
function getTool1() { return getToolCount(1); }
function setTool1(v) { setToolCount(1, v); }
function getTool2() { return getToolCount(2); }
function setTool2(v) { setToolCount(2, v); }
function getTool3() { return getToolCount(3); }
function setTool3(v) { setToolCount(3, v); }


// ── 畫布工具函數 ──

/**
 * 計算響應式畫布的尺寸。
 * 取「視窗寬度 - 水平 padding」與最大尺寸的較小值。
 * @param {number} maxSize - 最大邊長（預設 500）
 * @param {number} padding - 左右總 padding（預設 16）
 * @returns {number} 實際邊長（px）
 */
function calcBoardSize(maxSize = 500, padding = 16) {
    return Math.min(maxSize, window.innerWidth - padding);
}

/**
 * 初始化畫布，設定寬高並套用已儲存的背景顏色。
 * 回傳 { board, context, size, scale } 供呼叫端使用。
 * @param {string} canvasId - canvas 元素的 id（預設 "board"）
 * @param {number} logicalSize - 邏輯座標系大小（預設 500）
 * @returns {{ board: HTMLCanvasElement, context: CanvasRenderingContext2D, size: number, scale: number }}
 */
function initBoard(canvasId = 'board', logicalSize = 500) {
    const board = document.getElementById(canvasId);
    if (!board) {
        console.error(`找不到 id="${canvasId}" 的 canvas 元素`);
        return null;
    }

    const size = calcBoardSize(logicalSize);
    board.width  = logicalSize; // 邏輯座標維持 500，方便遊戲計算
    board.height = logicalSize;
    board.style.width  = size + 'px'; // 顯示尺寸響應式縮放
    board.style.height = size + 'px';

    const context = board.getContext('2d');

    // 套用已儲存的背景顏色
    const savedBg = sessionStorage.getItem('backgroundColor');
    if (savedBg) {
        board.style.backgroundColor = savedBg;
    }

    // 套用縮放（讓邏輯座標 0~500 自動對應到實際像素）
    const scale = size / logicalSize;

    return { board, context, size, scale };
}

/**
 * 讀取所有已儲存的顏色設定，回傳顏色物件。
 * @returns {{ bg: string, ball: string, block: string, player: string, word: string }}
 */
function getSavedColors() {
    return {
        bg:     sessionStorage.getItem('backgroundColor') || 'black',
        ball:   sessionStorage.getItem('ballColor')       || 'white',
        block:  sessionStorage.getItem('blockColor')      || 'skyblue',
        player: sessionStorage.getItem('playerColor')     || 'lightgreen',
        word:   sessionStorage.getItem('wordColor')       || 'white',
    };
}


// ── 數字顯示輔助 ──

/**
 * 根據數字的位數，計算在 canvas 上顯示時需要向左偏移的 X 量。
 * 位數越多，偏移越大，讓數字靠右對齊。
 * @param {number} value
 * @returns {number} X 偏移量（負數代表往左）
 */
function getNumOffsetX(value) {
    let x = 0;
    let counter = 10;
    while (value / counter >= 1) {
        counter *= 10;
        x -= 11;
    }
    return x;
}

// 保留舊名稱相容性
const getx = getNumOffsetX;


// ── Export ──
export {
    // 金幣
    getMoney,
    setMoney,

    // 道具（新版）
    getToolCount,
    setToolCount,

    // 道具（舊版相容）
    getTool1, setTool1,
    getTool2, setTool2,
    getTool3, setTool3,

    // 畫布工具
    calcBoardSize,
    initBoard,
    getSavedColors,

    // 數字對齊
    getNumOffsetX,
    getx,           // 舊名稱相容
};