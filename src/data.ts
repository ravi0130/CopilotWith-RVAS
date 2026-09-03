export type Confidence = 'OBSERVED' | 'INFERRED' | 'ASSUMED' | 'UNKNOWN'

export type Agent = {
  id: string
  order: string
  name: string
  role: string
  verb: string
  description: string
  reads: string[]
  produces: string[]
  boundary: string
}

export type EvidenceEvent = {
  time: string
  title: string
  detail: string
  confidence: Confidence
  agentId: string
}

export type EstateNode = {
  id: string
  label: string
  type: 'source' | 'hub' | 'integration' | 'target'
  x: number
  y: number
  risk: number
  evidence: number
  technologies: string[]
  note: string
}

export const agents: Agent[] = [
  { id: 'orchestrator', order: '00', name: 'Programme Orchestrator', role: 'Orchestrator', verb: 'Route', description: 'Reads engagement state, routes work to the right specialist, and pauses at every stage gate.', reads: ['Engagement state', 'Pack boundaries', 'Previous outputs'], produces: ['Dispatch plan', 'Decision requests'], boundary: 'Holds no domain logic and never approves its own progression.' },
  { id: 'discovery', order: '01', name: 'Estate Census', role: 'Discovery', verb: 'Discover', description: 'Builds a breadth-first inventory of interfaces, technologies, dependencies, and evidence gaps.', reads: ['Source artefacts', 'Configuration', 'Repository metadata'], produces: ['Interface register', 'Evidence gap log'], boundary: 'Read-only. Classifies what exists; does not recommend a target architecture.' },
  { id: 'assessment', order: '02', name: 'Deep Analysis', role: 'Assessment', verb: 'Understand', description: 'Traces selected components in depth and reconstructs contracts, transformations, and failure behaviour.', reads: ['Selected interfaces', 'Runtime evidence', 'SME notes'], produces: ['Interface cards', 'Risk findings'], boundary: 'Findings remain evidence, not autonomous transformation decisions.' },
  { id: 'planning', order: '03', name: 'Displacement Designer', role: 'Planning', verb: 'Design', description: 'Compares target options and sequences migration waves around dependency and operational risk.', reads: ['Approved findings', 'Customer constraints', 'Target standards'], produces: ['Target design', 'Wave plan', 'ADRs'], boundary: 'Produces options and recommendations; the customer chooses the direction.' },
  { id: 'execution', order: '04', name: 'Slice Implementer', role: 'Execution', verb: 'Change', description: 'Implements one approved, reversible migration slice and opens it for review.', reads: ['Approved slice', 'Acceptance criteria', 'Test baseline'], produces: ['Code change', 'Pull request', 'Rollback notes'], boundary: 'Never merges, pushes to production, or expands beyond the approved slice.' },
  { id: 'review', order: '05', name: 'Quality Verifier', role: 'Review', verb: 'Verify', description: 'Tests behaviour, security, and architecture compliance against the approved evidence baseline.', reads: ['Pull request', 'Test strategy', 'Security controls'], produces: ['Test evidence', 'Review findings'], boundary: 'Reports pass or fail; it does not accept risk or policy exceptions.' },
  { id: 'evidence', order: '06', name: 'Evidence Curator', role: 'Evidence', verb: 'Defend', description: 'Assembles citations, assumptions, decisions, and delivery outcomes into an auditable evidence pack.', reads: ['Agent outputs', 'Approvals', 'Test results'], produces: ['Evidence pack', 'Audit trail', 'Executive brief'], boundary: 'Separates observed outcomes from assumptions and projected value.' },
  { id: 'governance', order: '99', name: 'Governance Gate', role: 'Gate', verb: 'Control', description: 'Checks readiness, unresolved gaps, and required human decisions before work can progress.', reads: ['Evidence pack', 'Boundary rules', 'Approval criteria'], produces: ['Gate report', 'Required actions'], boundary: 'Verifies readiness. A human approver remains accountable for the decision.' },
]

