const canvas = document.getElementById("seesawCanvas");
const ctx = canvas.getContext("2d");

let angle = 0;
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

    // Draw all objects
    for (const obj of objects){
        ctx.beginPath();
        ctx.arc(obj.x, -30, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#4682B4";
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(obj.weight, obj.x, -35);
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
    drawSeesaw();
    requestAnimationFrame(draw);
}
function init() {
    draw();
}
init();