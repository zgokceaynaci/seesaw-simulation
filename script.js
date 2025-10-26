const canvas = document.getElementById("seesawCanvas");
const ctx = canvas.getContext("2d");

let angle = 0;

function drawSeesaw() {
    const pivotX = canvas.width / 2;
    const pivotY = canvas.height / 2 + 40;
    const seesawLength = 400;
    
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(angle * Math.PI / 180);

    // Draw seesaw plank
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(-seesawLength / 2, -20, seesawLength, 20);

    ctx.restore();

    // Draw pivot
    ctx.beginPath();
    ctx.moveTo(pivotX - 20, pivotY + 10);
    ctx.lineTo(pivotX + 20, pivotY + 10);
    ctx.lineTo(pivotX, pivotY - 40);
    ctx.closePath();
    ctx.fillStyle = "#555";
    ctx.fill();
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSeesaw();
    requestAnimationFrame(draw);
}
function init() {
    draw();
}
init();