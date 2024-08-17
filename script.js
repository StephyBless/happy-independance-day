// JavaScript for fireworks effect
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Firework {
    constructor(x, y, xEnd, yEnd) {
        this.x = x;
        this.y = y;
        this.xEnd = xEnd;
        this.yEnd = yEnd;
        this.distanceToEnd = Math.sqrt((xEnd - x) ** 2 + (yEnd - y) ** 2);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(yEnd - y, xEnd - x);
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = Math.random() * 50 + 50;
        this.targetRadius = 1;
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        if (this.targetRadius < 8) {
            this.targetRadius += 0.3;
        } else {
            this.targetRadius = 1;
        }

        this.speed *= this.acceleration;
        const velocityX = Math.cos(this.angle) * this.speed;
        const velocityY = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = Math.sqrt((this.xEnd - this.x) ** 2 + (this.yEnd - this.y) ** 2);

        if (this.distanceTraveled >= this.distanceToEnd) {
            createParticles(this.xEnd, this.yEnd);
            fireworks.splice(index, 1);
        } else {
            this.x += velocityX;
            this.y += velocityY;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 10 + 1;
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = Math.random() * 360;
        this.brightness = Math.random() * 80 + 50;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.015;
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
            particles.splice(index, 1);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.stroke();
    }
}

const fireworks = [];
const particles = [];

function createParticles(x, y) {
    const particleCount = 30;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

function loop() {
    requestAnimationFrame(loop);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    fireworks.forEach((firework, index) => {
        firework.update(index);
        firework.draw();
    });

    particles.forEach((particle, index) => {
        particle.update(index);
        particle.draw();
    });
}


canvas.addEventListener('click', (e) => {
    const xEnd = e.clientX;
    const yEnd = e.clientY;
    const xStart = canvas.width / 2;
    const yStart = canvas.height;
    fireworks.push(new Firework(xStart, yStart, xEnd, yEnd));
});



loop();
