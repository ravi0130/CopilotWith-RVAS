# Architecture

## Current implementation

The accelerator is a client-side React application with a deterministic mission state machine in `src/MissionControl.tsx`. It models application selection, persona, scan progress, blocker inspection, specialist selection, plan choices, human approvals, transformation output, architecture progression, and portfolio waves.

```mermaid
flowchart LR
    M[Choose application] --> X[Application X-Ray]
    X --> A[Agent fleet and handoffs]
    A --> P[Plan and human decision]
    P --> T[Bounded transformation]
    T --> E[Evidence and approval]
    E --> F[Architecture time machine]
    F --> W[Portfolio waves]
```

The current implementation has no backend, authentication, telemetry, or customer repository connection. Story Mode uses a versioned, deterministic sample so customer demonstrations do not depend on network or model variance.

## Target modes

- **Story Mode**: curated snapshot with deterministic agent events and proof.
- **Connected Mode**: repository analysis and agent events populate the same UI contract.
- **Workshop Mode**: customer constraints, decisions, comments, and proposed waves are retained as workshop outputs.

```mermaid
flowchart LR
    R[Customer repositories] --> O[CopilotWith orchestrator]
    O --> A[Specialist agents]
    A --> N[Evidence normaliser]
    N --> S[(Programme evidence store)]
    S --> API[Mission Control API]
    API --> UI[React control room]
    UI --> H[Human approval service]
    H --> S
    S --> EX[Evidence pack export]
```

## Integration boundaries

1. A versioned programme API returns systems, topology, findings, agent activity, plans, evidence, and gates.
2. An evidence normaliser preserves citations and `OBSERVED`, `INFERRED`, `ASSUMED`, and `SME-CONFIRMED` classifications.
3. Server-Sent Events or WebSockets replay live and recorded agent activity through one event contract.
4. An approval service records identity, scope, conditions, decision, and timestamp.
5. An exporter creates customer-owned decision, audit, and engineering artefacts from the same records.

## Production controls

- Authenticate and authorise per engagement and application.
- Encrypt evidence and isolate customer estates.
- Retain immutable source citations and approval history.
- Redact secrets and personal data before rendering.
- Never infer human approval from agent output.
- Add contract, accessibility, browser, integration, and visual-regression tests.
