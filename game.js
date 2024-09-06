const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 175,
    y: 500,
    width: 50,
    height: 50,
    speed: 10,
    image: new Image()
};
player.image.src = 'https://raw.githubusercontent.com/microsoft/Web-Dev-For-Beginners/main/6-space-game/6-end-condition/your-work/assets/player.png';

let enemies = [];
let lasers = [];
let gameStarted = false;
let canShoot = true;
let score = 0;
const enemySpeed = 2;
const enemySpawnInterval = 3000; // 3 seconds

function drawImage(obj) {
    ctx.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update the rest of the code to use the new image URLs
function shootLaser() {
    const laser = {
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 20,
        speed: 10,
        image: new Image()
    };
    laser.image.src = 'https://raw.githubusercontent.com/microsoft/Web-Dev-For-Beginners/main/6-space-game/6-end-condition/your-work/assets/laserRed.png';
    lasers.push(laser);
}

function spawnEnemies() {
    for (let i = 0; i < 3; i++) {
        const enemy = {
            x: 50 + i * 100,
            y: 0,
            width: 50,
            height: 50,
            image: new Image()
        };
        enemy.image.src = 'https://raw.githubusercontent.com/microsoft/Web-Dev-For-Beginners/main/6-space-game/6-end-condition/your-work/assets/enemyShip.png';
        enemies.push(enemy);
    }
}