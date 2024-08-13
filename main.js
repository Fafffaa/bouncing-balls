const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let balls = [];
let colors = ['red', 'blue', 'green', 'yellow', 'purple'];
let catchRadius = 50;
let catchPoint = { x: canvas.width / 2, y: canvas.height / 2 };
let caughtCounts = { red: 0, blue: 0, green: 0, yellow: 0, purple: 0 };
let totalCaught = 0;

// Update catchPoint based on cursor movement
canvas.addEventListener('mousemove', (e) => {
    catchPoint.x = e.clientX;
    catchPoint.y = e.clientY;
});

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 5;
        this.dy = (Math.random() - 0.5) * 5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.checkCollision();
        this.draw();
    }

    checkCollision() {
        let dist = Math.hypot(this.x - catchPoint.x, this.y - catchPoint.y);
        if (dist - this.radius - catchRadius < 0) {
            caughtCounts[this.color]++;
            totalCaught++;
            updateInfoBox();
            this.respawn();
        }
    }

    respawn() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.dx = (Math.random() - 0.5) * 5;
        this.dy = (Math.random() - 0.5) * 5;
    }
}

function updateInfoBox() {
    document.getElementById('totalCaught').innerText = totalCaught;
    document.getElementById('redCaught').innerText = caughtCounts.red;
    document.getElementById('blueCaught').innerText = caughtCounts.blue;
    document.getElementById('greenCaught').innerText = caughtCounts.green;
    document.getElementById('yellowCaught').innerText = caughtCounts.yellow;
    document.getElementById('purpleCaught').innerText = caughtCounts.purple;
}

function init() {
    for (let i = 0; i < 20; i++) {
        let radius = 20;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let color = colors[Math.floor(Math.random() * colors.length)];
        balls.push(new Ball(x, y, radius, color));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => ball.update());

    // Draw the catching point
    ctx.beginPath();
    ctx.arc(catchPoint.x, catchPoint.y, catchRadius, 0, Math.PI * 2, false);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();

    requestAnimationFrame(animate);
}

init();
animate();
