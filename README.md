# CopilotWith Modernisation Mission Control

An interactive customer accelerator that makes application modernisation feel like a live, governed engineering mission. Select an application, materialise its topology, inspect blockers, activate specialist agents, alter the plan, transform a bounded component, review evidence, and scale the pattern across an estate.

This is an application-like control room, not a CopilotWith information site.

## Live experience

[Open Modernisation Mission Control](https://ravi0130.github.io/CopilotWith-RVAS/)

## The mission

1. Enter the Contoso University modernisation mission.
2. Watch an application X-Ray reveal runtime, messaging, storage, and hosting blockers.
3. Ask questions that refocus the topology and affected modernisation path.
4. Inspect eight specialist agents and watch evidence move through their handoffs.
5. Change priorities and customer constraints, then approve a bounded plan.
6. Transform an MSMQ publisher into an Azure Service Bus integration.
7. Review build, test, security, container, pull-request, and human-gate evidence.
8. Drag the architecture through its transition and generate portfolio waves.

Three persona controls change the estate emphasis for executives, architects, and developers. The guided demo is deterministic and safe for live demonstrations.

## Run locally

Requires Node.js 20 or later.

```powershell
npm install
npm run dev
```

Vite normally serves the app at `http://localhost:5173/CopilotWith-RVAS/`.

```powershell
npm run lint
npm run build
npm run preview
```

## Repository map

```text
src/MissionControl.tsx  Mission state, interactions, and application model
src/MissionControl.css Responsive control-room visual system
src/index.css          Clawpilot theme tokens and global foundations
docs/                  Architecture, demo script, and provenance
```

## Demo boundary

The current build is a deterministic replay, not a live repository scanner. Contoso University, its topology, generated code, validation outcomes, projected readiness, and portfolio metrics are illustrative and labelled accordingly. The specialist roles, evidence discipline, human gates, and governance boundaries reflect the CopilotWith operating model.

See [data provenance](docs/DATA-PROVENANCE.md), [architecture](docs/ARCHITECTURE.md), and the [customer demo script](docs/DEMO-SCRIPT.md).
