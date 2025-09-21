// game.js

// --- Inisialisasi Kanvas & Konteks ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Ukuran ubin (tile) di peta
const TILE_SIZE = 32;

// --- Objek Game & Variabel Global ---
let assets = {};
let player = {
    x: 10,
    y: 10,
    width: 16,
    height: 16,
    speed: 1.5,
    vx: 0,
    vy: 0,
    animFrame: 0,
    animTimer: 0,
    direction: 'down',
};
let gameData = {
    level: 1,
    score: 0,
    farmGrid: [],
    // Tambahkan data untuk menyimpan tanaman yang sedang tumbuh
};
let ui = {
    isQuestionActive: false,
    message: '',
};
let currentQuestion = {
    text: '',
    correctAnswer: 0,
    type: '', // 'plant', 'water', 'harvest'
};
let lastUpdateTime = 0;

// --- Fungsi Pemuatan Aset ---
function loadAssets(callback) {
    let imagesToLoad = {
        tileset: 'assets/tilesets/main_tileset.png',
        player: 'assets/sprites/player_spritesheet.png',
        corn: 'assets/sprites/crops_spritesheet.png',
        uiBoard: 'assets/ui/question_board.png',
        // Tambahkan aset lain di sini
    };

    let loadedCount = 0;
    const totalCount = Object.keys(imagesToLoad).length;

    for (let key in imagesToLoad) {
        assets[key] = new Image();
        assets[key].src = imagesToLoad[key];
        assets[key].onload = () => {
            loadedCount++;
            if (loadedCount >= totalCount) {
                callback(); // Panggil fungsi callback setelah semua aset dimuat
            }
        };
    }
}

// --- Fungsi Pengelolaan Data & LocalStorage ---
function saveGame() {
    localStorage.setItem('farmMathAdventureSave', JSON.stringify(gameData));
}

function loadGame() {
    const savedData = localStorage.getItem('farmMathAdventureSave');
    if (savedData) {
        gameData = JSON.parse(savedData);
    } else {
        initFarmGrid(); // Buat peta baru jika tidak ada data
    }
}

function initFarmGrid() {
    for (let y = 0; y < canvas.height / TILE_SIZE; y++) {
        gameData.farmGrid[y] = [];
        for (let x = 0; x < canvas.width / TILE_SIZE; x++) {
            gameData.farmGrid[y][x] = {
                type: 'grass',
                content: null // Untuk menyimpan informasi tanaman
            };
        }
    }
    // Contoh penempatan petak tanah
    gameData.farmGrid[10][15].type = 'dirt';
}

// --- Fungsi Penggambaran ---
function draw() {
    // Gambar peta
    for (let y = 0; y < gameData.farmGrid.length; y++) {
        for (let x = 0; x < gameData.farmGrid[y].length; x++) {
            // Logika untuk menggambar ubin dari spritesheet
            // Misalnya: ctx.drawImage(assets.tileset, sourceX, sourceY, TILE_SIZE, TILE_SIZE, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    // Gambar pemain
    const playerSpriteFrame = 0; // Ganti dengan logika animasi
    ctx.drawImage(assets.player, playerSpriteFrame * player.width, 0, player.width, player.height, player.x, player.y, player.width, player.height);

    // Gambar UI overlay
    if (ui.isQuestionActive) {
        drawQuestionBoard();
    }
}

function drawQuestionBoard() {
    // Gambar papan soal
    ctx.drawImage(assets.uiBoard, canvas.width / 2 - 150, canvas.height / 2 - 100, 300, 200);
    // Tulis teks soal
    ctx.fillText(currentQuestion.text, canvas.width / 2, canvas.height / 2 - 50);
    // Gambar tombol jawaban
    // ...
}

// --- Logika Game ---
function update() {
    // Pergerakan pemain
    player.x += player.vx;
    player.y += player.vy;

    // Deteksi interaksi (Proximity)
    checkInteraction();
}

function checkInteraction() {
    // Cek apakah pemain dekat dengan petak yang bisa diinteraksi
    const playerGridX = Math.floor(player.x / TILE_SIZE);
    const playerGridY = Math.floor(player.y / TILE_SIZE);

    // Contoh: Cek petak di depan pemain
    const targetX = playerGridX + (player.direction === 'right' ? 1 : player.direction === 'left' ? -1 : 0);
    const targetY = playerGridY + (player.direction === 'down' ? 1 : player.direction === 'up' ? -1 : 0);
    
    // Jika pemain menekan tombol interaksi dan berada di depan petak tanah...
    // if (keyPress === 'E' && gameData.farmGrid[targetY][targetX].type === 'dirt') {
    //     showMathQuestion('plant');
    // }
}

function showMathQuestion(action) {
    // Logika pembuatan soal mudah-sulit berdasarkan level
    let num1, num2, answer, question;
    if (action === 'plant') {
        num1 = Math.floor(Math.random() * gameData.level) + 1;
        num2 = Math.floor(Math.random() * gameData.level) + 1;
        answer = num1 + num2;
        question = `Tanam ${num1} benih + ${num2} benih = ?`;
    }
    // Tambahkan logika untuk 'water' dan 'harvest' di sini

    currentQuestion = {
        text: question,
        correctAnswer: answer,
        type: action
    };
    ui.isQuestionActive = true;
}

function checkAnswer(userAnswer) {
    if (userAnswer === currentQuestion.correctAnswer) {
        ui.isQuestionActive = false;
        // Lakukan aksi (menanam, menyiram, dll)
        // updateFarmGrid();
    } else {
        // Kurangi nyawa, tampilkan pesan error
    }
}

// --- Game Loop Utama ---
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastUpdateTime;
    lastUpdateTime = timestamp;

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

// --- Event Listeners ---
// Tambahkan event untuk keyboard (WASD/panah) dan sentuhan joystick
document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') { player.vy = -player.speed; player.direction = 'up'; }
    // ... dan tombol lainnya
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') { player.vy = 0; }
    // ...
});

// --- Mulai Game ---
window.onload = () => {
    loadAssets(() => {
        loadGame();
        gameLoop(0);
    });
};

// Tambahkan beberapa contoh soal untuk menguji
// showMathQuestion('plant');
