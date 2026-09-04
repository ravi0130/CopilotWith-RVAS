# Architecture

## Current shape

The RVAS is a client-side React application. `src/App.tsx` contains the small illustrative estate model and owns presentation state for chapter progression, the selected system, scan reveal, SME intervention, strategy choice, proof disclosure, and human approval.

```mermaid
flowchart LR
    D[Repository-grounded demo facts] --> S[Seven-chapter story]
    S --> M[Estate map]
    S --> E[Evidence gap]
    S --> C[Human choice]
    S --> P[Bounded slice and proof]
    P --> G[Human stage gate]
    G --> W[Programme waves]
```

The implementation is deliberately small:

- `src/App.tsx` defines the demo model and coordinates chapters and interactions.
- `src/App.css` contains the responsive component system.
- `src/index.css` contains global theme tokens and foundations.

No backend, authentication, telemetry, or customer data connection is included in this MVP. A live implementation should extract a versioned model contract and populate it through adapters.

## Live accelerator target

The next version should retain the typed programme model as a stable UI contract and populate it through adapters.

```mermaid
flowchart LR
    R[Customer repositories] --> O[CopilotWith orchestrator]
    O --> S[Specialist agent runs]
    S --> N[Evidence normaliser]
    N --> P[(Programme evidence store)]
    P --> API[Mission Control API]
    API --> UI[Interactive customer story]
    UI --> H[Human approval service]
    H --> P
    P --> EP[Evidence pack export]
```

Recommended integration boundaries:

1. **Programme API** returns estate nodes, relationships, agent activity, evidence, and gates using versioned schemas.
2. **Evidence normaliser** preserves source citations and confidence labels rather than flattening all findings into facts.
3. **Replay service** streams recorded or live agent events through Server-Sent Events or WebSockets.
4. **Approval service** records identity, decision, scope, conditions, and timestamp. The UI must not infer approval from agent output.
5. **Evidence exporter** creates customer-owned decision and audit artefacts from the same underlying records.

## Production controls

- Authenticate users and authorise access per engagement.
- Encrypt evidence in transit and at rest; keep customer estates isolated.
- Store immutable citations and approval history.
- Redact secrets and personal data before evidence reaches the UI.
- Make agent boundaries and confidence classification part of the API contract.
- Add accessibility, browser, integration, and visual-regression tests.