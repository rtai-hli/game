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
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
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

function resetGame() {
    if (isTopScore(score)) {
        const playerName = prompt('Congratulations! You achieved a high score. Enter your name:');
        saveHighScore(score, playerName);
    }
    player.x = 175;
    player.y = 500;
    enemies = [];
    lasers = [];
    score = 0;
    gameStarted = false;
    showMessage('Game Over! Press any key to restart');
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
    ctx.fillText('High Scores:', canvas.width - 100, 60);
    highScores.forEach((highScore, index) => {
        ctx.fillText(`${index + 1}. ${highScore.name}: ${highScore.score}`, canvas.width - 100, 90 + index * 30);
    });
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function showMessage(message) {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    const maxWidth = canvas.width - 40;
    const lineHeight = 40;
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    wrapText(ctx, message, x, y, maxWidth, lineHeight);
}

function isTopScore(score) {
    if (highScores.length < 3) {
        return true;
    }
    return score > highScores[highScores.length - 1].score;
}

function saveHighScore(score, name) {
    highScores.push({ score, name });
    highScores.sort((a, b) => b.score - a.score);
    if (highScores.length > 3) {
        highScores.pop();
    }
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImage(player);
    enemies.forEach(enemy => {
        enemy.y += enemySpeed;
        drawImage(enemy);
    });
    lasers.forEach(laser => {
        laser.y -= laser.speed;
        drawImage(laser);
    });

    enemies.forEach(enemy => {
        if (checkCollision(player, enemy)) {
            resetGame();
            return;
        }
    });

    lasers = lasers.filter(laser => laser.y > 0);
    enemies = enemies.filter(enemy => enemy.y < canvas.height);
    enemies.forEach((enemy, enemyIndex) => {
        lasers.forEach((laser, laserIndex) => {
            if (checkCollision(laser, enemy)) {
                enemies.splice(enemyIndex, 1);
                lasers.splice(laserIndex, 1);
                score += 100;
            }
        });
    });

    drawScore();
    if (gameStarted) {
        requestAnimationFrame(update);
    }
}

function movePlayer(event) {
    if (!gameStarted) {
        gameStarted = true;
        update();
        setInterval(spawnEnemies, enemySpawnInterval);
    }

    switch (event.key) {
        case 'ArrowLeft':
            if (player.x > 0) player.x -= player.speed;
            break;
        case 'ArrowRight':
            if (player.x + player.width < canvas.width) player.x += player.speed;
            break;
        case 'ArrowUp':
            if (player.y > 0) player.y -= player.speed;
            break;
        case 'ArrowDown':
            if (player.y + player.height < canvas.height) player.y += player.speed;
            break;
        case ' ':
            if (canShoot) {
                shootLaser();
                canShoot = false;
                setTimeout(() => canShoot = true, 500);
            }
            break;
    }
}

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

document.addEventListener('keydown', movePlayer);
showMessage('Press any key to start');