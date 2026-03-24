# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Lazy loading for all main components
- Unit tests with Vitest for Simplex, Graphical, Transportation solvers and formatters
- CI workflow (lint + test + build on every push/PR)
- Automated deploy to GitHub Pages via GitHub Actions

### Fixed
- Big-M method correctness in Simplex solver
- ESLint warnings across components

## [1.0.0] - 2025-03-01

### Added
- Simplex method solver with step-by-step Big-M explanation
- Graphical method solver for 2-variable problems
- Transportation solver (Northwest Corner, Minimum Cost, Vogel's Approximation)
- Cross-method comparison view
- PDF export of results
- Responsive design with CSS custom properties
- Method explanation tabs (theory + tutorial + calculator)
