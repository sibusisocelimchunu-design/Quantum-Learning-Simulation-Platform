# Quantum Computing Learning & Simulation Platform

A free, zero-install web platform that teaches introductory quantum computing
through live simulation: learners set qubit states, apply real quantum gates,
run an entanglement experiment, execute Deutsch's algorithm, and test their
knowledge with a scored quiz — seeing the underlying probabilities update in
real time.

## Features
- **Qubit simulator** — |0⟩, |1⟩ and |+⟩ states with real state-vector maths;
  live Born-rule probabilities, animated Bloch-circle diagram, single-shot
  measurement with wavefunction collapse, and a 100-shot measurement histogram
- **Quantum gates** — X (NOT), H (Hadamard) and Z (phase flip) implemented as
  real matrix operations, synced live to the same state, chart and diagram
- **Entanglement** — Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 with 100-pair
  simulated measurements showing perfect correlation (01/10 never occur)
- **Deutsch's algorithm** — animated 4-step demonstration resolving
  constant vs balanced functions with one oracle query, with a 10-run
  results chart
- **Knowledge check** — 5 random questions per round drawn from a 10-question
  bank, instant feedback with explanations, exact scoring, results doughnut
  chart and full answer review
- **UX** — dark neon theme, animated starfield, scroll-reveal sections,
  responsive mobile navigation, per-section Reset buttons plus a global
  **Reset Platform** control, and a visible on-page error banner (defensive
  loading with CDN fallback)

## Architecture
A three-layer, event-driven client-side application:

1. **Presentation layer** — `index.html` + `css/style.css`
   (structure, glassmorphism theme, responsive Grid/Flexbox layout)
2. **Application logic layer** — modular vanilla JS loaded in dependency
   order: `boot.js` (safety net) → `app.js` (shared helpers, chart factory,
   animations, reset controls) → feature modules. A single state object
   `S = { a, b }` is the **single source of truth**; one `refresh()`
   function updates every view (text, stats, chart, Bloch diagram),
   eliminating desynchronisation bugs (DRY principle).
3. **Visualisation & data layer** — Canvas 2D (Bloch diagram, starfield)
   and Chart.js charts; in-memory data only, by design scope.

## Technologies
- HTML5, CSS3 (Grid, Flexbox, custom properties, mobile navigation)
- Vanilla JavaScript (no framework, no build step)
- Chart.js via CDN (with fallback CDN + graceful degradation)
- Canvas 2D API (custom Bloch diagram, starfield animation)
- Git & GitHub for version control

## Project Structure
```text
Quantum-Learning-Simulation-Platform/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── boot.js
│   ├── app.js
│   ├── qubit.js
│   ├── gates.js
│   ├── entanglement.js
│   ├── algorithms.js
│   └── quiz.js
├── images/
└── screenshots/
```

## File Descriptions
- `index.html` — Main page: all UI sections and element IDs the JS binds to.
- `css/style.css` — Theme, layout, responsiveness, animations.
- `js/boot.js` — Safety net: visible error banner, shared-helper fallbacks,
  crash-proof chart creation, CDN fallback handling.
- `js/app.js` — Shared engine: DOM helper `$`, Fisher–Yates shuffle,
  chart factory, starfield animation, scroll-reveal (IntersectionObserver),
  navigation, and all reset functions (resetQubit/Gates/Bell/Algo/Quiz/All).
- `js/qubit.js` — State vector {α, β}, Born-rule probabilities
  (P(|0⟩)=|α|²), measurement collapse, 100-shot Monte-Carlo histogram,
  animated Bloch diagram (linear interpolation), 2 charts.
- `js/gates.js` — X, H, Z as real matrix operations on the shared state
  (H performs the actual Hadamard transform: (α±β)/√2).
- `js/entanglement.js` — Bell-state creation and 100-pair measurement
  simulation with outcomes chart.
- `js/algorithms.js` — Deutsch's algorithm: animated steps, guaranteed
  verdict (constant → |0⟩, balanced → |1⟩), 10-run chart.
- `js/quiz.js` — 10-question bank, randomised 5-question rounds, index-based
  scoring with answer locking, feedback, doughnut chart, answer review.

## Development Methodology
Incremental/iterative: three build–test–review iterations, each ending in a
runnable product. Iteration 2 rebuilt the visualisations and quiz after a
review; iteration 3 hardened reliability (error banner, dependency load
order, cache busting) and added reset controls.

## Testing
Manual black-box testing per module, plus physics invariant checks
(probabilities always sum to 1; H·H returns the original state).
Selected results:

| ID | Test case | Expected | Result |
|----|-----------|----------|--------|
| T1 | Set \|0⟩ | P(0)=100% | Pass |
| T3 | Apply X to \|1⟩ | → \|0⟩ | Pass |
| T4 | H then H on \|0⟩ | returns to \|0⟩ | Pass |
| T6 | 100 shots on \|+⟩ | approx 50/50 (±10) | Pass |
| T7 | 100 Bell-pair measurements | only 00 & 11 occur | Pass |
| T8 | Deutsch: constant function | \|0⟩ in 10/10 runs | Pass |
| T9 | Quiz scoring | exact correct count /5 | Pass |
| T10 | Reset Platform | full state restore | Pass |

## How to Run
1. Download or clone this repository.
2. Open `index.html` directly in any modern browser
   (internet needed for Chart.js/fonts), or serve via VS Code Live Server.
3. No installation, no build step, no database.

## Scope
### In Scope
- Introductory quantum computing education (single-qubit states, X/H/Z gates,
  Bell-state entanglement, Deutsch's algorithm)
- Idealised state-vector simulation with real amplitudes
- Measurement probability and Monte-Carlo sampling demonstrations
- Knowledge checking with automated scoring

### Out of Scope
- Physical quantum hardware or cloud quantum execution
- Complex-number amplitudes (full 3D Bloch-sphere phase visualisation) —
  planned next iteration
- Advanced error correction, production-scale simulation, multi-qubit gate
  construction (CNOT)
- Persistent storage (planned: localStorage quiz history)

## Academic Project
Sol Plaatje University  
Computer Science & IT  
Capstone Project  
Student: Sibusiso Mchunu  
Student Number: 202434049

## Repository
https://github.com/sibusisocelimchunu-design/Quantum-Learning-Simulation-Platform

