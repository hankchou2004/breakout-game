// =============================================
// color.js — 顏色設定模組
// 所有顏色都儲存在 sessionStorage，key 固定不變。
// =============================================


// ── 顏色的 sessionStorage key 與預設值（統一定義在這裡）──
const COLOR_KEYS = {
    bg:     { key: 'backgroundColor', default: 'black'      },
    ball:   { key: 'ballColor',       default: 'white'       },
    block:  { key: 'blockColor',      default: 'skyblue'     },
    player: { key: 'playerColor',     default: 'lightgreen'  },
    word:   { key: 'wordColor',       default: 'white'       },
};


// ── 初始化：只在尚未設定時寫入預設值 ──
for (const { key, default: def } of Object.values(COLOR_KEYS)) {
    if (sessionStorage.getItem(key) === null) {
        sessionStorage.setItem(key, def);
    }
}


// ── 通用讀寫（內部使用）──

/**
 * 讀取顏色，若尚未設定則回傳預設值
 * @param {'bg'|'ball'|'block'|'player'|'word'} name
 * @returns {string}
 */
function getColor(name) {
    const entry = COLOR_KEYS[name];
    return sessionStorage.getItem(entry.key) ?? entry.default;
}

/**
 * 寫入顏色到 sessionStorage
 * @param {'bg'|'ball'|'block'|'player'|'word'} name
 * @param {string} color
 */
function setColor(name, color) {
    sessionStorage.setItem(COLOR_KEYS[name].key, color);
}


// ── 各別顏色的 get/set（供其他模組 import 使用）──

export function getBgColor()     { return getColor('bg');     }
export function setBgColor(c)    { setColor('bg', c);         }

export function getBallColor()   { return getColor('ball');   }
export function setBallColor(c)  { setColor('ball', c);       }

export function getBlockColor()  { return getColor('block');  }
export function setBlockColor(c) { setColor('block', c);      }

export function getPlayerColor() { return getColor('player'); }
export function setPlayerColor(c){ setColor('player', c);     }

export function getWordColor()   { return getColor('word');   }
export function setWordColor(c)  { setColor('word', c);       }


// ── 一次取得所有顏色（方便遊戲頁面初始化）──
/**
 * 回傳包含所有顏色設定的物件
 * @returns {{ bg: string, ball: string, block: string, player: string, word: string }}
 */
export function getAllColors() {
    return {
        bg:     getColor('bg'),
        ball:   getColor('ball'),
        block:  getColor('block'),
        player: getColor('player'),
        word:   getColor('word'),
    };
}


// ── 舊版相容 export（避免其他還沒修改的檔案報錯）──
// 舊版函數需要傳入 key 參數，這裡忽略 key 直接用固定名稱
export function getboardColor(_key)      { return getBgColor();     }
export function setboardColor(_key, c)   { setBgColor(c);           }

export function getballColor(_key)       { return getBallColor();   }
export function setballColor(_key, c)    { setBallColor(c);         }

export function getblockColor(_key)      { return getBlockColor();  }
export function setblockColor(_key, c)   { setBlockColor(c);        }

export function getplayerColor(_key)     { return getPlayerColor(); }
export function setplayerColor(_key, c)  { setPlayerColor(c);       }

export function getwordColor(_key)       { return getWordColor();   }
export function setwordColor(_key, c)    { setWordColor(c);         }