const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let squares = [];
let colors = ['orange', 'cyan', 'lime', 'pink', 'teal'];
let cursor = { radius: 25, x: canvas.width / 2, y: canvas.height / 2 };
let squareSize = 30;
let caughtCounts = { orange: 0, cyan: 0, lime: 0, pink: 0, teal: 0 };
let totalCaught = 0;

canvas.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
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
        let distX = Math.abs(this.x + this.size / 2 - cursor.x);
        let distY = Math.abs(this.y + this.size / 2 - cursor.y);

        if (distX <= cursor.radius + this.size / 2 && distY <= cursor.radius + this.size / 2) {
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
    ctx.arc(cursor.x, cursor.y, cursor.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    requestAnimationFrame(animate);
}

init();
animate();
