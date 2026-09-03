# CopilotWith Modernisation Mission Control

An interactive RVAS for showing how CopilotWith turns a complex legacy estate into a governed modernisation programme. It is designed for live customer conversations, not as a static product page.

The experience lets a presenter replay an anonymised discovery mission, inspect the programme topology, meet the specialist agents, compare accelerator packs, filter evidence by confidence, and make a human stage-gate decision.

## What the demo shows

- A timed mission replay that reveals findings as agents work
- An interactive programme twin with selectable systems, risks, and technologies
- Eight governed agent roles with explicit inputs, outputs, and control boundaries
- Evidence classified as `OBSERVED`, `INFERRED`, `ASSUMED`, or `UNKNOWN`
- A human-in-the-loop decision gate that can approve a bounded scope or pause for evidence
- Pack and outcome views for moving from one scenario into a wider customer discussion
- Responsive light and dark themes for desktop and mobile demonstrations

## Run locally

Requirements: Node.js 20 or later and npm.

```powershell
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

```powershell
npm run lint
npm run build
npm run preview
```

## Demo modes

**Briefing** frames the customer story before showing detail. **Replay** runs the evidence timeline and progressively activates the programme twin. **Explore** leaves the interface open for unscripted discussion.

Use the Mission, Agents, Packs, and Outcomes navigation to move from a concrete estate story to the broader CopilotWith operating model.

## Repository map

```text
src/App.tsx       Experience shell, interaction state, and views
src/data.ts       Typed programme, agent, pack, and replay content
src/App.css       Component and responsive visual system
src/index.css     Theme tokens and global foundations
docs/             Architecture, demo script, and data provenance
```

## Important demo boundary

This MVP is a visual accelerator, not a live repository scanner. The agent model and governance principles are derived from the CopilotWith packs; the named customer, topology, replay timing, and programme metrics are illustrative, anonymised demo content. See [docs/DATA-PROVENANCE.md](docs/DATA-PROVENANCE.md).

## Next evolution

The in-memory model is intentionally isolated in `src/data.ts`. A production version can replace it with adapters for repository analysis, Copilot agent runs, evidence stores, approval workflows, and exported evidence packs while preserving the current presentation layer.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the integration shape and [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md) for a customer walkthrough.