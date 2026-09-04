# CopilotWith: From Fog to Proof

An interactive RVAS that tells one customer story: how CopilotWith turns fragmented estate evidence into a bounded, human-owned modernisation decision. It is designed for live customer conversations, not as a feature catalogue or a static product page.

The experience moves through seven chapters: estate fog, system reveal, evidence gap, human choice, bounded slice, proof, and scale.

## Live RVAS

Open the hosted experience at [https://ravi0130.github.io/CopilotWith-RVAS/](https://ravi0130.github.io/CopilotWith-RVAS/).

## The seven chapters

1. **The Fog** - 1,994 artefacts obscure a 16-interface estate.
2. **The Reveal** - specialist agents turn files into a connected system map.
3. **The Gap** - evidence remains distinct from inference, and I3248 needs SME context.
4. **The Choice** - CopilotWith frames the A9_Sales options; a human chooses.
5. **The Slice** - the decision becomes one bounded, reviewable, reversible change.
6. **The Proof** - evidence checks finish, but only a human can approve progression.
7. **The Scale** - one proven slice becomes a reusable programme pattern.

## Run locally

Requirements: Node.js 20 or later and npm.

```powershell
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173/CopilotWith-RVAS/`.

```powershell
npm run lint
npm run build
npm run preview
```

## Repository map

```text
src/App.tsx       Seven-chapter experience, interaction state, and demo model
src/App.css       Editorial chapter layouts and responsive visual system
src/index.css     Clawpilot theme tokens and global foundations
docs/             Architecture, demo script, and data provenance
```

## Important demo boundary

This MVP is an illustrative replay, not a live repository scanner. Its estate facts are adapted from the CopilotWith middleware-displacement sample outputs; the SME intervention, timed reveal, delivery proof, and customer framing are narrative devices. See [docs/DATA-PROVENANCE.md](docs/DATA-PROVENANCE.md).

## Next evolution

A production version can populate the same experience from repository analysis, specialist agent runs, evidence stores, approval workflows, and exported evidence packs.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the integration shape and [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md) for a customer walkthrough.