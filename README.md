
# Quantum Computing Learning & Simulation Platform

A free, zero-install web platform that teaches introductory quantum computing
through live simulation: learners set qubit states, apply real quantum gates,
run an entanglement experiment, execute TWO quantum algorithms (Deutsch's and
Grover's search), solve state-building challenges, and test their knowledge
with a scored, history-tracking quiz — seeing the underlying probabilities
update in real time.

## Features

### Simulation
- **Qubit simulator** — |0⟩, |1⟩ and |+⟩ states with real state-vector maths
  (S = {α, β}); live Born-rule probabilities, animated Bloch-circle diagram,
  single-shot measurement with wavefunction collapse, and a 100-shot
  Monte-Carlo histogram
- **Quantum gates** — X (NOT), H (Hadamard) and Z (phase flip) as real matrix
  operations, synced live to the same state, chart and diagram
- **RY rotation gate** — a CONTINUOUS gate driven by a 0–360° slider applying
  the true rotation matrix per degree of drag: the Bloch needle sweeps in real
  time (90° lands exactly on |+⟩, 180° on |1⟩)

### Algorithms
- **Deutsch's algorithm** — animated 4-step walkthrough resolving constant vs
  balanced functions with ONE oracle query (classical: two), 10-run results chart
- **Grover's search (2-qubit)** — second algorithm: the oracle marks one of four
  states with a phase flip (probabilities stay 25% — invisible!), then one
  diffusion step amplifies it to 100%. One query instead of three classical
  checks, deterministic across all four marks, with a step-by-step chart

### Practice & assessment
- **Challenge Mode** — a mystery target state is generated; the learner must
  reach it from |0⟩ using X, H and Z. Exact match up to global phase counts as
  solved; right-probabilities-wrong-phase earns the hint "try Z" — teaching
  phase vs probability through gameplay. Isolated state object: zero side
  effects on the main simulator
- **Knowledge check** — 5 random questions per round from a 10-question bank,
  instant feedback with explanations, exact index-based scoring, doughnut
  results chart and full answer review
- **Persistent quiz history** — rounds played, personal best and average saved
  via localStorage (survives refreshes and resets by design), with an explicit
  🗑️ Clear History control protected by a confirmation dialog

### Reference & UX
- **Qubit technologies** — superconducting, trapped-ion, photonic and neutral
  atom platforms compared in cards plus a spec table (temperature, gate speed,
  strength)
- **UX** — dark neon theme, animated starfield, scroll-reveal sections,
  responsive mobile navigation, per-section Reset buttons plus a global
  **Reset Platform** control, and a visible on-page error banner

## Architecture

A three-layer, event-driven client-side application (10 page sections,
6 Chart.js charts):

1. **Presentation layer** — `index.html` + `css/style.css`
   (structure, glassmorphism theme, responsive Grid/Flexbox layout)
2. **Application logic layer** — modular vanilla JS loaded in strict
   dependency order: `boot.js` (safety net) → `app.js` (shared helpers, chart
   factory, animations, reset controls) → feature modules. A single state
   object `S = { a, b }` is the **single source of truth**; one `refresh()`
   function updates every view (text, stats, chart, Bloch diagram),
   eliminating desynchronisation bugs (DRY principle). Challenge Mode is
   deliberately isolated in its own state object.
3. **Visualisation & data layer** — Canvas 2D (Bloch diagram, starfield) and
   Chart.js × 6 charts; in-memory data only, plus localStorage for quiz history

## Technologies

- HTML5, CSS3 (Grid, Flexbox, custom properties, mobile navigation)
- Vanilla JavaScript (no framework, no build step)
- Chart.js via CDN (with fallback CDN + graceful degradation)
- Canvas 2D API (custom Bloch diagram, starfield animation)
- localStorage (persistent quiz history)
- Git & GitHub for version control

## Project Structure

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
    │   ├── challenge.js
    │   ├── grover.js
    │   ├── entanglement.js
    │   ├── algorithms.js
    │   └── quiz.js
    ├── images/
    └── screenshots/

## File Descriptions

- `index.html` — Main page: 10 UI sections and the element IDs the JS binds to.
- `css/style.css` — Theme, layout, responsiveness, animations.
- `js/boot.js` — Safety net: visible on-page error banner, shared-helper
  fallbacks, crash-proof chart creation, CDN fallback handling.
- `js/app.js` — Shared engine: DOM helper `$`, Fisher–Yates shuffle, chart
  factory, starfield animation, scroll-reveal (IntersectionObserver),
  navigation, and all reset functions (resetQubit/Gates/Bell/Algo/Quiz/All).
- `js/qubit.js` — State vector {α, β}, Born-rule probabilities
  (P(|0⟩)=|α|²), measurement collapse, 100-shot Monte-Carlo histogram,
  animated Bloch diagram (linear interpolation).
- `js/gates.js` — X, H, Z as real matrix operations on the shared state, plus
  the RY rotation gate: the slider's angle delta feeds the true 2D rotation
  matrix [[cos(θ/2), −sin(θ/2)], [sin(θ/2), cos(θ/2)]] for continuous control.
- `js/challenge.js` — Self-contained Challenge Mode: random target generation
  (2–3 gate compositions), gate application on an isolated state object, and
  three-way feedback (exact match up to global phase / same probabilities wrong
  phase / not yet).
- `js/grover.js` — 2-qubit Grover iteration as real 4-amplitude vector maths:
  uniform superposition → oracle phase flip → diffusion H²·(2|0⟩⟨0|−I)·H²,
  animated step by step; one query amplifies the marked state to 100%.
- `js/entanglement.js` — Bell-state creation and 100-pair measurement
  simulation with outcomes chart.
- `js/algorithms.js` — Deutsch's algorithm: animated steps, guaranteed
  verdict (constant → |0⟩, balanced → |1⟩), 10-run chart.
- `js/quiz.js` — 10-question bank, randomised 5-question rounds, index-based
  scoring with answer locking, feedback, doughnut chart, answer review, and
  localStorage round history (best/average) with a confirmed Clear History
  control.

## Development Methodology

Incremental/iterative Agile: three build–test–review iterations, each ending
in a runnable product. Iteration 2 rebuilt the visualisations and quiz after a
review; iteration 3 hardened reliability (error banner, dependency load order,
cache busting) and added reset controls, then delivered the feature expansion
(RY gate, Challenge Mode, Grover's search, quiz history) driven by
Presentation 2 planning.

## Testing

Manual black-box testing per module, plus physics invariant checks
(probabilities always sum to 1; H·H returns the original state). All 15 cases:

| ID | Test case | Expected | Result |
|----|-----------|----------|--------|
| T1 | Set \|0⟩ | P(0)=100% | Pass |
| T2 | Set \|1⟩ | P(1)=100% | Pass |
| T3 | Apply X to \|1⟩ | → \|0⟩ | Pass |
| T4 | H then H on \|0⟩ | returns to \|0⟩ | Pass |
| T5 | 100 shots on \|0⟩ | 100 × \|0⟩, 0 × \|1⟩ | Pass |
| T6 | 100 shots on \|+⟩ | approx 50/50 (±10) | Pass |
| T7 | 100 Bell-pair measurements | only 00 & 11 occur | Pass |
| T8 | Deutsch: constant function | \|0⟩ in 10/10 runs | Pass |
| T9 | Quiz scoring | exact correct count /5 | Pass |
| T10 | Reset Platform | full state restore | Pass |
| T11 | RY slider 0°→180° on \|0⟩ | \|+⟩ at 90°, \|1⟩ at 180° | Pass |
| T12 | Challenge: right probs, wrong phase | prompted to apply Z | Pass |
| T13 | Grover, each of 4 marked states | marked state 100% after 1 query | Pass |
| T14 | Quiz history across page refresh | rounds/best/average persist | Pass |
| T15 | Clear History with confirm dialog | stats wiped; Cancel keeps data | Pass |

## How to Run

1. Download or clone this repository.
2. Open `index.html` directly in any modern browser (internet needed for
   Chart.js/fonts), or serve via VS Code Live Server.
3. No installation, no build step, no backend.

## Scope

### In Scope
- Introductory quantum computing education: single-qubit states, X/H/Z/RY
  gates, Bell-state entanglement, Deutsch's algorithm, 2-qubit Grover's search
- Idealised state-vector simulation with real amplitudes
- Measurement probability and Monte-Carlo sampling demonstrations
- State-building challenges and knowledge checking with automated scoring
- Persistent (localStorage) quiz history

### Out of Scope
- Physical quantum hardware or cloud quantum execution
- Complex-number amplitudes (full 3D Bloch-sphere phase visualisation) —
  planned next iteration
- Advanced error correction, production-scale simulation, multi-qubit gate
  construction (CNOT), scaling Grover's search beyond 2 qubits

## Academic Project

Sol Plaatje University  
Computer Science & IT  
Capstone Project  
Student: Sibusiso Mchunu  
Student Number: 202434049

## Repository

https://github.com/sibusisocelimchunu-design/Quantum-Learning-Simulation-Platform
