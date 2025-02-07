// 步骤二的画布初始化
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 自动适配手机屏幕
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 双人轨迹参数
const particles = {
    you: { angle: 0, color: '#FF69B4', x: 0, y: 0 },
    partner: { angle: Math.PI, color: '#00BFFF', x: 0, y: 0 }
};

// 爱心方程
function heartPosition(angle, scale=1) {
    const t = angle;
    return {
        x: 16 * Math.pow(Math.sin(t), 3) * scale,
        y: -(13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)) * scale
    };
}

// 步骤三的触控交互
let isTouching = false;
canvas.addEventListener('touchstart', (e) => {
    isTouching = true;
    e.preventDefault();
});

canvas.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    particles.you.angle = calculateAngleFromPosition(
        touch.clientX - rect.left,
        touch.clientY - rect.top
    );
});

function calculateAngleFromPosition(x, y) {
    const centerX = canvas.width/2;
    const centerY = canvas.height/2;
    const dx = x - centerX;
    const dy = y - centerY;
    return Math.atan2(dy, dx);
}

// 步骤四的碰撞检测
function checkCollision() {
    const dx = particles.you.x - particles.partner.x;
    const dy = particles.you.y - particles.partner.y;
    if (Math.hypot(dx, dy) < 30) {
        canvas.classList.add('heartbeat');
        setTimeout(() => canvas.classList.remove('heartbeat'), 500);
    }
}

// 动画循环
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新双方位置
    Object.entries(particles).forEach(([key, p]) => {
        const pos = heartPosition(p.angle, 10);
        p.x = canvas.width/2 + pos.x;
        p.y = canvas.height/2 + pos.y;
        
        // 绘制光点
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // 自动旋转（仅partner）
        if(key === 'partner') p.angle += 0.02;
    });

    checkCollision();
    requestAnimationFrame(animate);
}

// 启动动画
animate();