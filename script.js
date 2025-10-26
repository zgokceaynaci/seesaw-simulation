const leftWeightEl = document.getElementById("left-weight");
const rightWeightEl = document.getElementById("right-weight");
const nextWeightEl = document.getElementById("next-weight");
const tiltAngleEl = document.getElementById("tilt-angle");
const resetBtn = document.getElementById("reset-btn");

let nextWeight = Math.floor(Math.random() * 10) + 1;
nextWeightEl.textContent = nextWeight;

let leftWeight = 0;
let rightWeight = 0;
const STORAGE_KEY = "seesaw-state-v1";

const canvas = document.getElementById("seesawCanvas");
const ctx = canvas.getContext("2d");

let angle = 0; 
let targetAngle = 0;
const objects = []; // added objects


canvas.addEventListener("click", onCanvasClick);

function playClickSound() {
  const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg");
  audio.volume = 0.3; 
  audio.play();
}

function weightColor(w) {
  const t = (w - 1) / 9;              
  const hue = 200 - t * 140;          // Map weight to hue (200 to 60)
  return `hsl(${hue} 80% 50%)`;
}

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
    const weight = nextWeight;
    objects.push({ x: distanceFromPivot, weight });

    playClickSound();

    nextWeight = Math.floor(Math.random() * 10) + 1;
    nextWeightEl.textContent = nextWeight;

    console.log(`Added object with weight ${weight} at distance ${distanceFromPivot}`);
}
// !!!!!!!!!!!!!!!!!!!
// Torque calculation explanation:
// In the documentation example: angle = (rightTorque - leftTorque) / 10
// Here, the same principle is applied more compactly.
// We treat the pivot as the origin (x=0). Positions to the left have negative x,
// and positions to the right have positive x. Therefore, Σ(weight * x)
// naturally yields (rightTorque - leftTorque).
// This makes the formula physically equivalent but simpler to implement.

function calculateTorque() {
    let torque = 0;
    leftWeight = 0;
    rightWeight = 0;
    for (const obj of objects) {
        torque += obj.weight * obj.x;
        if (obj.x < 0) {
            leftWeight += obj.weight;
        } else {
            rightWeight += obj.weight;
        }
    }
    targetAngle = Math.max(-30, Math.min(30, torque / 200)); // if torque is positive, tilt right; negative, tilt left
    leftWeightEl.textContent = leftWeight;
    rightWeightEl.textContent = rightWeight;
    tiltAngleEl.textContent = `${targetAngle.toFixed(1)}°`;

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
        ctx.fillStyle = weightColor(obj.weight);
        ctx.shadowColor = "rgba(18, 0, 0, 0.25)";
        ctx.shadowBlur = 6;
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
resetBtn.addEventListener("click", () => {
  objects.length = 0;
  leftWeight = 0;
  rightWeight = 0;
  angle = 0;
  targetAngle = 0;
  nextWeight = Math.floor(Math.random() * 10) + 1;
  nextWeightEl.textContent = nextWeight;
  leftWeightEl.textContent = 0;
  rightWeightEl.textContent = 0;
  tiltAngleEl.textContent = "0°";
});

init();