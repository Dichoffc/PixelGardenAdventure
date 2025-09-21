// game.js

// Inisialisasi Kanvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const TILE_SIZE = 32;

// Logika Game
let player = {
    x: 10,
    y: 10,
    width: 28,
    height: 28,
    speed: 2,
    vx: 0,
    vy: 0,
};

let gameData = {
    level: 1,
    score: 0,
    farmGrid: [], // Representasi peta
};

// Fungsi untuk menyimpan dan memuat game menggunakan localStorage
function saveGame() {
    localStorage.setItem('farmMathAdventureSave', JSON.stringify(gameData));
    showMessage("Game disimpan!", "success");
}

function loadGame() {
    const savedData = localStorage.getItem('farmMathAdventureSave');
    if (savedData) {
        gameData = JSON.parse(savedData);
        showMessage("Game dimuat!", "success");
    } else {
        // Inisialisasi peta jika tidak ada data tersimpan
        initFarmGrid();
        showMessage("Game baru dimulai!", "info");
    }
}

// Logika Peta dan Penggambaran (Ini masih sederhana, perlu dikembangkan)
function initFarmGrid() {
    for (let y = 0; y < canvas.height / TILE_SIZE; y++) {
        gameData.farmGrid[y] = [];
        for (let x = 0; x < canvas.width / TILE_SIZE; x++) {
            gameData.farmGrid[y][x] = 'grass';
        }
    }
}

function drawMap() {
    for (let y = 0; y < gameData.farmGrid.length; y++) {
        for (let x = 0; x < gameData.farmGrid[y].length; x++) {
            // Gambar ubin (tile) berdasarkan gameData.farmGrid
            // Contoh: ctx.drawImage(grassTile, x * TILE_SIZE, y * TILE_SIZE);
        }
    }
}

// Logika untuk Pergerakan Karakter dan Joystick
const joystickBase = document.getElementById('joystick-base');
const joystickStick = document.getElementById('joystick-stick');
let isJoystickActive = false;
let joystickCenter = { x: 0, y: 0 };

joystickBase.addEventListener('mousedown', (e) => {
    isJoystickActive = true;
    joystickCenter.x = e.clientX;
    joystickCenter.y = e.clientY;
});
document.addEventListener('mousemove', handleJoystickMove);
document.addEventListener('mouseup', handleJoystickEnd);

function handleJoystickMove(e) {
    if (!isJoystickActive) return;
    const dx = e.clientX - joystickCenter.x;
    const dy = e.clientY - joystickCenter.y;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 50); // Batasi pergerakan stik
    const angle = Math.atan2(dy, dx);
    joystickStick.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
    
    player.vx = Math.cos(angle) * player.speed;
    player.vy = Math.sin(angle) * player.speed;
}

function handleJoystickEnd() {
    isJoystickActive = false;
    player.vx = 0;
    player.vy = 0;
    joystickStick.style.transform = `translate(0, 0)`;
}

// Logika Soal Matematika
const questionBoard = document.getElementById('question-board');
const questionText = document.getElementById('question-text');
const answerOptions = document.getElementById('answer-options');

let currentAnswer;

function showMathQuestion(action) {
    let num1, num2, answer, question;
    // Logika soal berdasarkan aksi (tanam, siram, panen)
    switch(action) {
        case 'plant':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 + num2;
            question = `${num1} + ${num2} = ?`;
            break;
        // Tambahkan kasus lain untuk 'water' dan 'harvest'
    }

    currentAnswer = answer;
    questionText.textContent = question;
    displayAnswers(answer);
    questionBoard.style.display = 'block';
}

function displayAnswers(correctAnswer) {
    answerOptions.innerHTML = '';
    let answers = [correctAnswer];
    while (answers.length < 4) { // 4 pilihan jawaban
        let wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (wrongAnswer > 0 && !answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(ans => {
        const btn = document.createElement('button');
        btn.textContent = ans;
        btn.className = 'answer-btn';
        btn.onclick = () => checkAnswer(ans);
        answerOptions.appendChild(btn);
    });
}

function checkAnswer(ans) {
    if (ans === currentAnswer) {
        showMessage("Jawaban benar!", "success");
        // Logika untuk menyelesaikan aksi (misal: menanam jagung)
        questionBoard.style.display = 'none';
    } else {
        showMessage("Jawaban salah!", "error");
    }
}

// Logika Loop Game Utama
function gameLoop() {
    // 1. Perbarui posisi pemain
    player.x += player.vx;
    player.y += player.vy;

    // 2. Gambar ulang seluruh kanvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    // Gambar pemain
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, player.width, player.height);

    // 3. Periksa interaksi
    // Nanti tambahkan logika untuk mendeteksi kedekatan pemain dengan objek dan memanggil showMathQuestion()

    requestAnimationFrame(gameLoop);
}

// Fungsi untuk menampilkan pesan
const messageBox = document.getElementById('message-box');
function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 2000);
}

// Mulai Game
window.onload = () => {
    loadGame();
    gameLoop();
};