export const evidenceEvents: EvidenceEvent[] = [
  { time: '00:02', title: 'Repository boundary confirmed', detail: 'Read-only scan limited to the approved integration estate.', confidence: 'OBSERVED', agentId: 'orchestrator' },
  { time: '00:09', title: '1,994 source artefacts indexed', detail: 'MQSC, ESQL, message flows, XML, SQL, and shell scripts classified.', confidence: 'OBSERVED', agentId: 'discovery' },
  { time: '00:18', title: '16 integrations reconstructed', detail: 'Nine technologies connected across messaging, ETL, APIs, and file transfer.', confidence: 'OBSERVED', agentId: 'discovery' },
  { time: '00:27', title: 'A9_Sales identified as critical hub', detail: 'Eight direct consumers create the largest observed blast radius.', confidence: 'INFERRED', agentId: 'assessment' },
  { time: '00:34', title: 'Runtime evidence gap raised', detail: 'No queue depths, message traces, SLAs, or production schedules were supplied.', confidence: 'UNKNOWN', agentId: 'evidence' },
  { time: '00:41', title: 'Migration waves drafted', detail: 'Six early-win candidates precede the cross-platform delivery tier.', confidence: 'ASSUMED', agentId: 'planning' },
]

export const nodes: EstateNode[] = [
  { id: 'pos', label: 'PoS systems', type: 'source', x: 7, y: 26, risk: 2, evidence: 3, technologies: ['Point of Sale'], note: 'Primary sales-data source.' },
  { id: 'sap', label: 'SAP', type: 'source', x: 7, y: 70, risk: 2, evidence: 3, technologies: ['ERP'], note: 'Article-master source.' },
  { id: 'a9', label: 'A9_Sales', type: 'hub', x: 34, y: 38, risk: 5, evidence: 3, technologies: ['ACE', 'MQ', 'DataStage', 'DB2'], note: 'Critical sales hub with eight direct consumers.' },
  { id: 'i0016', label: 'I0016', type: 'integration', x: 34, y: 76, risk: 5, evidence: 4, technologies: ['ACE', 'MQ', 'MQFTE'], note: 'Strategic article master with 12+ consumers.' },
  { id: 'esfa', label: 'ESFA', type: 'integration', x: 66, y: 12, risk: 1, evidence: 3, technologies: ['DataStage'], note: 'Wave 1 early-win candidate.' },
  { id: 'i0977', label: 'I0977 Cybake', type: 'integration', x: 66, y: 34, risk: 2, evidence: 4, technologies: ['ACE', 'MQ', 'DataStage'], note: 'MQ-to-HTTP bridge.' },
  { id: 'salesagg', label: 'Sales aggregation', type: 'integration', x: 66, y: 56, risk: 2, evidence: 3, technologies: ['DataStage', 'DB2'], note: 'High-value Wave 1-2 candidate.' },
  { id: 'partners', label: 'External partners', type: 'target', x: 88, y: 34, risk: 3, evidence: 2, technologies: ['SFTP', 'HTTP'], note: 'Hallmark, Cybake, Secure, and JDA.' },
  { id: 'consumers', label: '12+ consumers', type: 'target', x: 66, y: 82, risk: 5, evidence: 3, technologies: ['MQFTE', 'Pub/Sub'], note: 'Wide fan-out from strategic article master.' },
]

export const links = [
  ['pos', 'a9'], ['sap', 'i0016'], ['a9', 'esfa'], ['a9', 'i0977'], ['a9', 'salesagg'], ['i0977', 'partners'], ['i0016', 'consumers'],
] as const

export const packs = [
  ['Middleware displacement', '12 agents', 'Proven in engagement'],
  ['Application modernisation', '11 agents', 'Demonstrated pattern'],
  ['Reverse engineering', '19 agents', 'Designed capability'],
  ['COBOL modernisation', '9 agents', 'Designed + sample'],
  ['Structured data estate', '13 agents', 'Designed capability'],
  ['Data sprawl discovery', '8 agents', 'Designed capability'],
]
