# The Virtual Museum & AR Museum Guide

An immersive dual-experience digital museum running directly in modern web browsers:
1. **3D Virtual Museum:** A first-person walkthrough gallery powered by Unity 6 Universal Render Pipeline (URP) WebGL.
2. **AR Museum Guide:** A browser-based Augmented Reality guide allowing visitors to project authentic artifacts into their room at true 1:1 metric scale or inspect with 360° turntable controls.

**Live Website:** [https://christopher-marian.github.io/virtual-museum/](https://christopher-marian.github.io/virtual-museum/)

---

## Experience Routes

| Experience | Public URL | Description | Best For |
| :--- | :--- | :--- | :--- |
| **Dual Portal** | [`/`](https://christopher-marian.github.io/virtual-museum/) | Grand entrance portal with experience choice | All devices |
| **3D Virtual Museum** | [`/museum.html`](https://christopher-marian.github.io/virtual-museum/museum.html) | First-person 3D gallery walkthrough | Desktop & Laptop |
| **AR Museum Guide** | [`/webar/`](https://christopher-marian.github.io/virtual-museum/webar/) | Web-based Augmented Reality & 3D turntable | Mobile (iOS/Android) |

---

## Previews

| Welcome Screen & Visitor Guide | Museum Hall & Exhibits |
| :---: | :---: |
| ![Welcome Screen](screenshots/welcome_screen.png) | ![Museum Gallery](screenshots/museum_gallery.png) |

---

## Exploration Controls (3D Virtual Museum)

| Key / Input | Action |
| :--- | :--- |
| **W A S D** | Walk forward, left, backward, right |
| **Mouse** | Look around (first-person camera) |
| **Left Shift** | Sprint / accelerate movement |
| **E / Left Click** | Inspect exhibit & view curatorial history |
| **Mouse Drag** | Rotate 3D artifact on turntable during inspection |
| **ESC** | Close inspection panel / toggle cursor lock |

> **Note:** Click anywhere inside the 3D window to capture mouse controls.

---

## WebAR Guide Features

- **Apple Quick Look (iOS Safari):** Native zero-install AR with automatic surface detection.
- **Google Scene Viewer / WebXR (Android Chrome):** Native AR session with floor and table placement.
- **Desktop 3D Turntable Mode:** Full 360° mouse orbit, zoom, and fullscreen inspection.
- **1:1 Metric Dimensions:** Accurate real-world scale for every artifact.

---

## Featured Exhibits

1. **Ancient Greek & Roman Coins** — Classical Athenian owl tetradrachms and Roman Augustan aurei.
2. **Attic Black-Figure Amphora** — Terracotta ancient Greek pottery with mythological motifs.
3. **Tyrannosaurus Rex Fossil Skull** — Late Cretaceous fossil mounted on an articulated armature.
4. **Bust of Queen Nefertiti** — 18th Dynasty Amarna royal portrait sculpture on an obsidian plinth.
5. **The Discobolus of Myron** — High Classical Greek discus thrower sculpture.

---

## Architecture & Tech Stack

- **3D Museum Engine:** Unity 6 (6000.5.6f1) Universal Render Pipeline (URP) WebGL
- **WebAR Engine:** Google `<model-viewer>` Web Component (glTF 2.0 Binary / GLB)
- **Styling:** Classical antique gold (`#D4AF37`) & dark obsidian (`#0B0C0E`)
- **Hosting & CI/CD:** GitHub Pages via GitHub Actions (.github/workflows/deploy.yml)
