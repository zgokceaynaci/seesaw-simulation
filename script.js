const canvas = document.getElementById("seesawCanvas");
const ctx = canvas.getContext("2d");

let angle = 0; 
let targetAngle = 0;
const objects = []; // added objects


canvas.addEventListener("click", onCanvasClick);

function onCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pivotY = canvas.height / 2 + 40;
    if (y < pivotY - 40 || y > pivotY + 20){
        console.log("Click outside the seesaw area");
        return; // Ignore clicks outside the seesaw area
    }
    const distanceFromPivot = x - canvas.width / 2; //map position from pivot
    const weight = Math.floor(Math.random() * 10) + 1; // Random weight between 1 and 10
    objects.push({ x: distanceFromPivot, weight });
    console.log(`Added object with weight ${weight} at distance ${distanceFromPivot}`);
}

function calculateTorque() {
    let torque = 0;
    for (const obj of objects) {
        torque += obj.weight * obj.x;
    }
    targetAngle = Math.max(-30, Math.min(30, torque / 200)); // if torque is positive, tilt right; negative, tilt left
}
function drawSeesaw() {
    const pivotX = canvas.width / 2;
    const pivotY = canvas.height / 2 + 40;
    const seesawLength = 400;

    angle += (targetAngle - angle) * 0.05; // Smooth transition to target angle
    
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(angle * Math.PI / 180);

    // Draw seesaw plank
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(-seesawLength / 2, -20, seesawLength, 20);

    // Draw objects on seesaw
    for (const obj of objects) {
        ctx.beginPath();
        ctx.arc(obj.x, -30, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#2F2F2F";
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(obj.weight, obj.x, -30);
    }

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
    calculateTorque();
    drawSeesaw();
    requestAnimationFrame(draw);
}
function init() {
    draw();
}
init();