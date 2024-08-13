const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let squares = [];
let colors = ['orange', 'cyan', 'lime', 'pink', 'teal'];
let cursorRadius = 40;
let cursorPosition = { x: canvas.width / 2, y: canvas.height / 2 };
let caughtCounts = { orange: 0, cyan: 0, lime: 0, pink: 0, teal: 0 };
let totalCaught = 0;

canvas.addEventListener('mousemove', (e) => {
    cursorPosition.x = e.clientX;
    cursorPosition.y = e.clientY;
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

        if (this.y > canvas.height) {
            this.respawn();
        }

        this.checkCollision();
        this.draw();
    }

    checkCollision() {
        let distX = this.x + this.size / 2 - cursorPosition.x;
        let distY = this.y + this.size / 2 - cursorPosition.y;
        let distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < cursorRadius + this.size / 2) {
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
        let size = 30;
        let x = Math.random() * (canvas.width - size);
        let y = Math.random() * canvas.height - size;
        let color = colors[Math.floor(Math.random() * colors.length)];
        squares.push(new Square(x, y, size, color));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    squares.forEach(square => square.update());

    ctx.beginPath();
    ctx.arc(cursorPosition.x, cursorPosition.y, cursorRadius, 0, Math.PI * 2, false);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();

    requestAnimationFrame(animate);
}

init();
animate();
