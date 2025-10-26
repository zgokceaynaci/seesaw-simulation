# Seesaw Simulation (Pure JavaScript)

**Main Interface**

![Main Interface](assets/preview.png)

**HUD Close-up**

![HUD Section](assets/example.png)
![HUD Section](assets/quick-look.png)

**Seesaw Tilt Example**

![Tilt Example](assets/example3.png)

**Click Interaction**

!![Click Example](assets/example2.png)

![Drop Action](assets/example5.png)

![HUD Update](assets/example4.png)

**Reset Action**

![Reset Example](assets/preview.png)

**Weight Color Variation**

![Weight Color Variation](assets/example5.png)

*(Demo video will be added soon.)*

Interactive, physics-driven seesaw built with only **HTML, CSS, and vanilla JavaScript**.  
Click along the plank to drop objects with random weight (1–10 kg). The seesaw tilts smoothly using real torque logic. (Optional) state persistence lets your setup survive refreshes.


**Live Demo (GitHub Pages):** https://zgokceaynaci.github.io/seesaw-simulation/


---

## Table of Contents
- [Goal & Scenario](#goal--scenario)
- [Features](#features)
- [How It Works (Physics)](#how-it-works-physics)
- [User Interaction & UI](#user-interaction--ui)
- [Persistence](#persistence)
- [Project Structure](#project-structure)
- [Run Locally](#run-locally)
- [Deploy (GitHub Pages)](#deploy-github-pages)
- [Development Process & Commits](#development-process--commits)
- [Design Decisions](#design-decisions)
- [Trade-offs & Limitations](#trade-offs--limitations)
- [Challenges Faced](#challenges-faced)
- [AI Assistance Disclosure](#ai-assistance-disclosure)
- [License](#license)

---

## Goal & Scenario

**Goal**  
Create a visual seesaw simulation in pure JavaScript where random-weight objects (1–10 kg) are dropped by clicking directly on the **seesaw plank**, and the seesaw tilts based on real physics. The task combines user interaction, logical simulation, animation, and clean JS structure.  
Preview reference: https://seesaw.samet-sevindi.workers.dev/

**Scenario**  
A playground seesaw: a plank balanced on a center pivot. Users click anywhere on the plank to drop objects. Each object’s weight is random (1–10 kg). The seesaw rebalances smoothly based on **all** placed objects.

---

## Features

- **Pure JS/HTML/CSS** — no frameworks or libraries.
- **Accurate placement:** objects appear **exactly where you click** on the plank.
- **Physics-based tilt** using torque:
  - Per side torque: `Σ(weight × distanceFromPivot)`
  - Angle proportional to torque difference, **clamped to ±30°**
- **Smooth animation** (eased approach to target angle).
- **Live HUD:** Left total (kg), Next weight (kg), Right total (kg), current Tilt angle (°).
- **Reset** button to clear the scene quickly.
- **Optional sound feedback** on drops (short pop).
- **(Optional) Persistence** via `localStorage` so your scene survives refreshes.

---

## How It Works (Physics)

For torque and balance calculation, the documentation suggests using:

`angle = (rightTorque - leftTorque) / 10`

In this implementation, the same physical principle is applied in a more compact way using a single summation:

`Σ(weight × x)`

The pivot is treated as the origin (x = 0).
Positions to the left of the pivot have negative x values,
and positions to the right have positive x values.

This means the total sum of (weight × x) naturally gives the net torque difference:

- Positive → the seesaw tilts right

- Negative → the seesaw tilts left

Thus, this formula is mathematically equivalent to (rightTorque - leftTorque) but simpler to implement and easier to visualize.

**Torque per side**
Each object has:
```
- `w` = weight in kg (1–10)  
- `x` = horizontal distance from the pivot in pixels (left negative, right positive)

```
Torque for each side:
```
leftTorque  = Σ (w * |x|)  for x < 0
rightTorque = Σ (w * |x|)  for x ≥ 0

```
---
**Tilt Angle (Degrees)** 
The tilt angle is proportional to the torque difference and limited between ±30°, as required in the brief:

```
const MAX_ANGLE = 30;
const angle = Math.max(
  -MAX_ANGLE,
  Math.min(MAX_ANGLE, (rightTorque - leftTorque) / 10)
);
```
In this project, the displayed angle smoothly approaches the target angle for a realistic animation:
```
angle += (targetAngle - angle) * 0.05; // eased animation
```
Summary

- Left side → negative x → negative torque

- Right side → positive x → positive torque

- Net torque defines the seesaw’s rotation direction

- The plank rotates smoothly until balance is reached after each new object

---
## User Interaction & UI
- Click anywhere along the plank (not the background). Off-plank clicks are ignored by checking the click region against the plank area.
- A random weight (1–10 kg) is generated and placed at the click’s horizontal offset from the pivot.
- The simulation recalculates torque, updates Left/Right totals, and tilts smoothly.
- HUD (top): shows Left, Next, Right, and Angle.
- Reset button (bottom): clears all objects and resets angle to 0°.
- Colors: disc color is mapped to weight (lighter → cooler hues, heavier → warmer hues); labels are white and centered for readability.
- Sound: A short “pop” plays on each drop for feedback.

---

## Persistence

Simple helpers are included:
```
STORAGE_KEY = "seesaw-state-v1"

```
- Store array of { x, weight } and (optionally) nextWeight.

- Load on start, save after each drop (you can comment these out if you don’t want persistence).
---

## Project Structure
```
seesaw-simulation/
├─ index.html
├─ style.css
├─ script.js
├─ README.md
└─ assets/
    ├─ preview.png
    ├─ example.png
    ├─ example2.png
    ├─ example3.png
    ├─ example4.png
    ├─ example5.png
    ├─ quick-look.png

```
---
## Run Locally

Open index.html directly in a browser, or

Start a tiny server:

VS Code Live Server or

python3 -m http.server → open http://localhost:8000

---
## Deploy (GitHub Pages)

1. Push to main of your public repository.

2. GitHub → Settings → Pages

- Source: Deploy from a branch

- Branch: main / /(root)

3. Your site will be available at:
```
https://<your-username>.github.io/seesaw-simulation/

```
---
## Development Process & Commits

Small, focused commits reflecting incremental steps:

- feat(setup): initialize basic project structure with HTML, CSS, and JS files

- feat(visuals): draw seesaw plank and pivot on canvas

- fix(interaction): enable click detection on seesaw canvas

- feat(objects): render weight discs with labels at clicked positions

- feat(physics): compute torque and tilt with smooth easing

- feat(ui): add HUD stats and reset button

- feat(sound): add pop sound effect on click

- refactor(style): polish colors and shadows for readability

Branching: worked on feature branches like feature/visuals, feature/physics, feature/ui, then merged via PRs to main.

---
## Design Decisions

- Canvas for drawing/animation keeps logic simple and fast.

- Eased animation feels natural without heavy spring/physics complexity.

- Click validation ensures only plank clicks are processed.

- Readability-first: bold labels on colored discs, minimal HUD.

- No external libraries to comply with the brief.
---
## Trade-offs & Limitations

- Visual scale uses pixels as lever arm; intuitive but not unit-accurate physics.

- Angle clamp ±30° for clarity and UX.

- No collision handling; discs can overlap (intentional for simplicity).

- Mobile: basic tap works; drag/drop and haptics are not implemented.
---
## Challenges Faced

- UI alignment & layout: Centering HUD/canvas/reset required iterative CSS tuning.

- Naming & syntax mistakes: Fast iteration led to occasional typos and “undefined” errors; solved via careful debugging and consistent naming.

- Git conflicts: Parallel UI/logic work produced conflicts; got resolved by staging smaller changes and reviewing diffs carefully.

- Math/logic iterations: Translating torque & balance into working code needed a few passes; wrong scope/placement sometimes caused no effect.

- Hit-testing: Ensuring clicks register only on the plank required refining the click bounds.

---
## AI Assistance Disclosure

I used AI tools (ChatGPT) for minor syntax fixes, layout adjustments, and quick clarifications when needed.
I also reviewed a few open-source JavaScript projects on GitHub to explore different approaches to physics calculations and animation handling.

The main implementation, including the physics logic, event flow, and overall structure, was written manually.
AI support was limited to improving readability and refining small details in the code and design.

---
## License

MIT — feel free to use and modify with attribution.
