const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let squares = [];
let colors = ['orange', 'cyan', 'lime', 'pink', 'teal'];
let paddle = { width: 150, height: 20, x: canvas.width / 2 - 75, y: canvas.height - 50 };
let squareSize = 30;
let caughtCounts = { orange: 0, cyan: 0, lime: 0, pink: 0, teal: 0 };
let totalCaught = 0;
let movePaddle = { left: false, right: false };

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') movePaddle.left = true;
    if (e.key === 'ArrowRight') movePaddle.right = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') movePaddle.left = false;
    if (e.key === 'ArrowRight') movePaddle.right = false;
});

class Square {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.dy = Math.random() * 3 + 2;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.y += this.dy;

        if (this.y + this.size > canvas.height) {
            this.respawn();
        }

        this.checkCollision();
        this.draw();
    }

    checkCollision() {
        if (
            this.y + this.size > paddle.y &&
            this.x + this.size > paddle.x &&
            this.x < paddle.x + paddle.width
        ) {
            caughtCounts[this.color]++;
            totalCaught++;
            updateInfoBox();
            this.respawn();
        }
    }

    respawn() {
        this.x = Math.random() * (canvas.width - this.size);
        this.y = -this.size;
        this.dy = Math.random() * 3 + 2;
    }
}

function updateInfoBox() {
    document.getElementById('totalCaught').innerText = totalCaught;
    document.getElementById('orangeCaught').innerText = caughtCounts.orange;
    document.getElementById('cyanCaught').innerText = caughtCounts.cyan;
    document.getElementById('limeCaught').innerText = caughtCounts.lime;
    document.getElementById('pinkCaught').innerText = caughtCounts.pink;
    document.getElementById('tealCaught').innerText = caughtCounts.teal;
}

function init() {
    for (let i = 0; i < 15; i++) {
        let x = Math.random() * (canvas.width - squareSize);
        let y = Math.random() * canvas.height - squareSize;
        let color = colors[Math.floor(Math.random() * colors.length)];
        squares.push(new Square(x, y, squareSize, color));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    squares.forEach(square => square.update());

    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    if (movePaddle.left && paddle.x > 0) {
        paddle.x -= 7;
    }
    if (movePaddle.right && paddle.x + paddle.width < canvas.width) {
        paddle.x += 7;
    }
    requestAnimationFrame(animate);
}

init();
animate();
