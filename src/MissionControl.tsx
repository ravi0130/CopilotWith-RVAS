import { useEffect, useState } from 'react'
import {
  Activity, ArrowRight, Bot, Box, Braces, Check, ChevronLeft, ChevronRight,
  CircleAlert, Cloud, Code2, Database, FileCode2, FileText, GitBranch,
  GitPullRequest, Layers3, LockKeyhole, Menu, MessageSquareText, Network,
  PackageCheck, Pause, Play, Radar, RefreshCw, Rocket, Search, Server, ShieldCheck,
  Sparkles, TestTube2, UserCheck, Users, X, Zap,
} from 'lucide-react'
import './MissionControl.css'

type Persona = 'Executive' | 'Architect' | 'Developer'
type Scene = 'possibility' | 'brief' | 'framework' | 'packs' | 'demos' | 'xray' | 'fleet' | 'plan' | 'transform' | 'validate' | 'time' | 'scale'
type DemoId = 'eshop' | 'contoso' | 'petclinic'
type DemoPhase = 'before' | 'plan' | 'after'
type AgentId = 'archaeologist' | 'dependency' | 'planner' | 'architect' | 'integration' | 'security' | 'test' | 'deployment'

const personaLenses: Record<Persona, { label: string; question: string; decision: string }> = {
  Executive: { label: 'OUTCOMES + INVESTMENT', question: 'What outcome improves, what risk falls and what investment is justified?', decision: 'Confirm priority, funding, risk appetite and accountable owner.' },
  Architect: { label: 'BOUNDARIES + DECISIONS', question: 'Which boundaries, dependencies and transition states make the change viable?', decision: 'Approve target direction, constraints and reversible architecture choices.' },
  Developer: { label: 'IMPLEMENTATION + PROOF', question: 'What bounded change can be built, tested and reviewed without losing behaviour?', decision: 'Confirm task clarity, engineering feasibility and evidence needed for merge.' },
}

const sceneFocus: Record<Scene, string> = {
  possibility: 'Where GitHub Copilot can accelerate engineering, and where human judgment remains essential.',
  brief: 'The application type, business intent and constraints that define the modernisation mission.',
  framework: 'How evidence-led agents, governance controls and human gates work as one operating model.',
  packs: 'Which specialist agent pack matches the technology, evidence available and required outcome.',
  demos: 'A concrete before-to-plan-to-after journey, grounded in an application rather than a generic promise.',
  xray: 'Observed dependencies, blockers and uncertainty that must shape scope before implementation begins.',
  fleet: 'How specialist agents divide work, hand off evidence and remain inside explicit authority boundaries.',
  plan: 'The proposed sequence, constraints and approval points that turn findings into reviewable delivery.',
  transform: 'The bounded code and configuration change being made, with the approved plan held constant.',
  validate: 'Behavioural parity, security checks and build evidence required before the change can progress.',
  time: 'The measurable difference between the legacy baseline and the modernised target state.',
  scale: 'How application-level evidence becomes portfolio waves, capacity choices and investment sequencing.',
}

const scenes: Array<{ id: Scene; label: string; verb: string }> = [
  { id: 'possibility', label: 'Art of Possibility', verb: 'IMAGINE' },
  { id: 'brief', label: 'Mission', verb: 'ENTER' },
  { id: 'framework', label: 'Operating Model', verb: 'GOVERN' },
  { id: 'packs', label: 'Pack Atlas', verb: 'ROUTE' },
  { id: 'xray', label: 'Application X-Ray', verb: 'DISCOVER' },
  { id: 'fleet', label: 'Agent Team', verb: 'ORCHESTRATE' },
  { id: 'plan', label: 'Modernisation Plan', verb: 'DECIDE' },
  { id: 'transform', label: 'Transform', verb: 'MODERNISE' },
  { id: 'validate', label: 'Proof', verb: 'VALIDATE' },
  { id: 'time', label: 'Before / After', verb: 'COMPARE' },
  { id: 'scale', label: 'Portfolio', verb: 'SCALE' },
  { id: 'demos', label: 'Demo Studio', verb: 'DEMO' },
]

const programmeScenes = scenes.filter((item) => item.id !== 'possibility' && item.id !== 'demos')

const agents: Record<AgentId, { name: string; role: string; activity: string; powers: string[]; tools: string; output: string; approval: string; icon: typeof Search }> = {
  archaeologist: { name: 'Documentation Agent', role: 'Reconstructs the current system before anybody changes it.', activity: 'Reading projects, configuration, entry points and business boundaries', powers: ['Repository search', 'Architecture recovery', 'Evidence citations'], tools: 'READ · SEARCH · GRAPH', output: 'HLD · LLD · ADR candidates · runbook', approval: 'None for read-only analysis', icon: Search },
  dependency: { name: 'Leiden Decomposition Agent', role: 'Finds communities, bridge nodes and migration coupling.', activity: 'Tracing MSMQ producers and consumers across the solution graph', powers: ['Dependency graph', 'Community detection', 'Bridge-node risk'], tools: 'SEARCH · EXECUTE · GRAPH', output: 'Candidate communities · blocker register · affected code', approval: 'Boundaries require human validation', icon: Layers3 },
  planner: { name: 'Modernisation Agent', role: 'Selects the safest strategy and routes to the correct planner.', activity: 'Comparing refactor, modular monolith and microservices paths', powers: ['Strategy selection', 'Constraint reasoning', 'Agent routing'], tools: 'READ · SEARCH · PLAN', output: 'Strategy decision · planning-agent handoff', approval: 'Strategy and sequencing require approval', icon: Radar },
  architect: { name: 'Microservices Plan Agent', role: 'Designs service boundaries, contracts and phased extraction.', activity: 'Mapping the messaging boundary to a reversible Azure target', powers: ['Target design', 'Contract design', 'Transition states'], tools: 'READ · SEARCH · DIAGRAM', output: 'Service plan · ADR drafts · extraction sequence', approval: 'Architecture choice requires approval', icon: Cloud },
  integration: { name: 'Implementation Agent', role: 'Implements one approved, reviewable modernisation slice.', activity: 'Replacing the bounded MSMQ publisher with Azure Service Bus', powers: ['Edit source', 'Fix build', 'Create configuration'], tools: 'READ · EDIT · EXECUTE · TODO', output: 'Code diff · configuration · migration notes', approval: 'Cannot re-scope or merge its own work', icon: Network },
  security: { name: 'Security Review Agent', role: 'Checks packages, secrets, identity and network exposure.', activity: 'Evaluating CVEs and deployment security controls', powers: ['CVE scanning', 'Secret detection', 'Control verification'], tools: 'SEARCH · EXECUTE · GHAS', output: 'Security findings · remediation · gate evidence', approval: 'Risk acceptance remains human', icon: ShieldCheck },
  test: { name: 'Testing Agent', role: 'Freezes behaviour and proves each approved change.', activity: 'Generating characterisation and compatibility tests', powers: ['Test synthesis', 'Baseline capture', 'Parity checking'], tools: 'READ · EDIT · EXECUTE', output: 'Tests · build results · behavioural comparison', approval: 'Test exceptions require approval', icon: TestTube2 },
  deployment: { name: 'UI & Deployment Agents', role: 'Modernise presentation and prepare governed delivery assets.', activity: 'Preparing accessible UI, container and GitHub Actions assets', powers: ['UI migration', 'Containerisation', 'Pipeline generation'], tools: 'EDIT · EXECUTE · BROWSER', output: 'UI · Dockerfile · workflow · deployment plan', approval: 'Production deployment requires approval', icon: Rocket },
}

const applicationTypes = [
  { name: '.NET Framework', example: 'WebForms · WCF · Windows Services', pack: 'MODERNISATION', icon: Braces },
  { name: 'COBOL Mainframe', example: 'CICS · JCL · VSAM · DB2', pack: 'COBOL', icon: Server },
  { name: 'Progress OpenEdge', example: 'ABL · AppServer · procedures', pack: 'PROGRESS', icon: Database },
  { name: 'Uniface', example: 'Forms · triggers · operations', pack: 'UNIFACE', icon: FileCode2 },
  { name: 'Liferay Portal', example: 'OSGi · portlets · themes', pack: 'LIFERAY', icon: Layers3 },
  { name: 'Integration Estate', example: 'ACE · IIB · MQ · APIs', pack: 'MIDDLEWARE', icon: Network },
  { name: 'HDInsight', example: 'Spark · Hive · HBase · Oozie', pack: 'DATABRICKS', icon: Cloud },
  { name: 'Azure DevOps', example: 'YAML · Classic pipelines · releases', pack: 'GITHUB ACTIONS', icon: GitBranch },
]

const xrayEvents = [
  ['00:00:01', 'Repository indexed', 'SOURCE'],
  ['00:00:02', '147 source files analysed', 'OBSERVED'],
  ['00:00:03', '.NET Framework dependency detected', 'OBSERVED'],
  ['00:00:04', 'Windows-specific messaging detected', 'BLOCKER'],
  ['00:00:05', 'Local persistence pattern detected', 'BLOCKER'],
  ['00:00:06', '4 modernisation blockers identified', 'EVIDENCE'],
]

const packInventory = [
  ['APP MODERNISATION', '11 agents'], ['COBOL', '9 agents'], ['PROGRESS', '9 agents'],
  ['UNIFACE', '9 agents'], ['MIDDLEWARE', '12 agents'], ['REVERSE ENGINEERING', '19 agents'],
  ['DATA & ANALYTICS', '30+ agents'], ['DELIVERY & CHANGE', '10+ agents'],
]

const packCatalog = [
  { id: 'modernisation', name: 'Application Modernisation', code: '01', category: 'SOURCE AVAILABLE', maturity: 'DEMONSTRATED PATTERN', agents: '11 agents', skills: '19 skills', scenario: '.NET and open-source codebases', layer1: 'System discovery · architecture reasoning · behaviour contract · domain boundaries', layer2: 'Refactor, modular-monolith or microservices plan · tests · bounded implementation', sources: '.NET Framework · VB.NET · VB6 · ASP · Java · Delphi · PowerBuilder · ColdFusion', outputs: 'HLD / LLD · ADRs · user stories · tests · pull requests · business case', sequence: ['DISCOVER', 'DOCUMENT', 'CONTRACT', 'DOMAIN', 'STRATEGY', 'PLAN', 'TEST', 'IMPLEMENT'], guardrail: 'Tests before material change. Human review at every stage.', icon: Braces },
  { id: 'blazor', name: 'Blazor Estate Analysis', code: '10', category: 'CALIBRATION LAB', maturity: 'BLIND-SANITY TESTED', agents: 'Analysis pipeline', skills: '7 specialist skills', scenario: 'MVC + Razor Pages to Blazor', layer1: 'Detect hybrid estates, auth contracts, session state, JavaScript coupling and pilot candidates', layer2: 'Wave planning after the analysis gate; transformation is deliberately excluded from calibration', sources: 'Controllers · Razor views · claims · Session · TempData · jQuery · EF Core', outputs: 'Architecture summary · feature scoring · risk register · pilot recommendation', sequence: ['SCAN', 'SCORE', 'CONTRACT', 'COUPLING', 'PILOT', 'GATE'], guardrail: 'A faithful run must preserve five governance-critical findings.', icon: Layers3 },
  { id: 'cobol', name: 'COBOL Modernisation', code: '11', category: 'SPECIALIST ADVANCED', maturity: 'DESIGNED + WORKED SAMPLE', agents: '9 agents', skills: '2 deep skills', scenario: 'Batch, CICS, JCL, VSAM and DB2', layer1: 'Estate census · paragraph-level analysis · copybook model · rules · batch flow', layer2: 'Azure target · characterisation tests · governed COBOL to .NET / Java conversion', sources: 'COBOL · copybooks · JCL · COMMAREA · VSAM · DB2', outputs: 'Call graph · schema · rule catalogue · test harness · target design', sequence: ['CENSUS', 'DEEP ANALYSIS', 'DATA', 'RULES', 'FLOWS', 'DESIGN', 'TEST', 'CONVERT', 'GATE'], guardrail: 'Executable code is authoritative. Every claim cites program and line.', icon: Server },
  { id: 'progress', name: 'Progress OpenEdge', code: '12', category: 'SPECIALIST ADVANCED', maturity: 'DESIGNED + WORKED SAMPLE', agents: '9 agents', skills: '2 deep skills', scenario: 'ABL / 4GL configured estates', layer1: 'Resolve PROPATH, preprocessor, includes, triggers, dynamic RUN and shared state', layer2: 'Target design · parity tests · governed Progress to .NET / Java conversion', sources: '.p · .w · .i · .cls · .df · .pf · compile listings', outputs: 'Compile view · call graph · hidden dependencies · schema · rule catalogue', sequence: ['CENSUS', 'RESOLVE', 'ANALYSE', 'DATA', 'RULES', 'FLOWS', 'DESIGN', 'TEST', 'GATE'], guardrail: 'Analyse the resolved compile view, never the first matching source file.', icon: Database },
  { id: 'uniface', name: 'Uniface Modernisation', code: '13', category: 'SPECIALIST ADVANCED', maturity: 'DESIGNED + WORKED SAMPLE', agents: '9 agents', skills: '2 deep skills', scenario: 'Model-driven 4GL estates', layer1: 'Resolve model layers, trigger inheritance, signatures, operations and runtime wiring', layer2: 'Azure target · operation-parity tests · governed Uniface to .NET / Java conversion', sources: '.urr · .uar · .asn · DB schema · ProcScript · 3GL bridges', outputs: 'Resolved behaviour · entity model · rules · flows · security map · target design', sequence: ['CENSUS', 'TRIGGERS', 'DATA', 'RULES', 'FLOWS', 'DESIGN', 'TEST', 'CONVERT', 'GATE'], guardrail: 'An empty trigger is a finding. Compilation state and inheritance matter.', icon: FileCode2 },
  { id: 'middleware', name: 'Middleware Displacement', code: '21', category: 'FACTORY PACK', maturity: 'PROVEN IN ENGAGEMENT', agents: '12 agents', skills: '20+ skills', scenario: 'MQ, ACE, MuleSoft, Tibco, BizTalk, Boomi, Apigee', layer1: 'Estate census · deep analysis · contracts · runtime flows · transformation logic', layer2: 'Azure Integration Services design · implementation · testing · security · cutover', sources: 'Flows · ESQL · APIs · queues · EDI · runtime evidence · configuration', outputs: 'Interface register · OpenAPI / AsyncAPI · mappings · evidence pack · cutover plan', sequence: ['CENSUS', 'ANALYSE', 'CONTRACT', 'FLOW', 'DESIGN', 'BUILD', 'TEST', 'SECURE', 'CUTOVER', 'GATE'], guardrail: 'Skill-first analysis and a ten-section evidence record per integration.', icon: Network },
  { id: 'liferay', name: 'Liferay Modernisation', code: '30', category: 'SCOPING PACK', maturity: 'DESIGNED CAPABILITY', agents: '2 agents', skills: '6 skills', scenario: 'Liferay Portal / DXP estates', layer1: 'Discover forms, Objects, workflows, OSGi modules and headless API surfaces', layer2: 'Design two-track plan: portable forms first, custom Java modules second', sources: 'DDM · Objects · content · workflows · OSGi · Service Builder · portlets', outputs: 'Inventory · open questions · authoring ADR · framework ADR · wave-one plan', sequence: ['DISCOVER', 'CLASSIFY', 'ADR', 'TRACK A', 'TRACK B', 'BRIEF'], guardrail: 'Scoping only. Delivery-tier transforms and cutover are separate.', icon: Layers3 },
  { id: 'reverse', name: 'Reverse Engineering', code: '80', category: 'COTS / PARTIAL SOURCE', maturity: 'DESIGNED CAPABILITY', agents: '19 agents', skills: 'Evidence-led', scenario: 'Closed-source or incomplete systems', layer1: 'Evidence census · capabilities · process · data · rules · UX · integrations · reports', layer2: 'Target design · backlog · implementation · testing · security · governance', sources: 'Metadata · configuration · APIs · database schema · runtime evidence · SME input', outputs: 'Reconstructed contracts · feature inventory · risks · target design · backlog', sequence: ['TRIAGE', 'EXTRACT', 'RECONSTRUCT', 'VALIDATE', 'DESIGN', 'BUILD', 'PROVE', 'GATE'], guardrail: 'Unknowns remain unknown. Effectiveness depends on available evidence.', icon: Search },
  { id: 'data-estate', name: 'Data Estate Discovery', code: 'DATA', category: 'ESTATE INTELLIGENCE', maturity: 'DESIGNED CAPABILITY', agents: '13 agents', skills: 'Two gated phases', scenario: 'Structured enterprise data estates', layer1: 'Document census · metadata harvest · classification · semantic matching · lineage', layer2: 'Catalogue · platform fit · data products · implementation · security governance', sources: 'Databases · schemas · apps · integration surfaces · managed data platforms', outputs: 'Catalogue · lineage · classifications · platform recommendations · product designs', sequence: ['INTAKE', 'HARVEST', 'CLASSIFY', 'MATCH', 'LINEAGE', 'GATE', 'DESIGN'], guardrail: 'Read-only harvest followed by a human governance gate.', icon: Database },
  { id: 'data-sprawl', name: 'Data Sprawl Discovery', code: '63', category: 'ESTATE INTELLIGENCE', maturity: 'DESIGNED CAPABILITY', agents: '8 agents', skills: 'Local discovery scripts', scenario: 'Uncontrolled file-based data', layer1: 'Connector planning · metadata discovery · risk · duplication · governance readiness', layer2: 'Strategy · remediation backlog · executive output', sources: 'SharePoint · OneDrive · Teams · network shares · local exports', outputs: 'Sprawl census · duplicate themes · risk register · remediation priorities', sequence: ['INTAKE', 'CONNECT', 'DISCOVER', 'RISK', 'DEDUP', 'SCORE', 'STRATEGY', 'BRIEF'], guardrail: 'Metadata-first discovery; source content and customer boundaries remain controlled.', icon: FileText },
  { id: 'integration', name: 'Integration Modernisation', code: '93', category: 'CALIBRATION LAB', maturity: 'BLIND-SANITY TESTED', agents: 'Discovery pipeline', skills: '4 domain skills', scenario: 'Document-led integration estates', layer1: 'Diff documents against SME corrections, preserve opacity and surface consolidation', layer2: 'Design and implementation remain behind a separate stage gate', sources: 'Discovery documents · workshop emails · contracts · operator constraints', outputs: 'Catalogue · readiness · open questions · consolidation · Wave 1 recommendation', sequence: ['PARSE', 'DIFF', 'CATALOGUE', 'CLASSIFY', 'QUESTION', 'CONSOLIDATE', 'PILOT'], guardrail: 'Never invent mechanisms for undocumented feeds or opaque vendor paths.', icon: GitBranch },
]

const blockers = [
  { id: 'runtime', label: '.NET Framework 4.8', detail: 'Windows-only runtime', target: 'Modern .NET', risk: 'HIGH', icon: Braces, x: 50, y: 15 },
  { id: 'queue', label: 'MSMQ', detail: '3 dependent components', target: 'Azure Service Bus', risk: 'CRITICAL', icon: Network, x: 18, y: 46 },
  { id: 'files', label: 'Local File System', detail: '14 direct references', target: 'Azure Blob Storage', risk: 'HIGH', icon: FileText, x: 82, y: 46 },
  { id: 'hosting', label: 'Windows Hosting', detail: 'IIS deployment coupling', target: 'Container Apps', risk: 'HIGH', icon: Server, x: 50, y: 81 },
]

const handoffs = [
  ['Application Archaeologist', 'Found an MSMQ dependency', 'OBSERVED'],
  ['Dependency Specialist', '3 components depend on this queue', 'OBSERVED'],
  ['Cloud Architect', 'Recommend Azure Service Bus', 'PROPOSED'],
  ['Modernisation Strategist', 'Added migration task MOD-014', 'PROPOSED'],
  ['Integration Moderniser', 'Refactor and compatibility tests prepared', 'READY'],
  ['Human Reviewer', 'Architecture decision required', 'DECISION'],
]

const planOptions = ['Lowest risk', 'Fastest migration', 'Cloud-native', 'Minimal code change']
const constraints = ['Database unchanged', 'Zero downtime', 'No public endpoints', 'Remain hybrid', 'One component only']
const adoptionLevels = [
  ['01', 'ASSISTED ANALYSIS', 'Copilot helps an engineer inspect one system.'],
  ['02', 'SKILL-DRIVEN WORKFLOW', 'Reusable methods, evidence templates and explicit gates.'],
  ['03', 'SPECIALIST AGENTS', 'Named agents own bounded tasks and hand work forward.'],
  ['04', 'MULTI-AGENT DELIVERY', 'Maker, checker and governance roles coordinate at scale.'],
  ['05', 'PORTFOLIO OPERATING MODEL', 'Patterns, controls and evidence govern the whole estate.'],
]

const eshopMissions = [
  {
    id: 'understand', verb: 'UNDERSTAND', title: 'Reconstruct the application', agent: 'Documentation Agent', status: 'MAPPING REPOSITORY', icon: Search,
    prompt: 'Explain this application, its deployable surfaces, and its architectural boundaries.',
    evidence: ['eShopOnWeb.sln', '6 source projects', 'Project references', 'Runtime configuration'],
    events: ['Solution and project graph indexed', 'Domain core isolated from infrastructure', 'Two deployable surfaces identified', 'Blazor admin boundary traced'],
    output: 'CURRENT-STATE HLD + DEPENDENCY GRAPH',
  },
  {
    id: 'protect', verb: 'PROTECT', title: 'Freeze observable behaviour', agent: 'Testing Agent', status: 'BUILDING SAFETY NET', icon: TestTube2,
    prompt: 'Before changing architecture, show which behaviours are protected and where evidence is missing.',
    evidence: ['UnitTests', 'IntegrationTests', 'FunctionalTests', 'PublicApiIntegrationTests'],
    events: ['Four test projects discovered', 'Domain rules mapped to unit tests', 'Web journeys mapped to functional tests', 'API contracts mapped to integration tests'],
    output: 'CHARACTERISATION PLAN + PARITY GATES',
  },
  {
    id: 'deliver', verb: 'DELIVER', title: 'Prepare a governed cloud path', agent: 'Deployment Agent', status: 'ASSEMBLING DELIVERY', icon: Rocket,
    prompt: 'Show the smallest reviewable route from local composition to an Azure-hosted deployment.',
    evidence: ['Web Dockerfile', 'PublicApi Dockerfile', 'docker-compose.yml', 'azure.yaml + Bicep'],
    events: ['Web and PublicApi images detected', 'SQL dependency mapped', 'App Service host declared', 'Infrastructure and Key Vault path linked'],
    output: 'CONTAINER + AZD + BICEP EVIDENCE PACK',
  },
]

const demoJourneys: Record<DemoId, {
  name: string; eyebrow: string; source: string; truth: string; icon: typeof Code2;
  phases: Record<DemoPhase, { title: string; summary: string; facts: string[]; outcome: string }>
}> = {
  eshop: {
    name: 'eShop', eyebrow: '.NET 10 + ASPIRE', source: 'dotnet/eShop', icon: Box,
    truth: 'A modern cloud-native reference application. This is an evolution and delivery demo, not a legacy migration.',
    phases: {
      before: { title: 'A modern distributed application', summary: 'Aspire composes services, dependencies and developer workflows across a current .NET solution.', facts: ['.NET 10 application', 'Aspire orchestration', 'Distributed service topology', 'Container-ready workloads'], outcome: 'SOURCE-GROUNDED CURRENT STATE' },
      plan: { title: 'Industrialise the delivery path', summary: 'Protect contracts, inspect service boundaries, assess operational readiness and sequence deployable changes.', facts: ['Map service contracts', 'Freeze critical journeys', 'Review identity and secrets', 'Prepare repeatable cloud delivery'], outcome: 'GOVERNED DELIVERY PLAN' },
      after: { title: 'A reviewable Azure-ready path', summary: 'The application retains its modern architecture while gaining explicit evidence, controls and deployment decisions.', facts: ['Verified service behaviour', 'Deployment assets reviewed', 'Operational controls surfaced', 'Human-approved release path'], outcome: 'DELIVERY EVIDENCE PACK' },
    },
  },
  contoso: {
    name: 'Contoso University', eyebrow: '.NET FRAMEWORK 4.8', source: 'Microsoft migration sample', icon: Braces,
    truth: 'A source-backed legacy .NET migration journey. Proposed target decisions remain visibly separate from observed facts.',
    phases: {
      before: { title: 'Windows-bound university application', summary: 'The legacy application carries framework, hosting and dependency constraints that must be understood before change.', facts: ['.NET Framework 4.8', 'ASP.NET application', 'Windows hosting coupling', 'Legacy dependency surface'], outcome: 'APPLICATION X-RAY' },
      plan: { title: 'Move in protected increments', summary: 'Baseline behaviour, resolve blockers, select the target architecture and implement one reviewable slice at a time.', facts: ['Capture characterisation tests', 'Upgrade dependency graph', 'Modernise hosting model', 'Gate architecture decisions'], outcome: 'APPROVED MIGRATION BACKLOG' },
      after: { title: 'Modern .NET with proof', summary: 'The target state is represented by tested code, explicit residual risks and evidence for human acceptance.', facts: ['Modern .NET target', 'Portable hosting path', 'Automated parity checks', 'Reviewable pull requests'], outcome: 'MIGRATION EVIDENCE PACK' },
    },
  },
  petclinic: {
    name: 'Spring PetClinic', eyebrow: 'JAVA + POSTGRESQL + AKS', source: 'AKS migration lab', icon: Cloud,
    truth: 'A documented Java modernisation lab covering assessment, passwordless PostgreSQL, containerisation and AKS deployment.',
    phases: {
      before: { title: 'Spring application with migration debt', summary: 'The application and its database access, dependencies and runtime assumptions are assessed before cloud changes begin.', facts: ['Spring Boot application', 'PostgreSQL persistence', 'Credential-based connectivity', 'Local runtime assumptions'], outcome: 'ASSESSMENT FINDINGS' },
      plan: { title: 'Secure, containerise, then deploy', summary: 'Remediate dependencies, introduce passwordless database access, build the container and validate the AKS design.', facts: ['CVE remediation', 'Managed identity design', 'Container build and scan', 'AKS manifests and probes'], outcome: 'DEPENDENCY-ORDERED PLAN' },
      after: { title: 'Passwordless PostgreSQL on AKS', summary: 'The resulting target uses governed identity, deployable Kubernetes assets and runtime validation evidence.', facts: ['Passwordless PostgreSQL', 'AKS workload identity', 'Health and readiness probes', 'Deployment validation'], outcome: 'AKS DELIVERY EVIDENCE' },
    },
  },
}

function MissionControl() {
  const [scene, setScene] = useState<Scene>('possibility')
  const [persona, setPersona] = useState<Persona>('Architect')
  const [scan, setScan] = useState(0)
  const [focus, setFocus] = useState('all')
  const [agent, setAgent] = useState<AgentId>('integration')
  const [handoffStep, setHandoffStep] = useState(0)
  const [priority, setPriority] = useState('Lowest risk')
  const [constraint, setConstraint] = useState('Database unchanged')
  const [approved, setApproved] = useState(false)
  const [transformed, setTransformed] = useState(false)
  const [validated, setValidated] = useState(false)
  const [modernity, setModernity] = useState(48)
  const [waves, setWaves] = useState(false)
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [autoDemo, setAutoDemo] = useState(false)
  const [applicationIndex, setApplicationIndex] = useState(0)
  const [packIndex, setPackIndex] = useState(0)
  const [adoptionLevel, setAdoptionLevel] = useState(2)
  const [demoMission, setDemoMission] = useState(0)
  const [selectedDemo, setSelectedDemo] = useState<DemoId>('eshop')
  const [demoPhase, setDemoPhase] = useState<DemoPhase>('before')

  const sceneIndex = scenes.findIndex((item) => item.id === scene)

  useEffect(() => {
    if (scene !== 'xray' || scan >= 100) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      const frame = requestAnimationFrame(() => setScan(100))
      return () => cancelAnimationFrame(frame)
    }
    const timer = window.setInterval(() => setScan((value) => Math.min(100, value + 2)), 34)
    return () => clearInterval(timer)
  }, [scene, scan])

  useEffect(() => {
    if (scene !== 'fleet' || handoffStep >= handoffs.length) return
    const sequence: AgentId[] = ['archaeologist', 'dependency', 'architect', 'planner', 'integration', 'test']
    const timer = window.setTimeout(() => {
      setHandoffStep((value) => value + 1)
      setAgent(sequence[Math.min(handoffStep, sequence.length - 1)])
    }, 650)
    return () => clearTimeout(timer)
  }, [scene, handoffStep])

  useEffect(() => {
    if (!autoDemo || scene !== 'brief') return
    const carousel = window.setInterval(() => setApplicationIndex((value) => (value + 1) % applicationTypes.length), 1200)
    const launch = window.setTimeout(() => {
      setScene('framework')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 7600)
    return () => { clearInterval(carousel); clearTimeout(launch) }
  }, [autoDemo, scene])

  useEffect(() => {
    if (!autoDemo || scene !== 'framework') return
    const timer = window.setTimeout(() => {
      setScene('packs')
      setPackIndex(0)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 8400)
    return () => clearTimeout(timer)
  }, [autoDemo, scene])

  useEffect(() => {
    if (!autoDemo || scene !== 'packs') return
    const carousel = window.setInterval(() => setPackIndex((value) => (value + 1) % packCatalog.length), 1050)
    const launch = window.setTimeout(() => {
      setScene('xray')
      setScan(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 12600)
    return () => { clearInterval(carousel); clearTimeout(launch) }
  }, [autoDemo, scene])

  useEffect(() => {
    if (!autoDemo || scene !== 'demos') return
    const carousel = window.setInterval(() => setDemoMission((value) => (value + 1) % eshopMissions.length), 2600)
    const launch = window.setTimeout(() => {
      setScene('xray')
      setScan(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 9000)
    return () => { clearInterval(carousel); clearTimeout(launch) }
  }, [autoDemo, scene])

  useEffect(() => {
    if (!autoDemo || scene !== 'xray' || scan < 100) return
    const timer = window.setTimeout(() => {
      setScene('fleet')
      setHandoffStep(0)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 3200)
    return () => clearTimeout(timer)
  }, [autoDemo, scene, scan])

  useEffect(() => {
    if (!autoDemo || scene !== 'fleet') return
    if (handoffStep < handoffs.length) return
    const timer = window.setTimeout(() => {
      setScene('plan')
      setAutoDemo(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 2600)
    return () => clearTimeout(timer)
  }, [autoDemo, scene, handoffStep])

  const go = (next: Scene) => {
    setScene(next)
    setMenuOpen(false)
    if (scenes.findIndex((item) => item.id === next) >= scenes.findIndex((item) => item.id === 'plan')) setAutoDemo(false)
    if (next === 'xray' && scan === 0) setScan(1)
    if (next === 'fleet') setHandoffStep(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openDemos = () => {
    setAutoDemo(false)
    setDemoPhase('before')
    go('demos')
  }

  const programmeIndex = programmeScenes.findIndex((item) => item.id === scene)
  const next = () => programmeIndex < programmeScenes.length - 1 && go(programmeScenes[programmeIndex + 1].id)
  const previous = () => programmeIndex > 0 && go(programmeScenes[programmeIndex - 1].id)
  const autoplayAvailable = sceneIndex < scenes.findIndex((item) => item.id === 'plan')
  const activeStatus = scene === 'possibility' ? 'GITHUB COPILOT · ENGINEERING POSSIBILITY' : scene === 'brief' ? applicationTypes[applicationIndex].name.toUpperCase() : scene === 'framework' ? 'TWO-LAYER GOVERNED OPERATING MODEL' : scene === 'packs' ? packCatalog[packIndex].name.toUpperCase() : scene === 'demos' ? `${demoJourneys[selectedDemo].name.toUpperCase()} · ${demoPhase.toUpperCase()}` : 'CONTOSO UNIVERSITY · .NET FRAMEWORK 4.8'

  return <div className="mc-shell">
    <header className="mc-topbar">
      <button className="mc-brand" onClick={() => go('possibility')} aria-label="Return to experience start">
        <span className="brand-mark"><Radar /></span>
        <span><b>COPILOTWITH</b><small>MODERNISATION MISSION CONTROL</small></span>
      </button>
      <nav className="mc-nav" aria-label="Mission journey">
        {programmeScenes.map((item, index) => <button key={item.id} className={scene === item.id ? 'active' : ''} onClick={() => go(item.id)}><span>{String(index + 1).padStart(2, '0')}</span>{item.verb}</button>)}
      </nav>
      <button className={`demos-button ${scene === 'demos' ? 'active' : ''}`} onClick={openDemos}><Play /> DEMOS</button>
      <button className="evidence-button" onClick={() => setEvidenceOpen(true)}><ShieldCheck /> SHOW ME THE EVIDENCE</button>
      <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Open mission navigation" aria-expanded={menuOpen}><Menu /></button>
      {menuOpen && <nav className="mobile-nav"><button onClick={() => go('possibility')}>GHCP · Art of Possibility</button><button onClick={openDemos}>DEMOS · Demo Studio</button>{programmeScenes.map((item, index) => <button key={item.id} onClick={() => go(item.id)}>{String(index + 1).padStart(2, '0')} · {item.label}</button>)}</nav>}
    </header>

    <div className="mc-statusbar">
      <span><i /> {autoDemo ? 'AUTONOMOUS DEMO RUNNING' : 'PRESENTER CONTROL'}</span>
      <span className="app-status"><b>{scene === 'packs' ? 'ACTIVE PACK' : 'ACTIVE MISSION'}</b> {activeStatus}</span>
      <button className="autoplay-toggle" disabled={!autoplayAvailable} onClick={() => setAutoDemo((value) => !value)}>{autoDemo ? <Pause /> : <Play />} {autoDemo ? 'PAUSE' : autoplayAvailable ? 'AUTOPLAY' : 'MANUAL ONLY'}</button>
      <div className="persona-switch" aria-label="Choose audience lens"><small>AUDIENCE LENS</small>{(['Executive', 'Architect', 'Developer'] as Persona[]).map((item) => <button type="button" key={item} className={persona === item ? 'active' : ''} aria-pressed={persona === item} onClick={() => setPersona(item)}>{item}</button>)}</div>
    </div>

    <div className="persona-context" role="status" aria-live="polite">
      <header><small>VIEWING THIS SCENE AS</small><b>{persona.toUpperCase()}<span>{personaLenses[persona].label}</span></b></header>
      <div><small>YOUR KEY QUESTION</small><span>{personaLenses[persona].question}</span></div>
      <div><small>WHAT THIS SCENE CONTRIBUTES</small><span>{sceneFocus[scene]}</span></div>
      <div><small>YOUR DECISION / ACTION</small><span>{personaLenses[persona].decision}</span></div>
    </div>

    <main className="mc-main">
      {scene === 'possibility' && <PossibilityScene onProgramme={() => go('brief')} onDemos={openDemos} />}
      {scene === 'brief' && <BriefScene selected={applicationIndex} onSelect={setApplicationIndex} onStart={() => { setAutoDemo(true); go('framework') }} />}
      {scene === 'framework' && <FrameworkScene onNext={next} />}
      {scene === 'packs' && <PackAtlasScene selected={packIndex} onSelect={setPackIndex} onNext={next} />}
      {scene === 'demos' && <DemoStudio selectedDemo={selectedDemo} phase={demoPhase} onDemo={setSelectedDemo} onPhase={setDemoPhase} legacyMission={demoMission} onLegacyMission={setDemoMission} onNext={() => go('brief')} />}
      {scene === 'xray' && <XrayScene scan={scan} focus={focus} onFocus={setFocus} onNext={next} />}
      {scene === 'fleet' && <FleetScene selected={agent} onSelect={setAgent} handoffStep={handoffStep} onReplay={() => setHandoffStep(0)} onNext={next} />}
      {scene === 'plan' && <PlanScene priority={priority} constraint={constraint} approved={approved} onPriority={(value) => { setPriority(value); setApproved(false) }} onConstraint={(value) => { setConstraint(value); setApproved(false) }} onApprove={() => setApproved(true)} onNext={next} />}
      {scene === 'transform' && <TransformScene transformed={transformed} onTransform={() => setTransformed(true)} onNext={next} />}
      {scene === 'validate' && <ValidateScene validated={validated} onValidate={() => setValidated(true)} onNext={next} />}
      {scene === 'time' && <TimeScene value={modernity} onChange={setModernity} onNext={next} />}
      {scene === 'scale' && <ScaleScene waves={waves} persona={persona} adoptionLevel={adoptionLevel} onAdoptionLevel={setAdoptionLevel} onGenerate={() => setWaves(true)} onRestart={() => go('possibility')} />}
    </main>

    {programmeIndex > 0 && <footer className="mission-footer">
      <button onClick={previous}><ChevronLeft /> PREVIOUS</button>
      <div><span>{programmeScenes[programmeIndex].verb}</span><strong>{programmeScenes[programmeIndex].label}</strong><i style={{ width: `${((programmeIndex + 1) / programmeScenes.length) * 100}%` }} /></div>
      <button onClick={next} disabled={programmeIndex === programmeScenes.length - 1} aria-label={programmeIndex === programmeScenes.length - 1 ? 'Final mission scene' : 'Next mission scene'}>NEXT <ChevronRight /></button>
    </footer>}

    {evidenceOpen && <EvidenceDrawer onClose={() => setEvidenceOpen(false)} transformed={transformed} validated={validated} />}
  </div>
}

function PossibilityScene({ onProgramme, onDemos }: { onProgramme: () => void; onDemos: () => void }) {
  const capabilities = [
    ['UNDERSTAND', 'Explain unfamiliar systems and trace dependencies', Search],
    ['PLAN', 'Turn intent and evidence into reviewable work', Radar],
    ['CODE', 'Implement bounded changes in the developer flow', Code2],
    ['TEST', 'Create safety nets and validate behaviour', TestTube2],
    ['SECURE', 'Surface vulnerable dependencies and risky patterns', ShieldCheck],
    ['DELIVER', 'Prepare infrastructure and deployment assets', Rocket],
    ['OPERATE', 'Investigate runtime signals and incidents', Activity],
  ] as const
  return <section className="possibility-scene scene-enter">
    <div className="possibility-copy">
      <span className="kicker"><i /> GITHUB COPILOT · THE ART OF POSSIBILITY</span>
      <h1>From a question<br />to working software.</h1>
      <p>GitHub Copilot brings reasoning, code understanding and engineering action into the tools where teams already work. It can help across the lifecycle, with people retaining direction, judgment and accountability.</p>
      <div className="possibility-actions"><button className="hero-action" onClick={onProgramme}><Radar /> INTRODUCE COPILOTWITH <ArrowRight /></button><button className="secondary-action" onClick={onDemos}><Play /> EXPLORE DEMOS</button></div>
    </div>
    <div className="capability-theatre" aria-label="GitHub Copilot engineering capabilities">
      <div className="copilot-core"><Sparkles /><small>GITHUB COPILOT</small><strong>ENGINEERING<br />INTELLIGENCE</strong><span>HUMAN DIRECTED</span></div>
      {capabilities.map(([verb, detail, Icon], index) => <article key={verb} className={`capability-node capability-${index}`}><Icon /><span><b>{verb}</b><small>{detail}</small></span></article>)}
    </div>
    <div className="possibility-bridge"><div><Bot /><span><small>THE POSSIBILITY</small>Copilot accelerates an engineer</span></div><ArrowRight /><div><Radar /><span><small>THE PROGRAMME</small>CopilotWith coordinates governed modernisation</span></div><ArrowRight /><div><UserCheck /><span><small>THE ACCOUNTABILITY</small>People approve direction, risk and outcomes</span></div></div>
  </section>
}

function DemoStudio({ selectedDemo, phase, onDemo, onPhase, legacyMission, onLegacyMission, onNext }: {
  selectedDemo: DemoId; phase: DemoPhase; onDemo: (value: DemoId) => void; onPhase: (value: DemoPhase) => void;
  legacyMission: number; onLegacyMission: (value: number) => void; onNext: () => void
}) {
  const journey = demoJourneys[selectedDemo]
  const active = journey.phases[phase]
  const JourneyIcon = journey.icon
  const phases: DemoPhase[] = ['before', 'plan', 'after']
  return <section className="demo-studio scene-enter">
    <header className="studio-heading"><div><span>DEMO STUDIO · SOURCE-GROUNDED JOURNEYS</span><h1>Three applications. Three honest modernisation stories.</h1><p>Select a demo, then move through its current state, governed plan and evidenced target. Each journey preserves the boundaries of its source material.</p></div><b><ShieldCheck /> FACTS AND PROPOSALS STAY SEPARATE</b></header>
    <nav className="demo-selector" aria-label="Application demos">
      {(Object.keys(demoJourneys) as DemoId[]).map((id, index) => { const item = demoJourneys[id]; const Icon = item.icon; return <button key={id} className={selectedDemo === id ? 'active' : ''} onClick={() => { onDemo(id); onPhase('before') }}><span>0{index + 1}</span><Icon /><small>{item.eyebrow}</small><strong>{item.name}</strong><em>{item.source}</em></button> })}
    </nav>
    <div className="journey-board">
      <aside className="journey-identity"><span><JourneyIcon /></span><small>{journey.eyebrow}</small><h2>{journey.name}</h2><p>{journey.truth}</p><dl><dt>SOURCE</dt><dd>{journey.source}</dd><dt>REPLAY BOUNDARY</dt><dd>Deterministic UI based on documented source facts</dd></dl></aside>
      <div className="phase-console">
        <nav className="phase-switch" aria-label="Demo journey phase">{phases.map((item, index) => <button key={item} className={phase === item ? 'active' : ''} onClick={() => onPhase(item)}><span>0{index + 1}</span>{item === 'plan' ? 'MODERNISATION PLAN' : item.toUpperCase()}</button>)}</nav>
        <article className={`phase-panel phase-${phase}`}><header><span>{phase === 'before' ? 'OBSERVED CURRENT STATE' : phase === 'plan' ? 'PROPOSED AND HUMAN-GATED' : 'TARGET OUTCOME'}</span><b>{active.outcome}</b></header><JourneyIcon /><h2>{active.title}</h2><p>{active.summary}</p><div>{active.facts.map((fact, index) => <span key={fact}><b>0{index + 1}</b><Check />{fact}</span>)}</div><footer><UserCheck /><span><small>ACCOUNTABILITY CHECK</small>{phase === 'before' ? 'Validate findings with maintainers and runtime evidence.' : phase === 'plan' ? 'Approve scope, architecture, sequencing and accepted risk.' : 'Accept only after tests and deployment evidence pass.'}</span></footer></article>
      </div>
    </div>
    {selectedDemo === 'eshop' && <div className="deep-replay"><header><span>DEEP SOURCE REPLAY</span><b>The existing eShopOnWeb mission remains available as an additional reference implementation.</b></header><DemoLabScene selected={legacyMission} onSelect={onLegacyMission} onNext={onNext} /></div>}
    {selectedDemo !== 'eshop' && <div className="studio-next"><span><b>NEXT STORY STEP</b>{phase === 'before' ? 'Inspect the dependency-ordered modernisation plan.' : phase === 'plan' ? 'Review the evidenced target outcome.' : 'Continue into the full CopilotWith programme.'}</span><button className="main-action" onClick={() => phase === 'before' ? onPhase('plan') : phase === 'plan' ? onPhase('after') : onNext()}>{phase === 'after' ? 'ENTER MISSION CONTROL' : 'CONTINUE JOURNEY'} <ArrowRight /></button></div>}
  </section>
}

function BriefScene({ selected, onSelect, onStart }: { selected: number; onSelect: (value: number) => void; onStart: () => void }) {
  const active = applicationTypes[selected]
  const ActiveIcon = active.icon
  return <section className="brief-scene scene-enter">
    <div className="brief-grid">
      <div className="brief-copy">
        <span className="kicker"><i /> GHCP APP MODERNISATION · GUIDED EXPERIENCE</span>
        <h1>One mission control. Every kind of legacy.</h1>
        <p>Choose an application estate. Watch GitHub Copilot inspect the real engineering surface while CopilotWith activates the specialist agents, evidence chain and human gates needed for that technology.</p>
        <button className="hero-action" onClick={onStart}><Play fill="currentColor" /> START A MODERNISATION MISSION <ArrowRight /></button>
        <div className="journey-line"><span>DISCOVER</span><i /><span>DESIGN</span><i /><span>SECURE</span><i /><span>MODERNISE</span><i /><span>VALIDATE</span><i /><span>DEPLOY</span></div>
      </div>
      <div className="application-stage" aria-label="Selected application">
        <div className="stage-rings"><span /><span /><span /></div>
        <div className="application-orb">
          <span className="orb-status">MODERNISATION READY</span>
          <ActiveIcon />
          <small>{active.pack} PACK</small>
          <h2>{active.name}</h2>
          <p>{active.example}</p>
          <div><b>LIVE</b><span>agent route</span><b>127</b><span>agent definitions</span><b>12+</b><span>specialist packs</span></div>
        </div>
        <div className="satellite s1">MSMQ</div><div className="satellite s2">SQL</div><div className="satellite s3">IIS</div><div className="satellite s4">FILES</div>
      </div>
    </div>
    <div className="application-launch-bay"><header><span>WHAT CAN COPILOTWITH MODERNISE?</span><b>AUTOMATICALLY ROUTING TO THE RIGHT AGENT PACK</b></header><div>{applicationTypes.map((item, index) => { const Icon = item.icon; return <button key={item.name} className={selected === index ? 'active' : ''} onClick={() => onSelect(index)}><Icon /><span><strong>{item.name}</strong><small>{item.example}</small></span><em>{item.pack}</em></button> })}</div></div>
    <div className="promise-strip"><div><Bot /><span><small>GITHUB COPILOT</small>Analysis · planning · transformation · testing</span></div><ArrowRight /><div><Radar /><span><small>COPILOTWITH</small>Specialists · governance · evidence · programme scale</span></div><ArrowRight /><div><Cloud /><span><small>AZURE</small>Target architecture · deployment · operations</span></div></div>
  </section>
}

function FrameworkScene({ onNext }: { onNext: () => void }) {
  const evidence = [
    ['OBSERVED', 'Source, metadata, runtime'],
    ['INFERRED', 'Reasoned from evidence'],
    ['ASSUMED', 'Explicitly unverified'],
    ['SME-CONFIRMED', 'Validated by a person'],
  ]
  return <SceneFrame number="01" eyebrow="THE COPILOTWITH OPERATING MODEL" title="One governed loop. Two equally important layers." summary="First understand the estate without inventing certainty. Then modernise approved candidates through bounded, reviewable change." ghcp="Provides the reasoning and engineering engine that agents use to analyse, plan, change and test." copilotwith="Provides the specialist roles, evidence model, handoffs, controls and human accountability around that engine.">
    <div className="framework-theatre">
      <div className="framework-layer intelligence-layer">
        <header><span>01 · ESTATE INTELLIGENCE</span><b>READ-ONLY</b></header>
        <Search /><h2>Know what exists</h2><p>Discover systems, dependencies, business capabilities, risk, duplication and missing evidence across the estate.</p>
        <div className="framework-flow"><span>DISCOVER</span><ArrowRight /><span>CLASSIFY</span><ArrowRight /><span>CONNECT</span><ArrowRight /><span>PRIORITISE</span></div>
        <small>OUTPUT · EVIDENCE-BASED CANDIDATE PORTFOLIO</small>
      </div>
      <div className="evidence-reactor">
        <Radar /><span className="reactor-pulse" />
        <small>GOVERNANCE CORE</small><strong>EVIDENCE, NOT GUESSWORK</strong>
        <div>{evidence.map(([state, detail], index) => <span key={state} style={{ animationDelay: `${index * 0.45}s` }}><b>{state}</b><small>{detail}</small></span>)}</div>
        <em><UserCheck /> SME VALIDATION GATE</em>
      </div>
      <div className="framework-layer execution-layer">
        <header><span>02 · GOVERNED EXECUTION</span><b>APPROVED WORKSPACE</b></header>
        <GitPullRequest /><h2>Change what matters</h2><p>Protect behaviour, choose a strategy, implement small slices and prove each outcome before progression.</p>
        <div className="framework-flow"><span>CONTRACT</span><ArrowRight /><span>DESIGN</span><ArrowRight /><span>BUILD</span><ArrowRight /><span>PROVE</span></div>
        <small>OUTPUT · REVIEWABLE PULL REQUESTS + DECISION EVIDENCE</small>
      </div>
    </div>
    <div className="accountability-rail">
      <div><Users /><span><small>HUMANS OWN</small>Priorities · target direction · architecture · risk · gates · acceptance</span></div>
      <div><Bot /><span><small>AGENTS CREATE</small>Evidence · options · recommendations · tests · bounded code changes</span></div>
      <div className="no-autonomy"><LockKeyhole /><span><small>NEVER AUTONOMOUS</small>No merges · no production pushes · no risk acceptance · no invented facts</span></div>
    </div>
    <div className="framework-next"><strong>This is not “AI writes code.”</strong><span>It is an accountable engineering system.</span><button className="main-action" onClick={onNext}>OPEN THE SPECIALIST PACK ATLAS <ArrowRight /></button></div>
  </SceneFrame>
}

function PackAtlasScene({ selected, onSelect, onNext }: { selected: number; onSelect: (value: number) => void; onNext: () => void }) {
  const pack = packCatalog[selected]
  const PackIcon = pack.icon
  return <SceneFrame number="02" eyebrow="THE SPECIALIST PACK ATLAS" title="The evidence chooses the route. Not a generic prompt." summary="Select any estate type to inspect its agent team, method, evidence inputs, outputs, maturity and non-negotiable boundary." ghcp="Executes the selected pack's specialist analysis and engineering tasks against supplied evidence." copilotwith="Routes the estate to a domain method whose maturity, outputs and limits remain explicit.">
    <div className="pack-atlas">
      <nav className="pack-radar" aria-label="Specialist packs">
        <div className="radar-orbits"><i /><i /><i /><Radar /></div>
        {packCatalog.map((item, index) => { const Icon = item.icon; return <button key={item.id} className={`${selected === index ? 'selected' : ''} pack-node pn${index}`} onClick={() => onSelect(index)} aria-pressed={selected === index}><span>{item.code}</span><Icon /><b>{item.name}</b><small>{item.category}</small></button> })}
      </nav>
      <article className="pack-dossier" aria-live="polite">
        <header><div className="pack-code"><PackIcon /><span>{pack.code}</span></div><div><small>{pack.category}</small><h2>{pack.name}</h2><p>{pack.scenario}</p></div><b className={`maturity-badge ${pack.maturity.startsWith('PROVEN') ? 'proven' : pack.maturity.startsWith('DEMONSTRATED') || pack.maturity.startsWith('BLIND') ? 'demonstrated' : ''}`}>{pack.maturity}</b></header>
        <div className="pack-capacity"><span><Bot /><b>{pack.agents}</b><small>SPECIALISTS</small></span><span><Zap /><b>{pack.skills}</b><small>METHOD POWER</small></span></div>
        <div className="pack-layers"><div><span>01 · ESTATE INTELLIGENCE</span><p>{pack.layer1}</p></div><ArrowRight /><div><span>02 · GOVERNED EXECUTION</span><p>{pack.layer2}</p></div></div>
        <div className="pack-method">{pack.sequence.map((step, index) => <span key={step}><b>{String(index + 1).padStart(2, '0')}</b>{step}</span>)}</div>
        <dl><div><dt>EVIDENCE INPUTS</dt><dd>{pack.sources}</dd></div><div><dt>DELIVERY OUTPUTS</dt><dd>{pack.outputs}</dd></div></dl>
        <footer><ShieldCheck /><span><small>NON-NEGOTIABLE GUARDRAIL</small>{pack.guardrail}</span></footer>
        <button className="main-action pack-next" onClick={onNext}>ROUTE A .NET APPLICATION INTO THE MISSION <ArrowRight /></button>
      </article>
    </div>
    <div className="maturity-legend"><span><i className="proven" /><b>PROVEN IN ENGAGEMENT</b> Used in delivery</span><span><i className="demonstrated" /><b>DEMONSTRATED / CALIBRATED</b> Worked and sanity-tested</span><span><i /><b>DESIGNED CAPABILITY</b> Method defined; validate in context</span></div>
  </SceneFrame>
}

function DemoLabScene({ selected, onSelect, onNext }: { selected: number; onSelect: (value: number) => void; onNext: () => void }) {
  const mission = eshopMissions[selected]
  const MissionIcon = mission.icon
  const architecture = [
    ['WEB', 'MVC + Razor', Code2], ['ADMIN', 'Blazor WASM', Layers3], ['API', 'PublicApi', Network],
    ['CORE', 'Domain model', Braces], ['INFRA', 'EF Core + Identity', Database], ['SQL', 'Catalog + Identity', Server],
  ]
  return <SceneFrame number="03" eyebrow="APP MODERNISATION DEMO LAB" title="Watch CopilotWith work on a real application." summary="eShopOnWeb is the stage: a source-grounded .NET 8 reference application with six source projects, four test projects, two container entry points, and Azure deployment assets." ghcp="Reads the solution, explains code, traces dependencies, proposes tests and prepares bounded engineering changes." copilotwith="Sequences specialist missions, labels evidence, exposes outputs and keeps architecture and deployment decisions human-owned.">
    <div className="demo-lab">
      <header className="demo-commandbar"><div><span className="live-dot" /><small>SOURCE-GROUNDED REPLAY</small><strong>Microsoft eShopOnWeb</strong><em>ASP.NET Core 8 · MONOLITHIC REFERENCE APPLICATION</em></div><div className="demo-facts"><span><b>6</b>SOURCE PROJECTS</span><span><b>4</b>TEST PROJECTS</span><span><b>2</b>APP CONTAINERS</span><span><b>1</b>GOVERNED MISSION</span></div></header>
      <nav className="demo-missions" aria-label="eShopOnWeb demo missions">{eshopMissions.map((item, index) => { const Icon = item.icon; return <button key={item.id} className={selected === index ? 'active' : ''} onClick={() => onSelect(index)} aria-pressed={selected === index}><span>0{index + 1}</span><Icon /><small>{item.verb}</small><strong>{item.title}</strong><i /></button> })}</nav>
      <div className="demo-stage">
        <div className="eshop-viewport">
          <header><span><i /><i /><i /></span><b>ESHOPONWEB · APPLICATION VIEW</b><em>OBSERVED</em></header>
          <div className="eshop-screen"><img src={`${import.meta.env.BASE_URL}eshoponweb-storefront.png`} alt="eShopOnWeb catalogue storefront" /><span className="source-scan" /><div className="screen-callout"><Activity /><span><small>ACTIVE MISSION</small><strong>{mission.title}</strong></span></div></div>
          <div className="repo-topology">{architecture.map(([name, detail, Icon], index) => { const TypedIcon = Icon as typeof Code2; return <div key={String(name)} className={selected === 0 || index >= selected * 2 ? 'lit' : ''}><TypedIcon /><span><b>{name as string}</b><small>{detail as string}</small></span></div> })}<svg viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M8 8 L42 21 L58 21 L92 8 M25 8 L42 21 M75 8 L58 21" /></svg></div>
        </div>
        <aside className="agent-runner" aria-live="polite">
          <header><span><MissionIcon /></span><div><small>AGENT IN ACTION</small><h2>{mission.agent}</h2><p>{mission.status}</p></div><i /></header>
          <div className="demo-prompt"><MessageSquareText /><span><small>PRESENTER PROMPT</small>{mission.prompt}</span></div>
          <div className="evidence-inputs"><span>REPLAYING SOURCE-GROUNDED EVIDENCE</span>{mission.evidence.map((item, index) => <div key={item} style={{ animationDelay: `${index * .18}s` }}><FileText /><b>{item}</b><Check /></div>)}</div>
          <div className="agent-terminal"><header><span>AGENT EXECUTION REPLAY</span><b>SIMULATED</b></header>{mission.events.map((event, index) => <p key={event} style={{ animationDelay: `${index * .24}s` }}><time>00:0{index + 1}</time><Check /><span>{event}</span></p>)}</div>
          <div className="demo-output"><GitPullRequest /><span><small>REVIEWABLE OUTPUT</small><strong>{mission.output}</strong><em>Human review required before any change</em></span></div>
        </aside>
      </div>
      <div className="demo-path"><span><b>REPOSITORY</b> eShopOnWeb.sln</span><ArrowRight /><span><b>SPECIALIST AGENT</b> {mission.agent}</span><ArrowRight /><span><b>EVIDENCE</b> {mission.output}</span><ArrowRight /><span className="human-stop"><b>HUMAN GATE</b> Decide what changes</span><button className="main-action" onClick={onNext}>RUN A LEGACY X-RAY <ArrowRight /></button></div>
    </div>
  </SceneFrame>
}

function XrayScene({ scan, focus, onFocus, onNext }: { scan: number; focus: string; onFocus: (value: string) => void; onNext: () => void }) {
  const selected = blockers.find((item) => item.id === focus) ?? blockers[1]
  const SelectedIcon = selected.icon
  return <SceneFrame number="04" eyebrow="UNDERSTAND AN UNFAMILIAR APPLICATION" title="Copilot turns source code into an application X-Ray." summary="The graph is the explanation. Ask a question and the application shows you the answer." ghcp="Assesses the codebase, identifies upgrade blockers and traces affected code." copilotwith="Assigns evidence to specialists and keeps findings separate from decisions.">
    <div className="xray-workspace">
      <div className="xray-canvas">
        <div className="scan-head"><span><Activity /> ANALYSING CONTOSO UNIVERSITY</span><div><i style={{ width: `${scan}%` }} /></div><b>{scan}%</b></div>
        <div className="topology">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">{blockers.map((item) => <line key={item.id} x1="50" y1="50" x2={item.x} y2={item.y} />)}</svg>
          <div className="topology-centre"><Code2 /><small>APPLICATION</small><strong>Contoso University</strong><span>ASP.NET · .NET Framework</span></div>
          {blockers.map((item, index) => { const Icon = item.icon; const highlighted = focus === 'all' || focus === item.id || (focus === 'containers' && ['runtime', 'queue', 'files', 'hosting'].includes(item.id)); return <button key={item.id} disabled={scan < 24 + index * 16} aria-pressed={focus === item.id} className={`blocker-node ${highlighted ? 'highlighted' : 'dimmed'}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => onFocus(item.id)}><Icon /><span><strong>{item.label}</strong><small>{item.detail}</small></span><b>{item.risk}</b></button> })}
          <span className="scan-beam" style={{ left: `${scan}%` }} />
        </div>
        <div className="copilot-prompt"><MessageSquareText /><div><small>ASK COPILOTWITH ABOUT THIS APPLICATION</small><strong>{focus === 'containers' ? 'Four components prevent a direct move to containers.' : `Explain ${selected.label} and show the affected modernisation path.`}</strong></div><button onClick={() => onFocus('containers')}>What prevents containerisation?</button><button onClick={() => onFocus('queue')}>Show messaging blockers</button></div>
      </div>
      <aside className="finding-panel" aria-live="polite" aria-label="Selected blocker details">
        <div className="analysis-stream"><header><Activity /><span><small>LIVE COPILOT ANALYSIS</small>EVIDENCE STREAM</span></header>{xrayEvents.map(([time, message, type], index) => <div key={message} className={scan >= 12 + index * 15 ? 'visible' : ''}><time>{time}</time><span>{message}</span><b>{type}</b></div>)}</div>
        <span className="danger-label"><CircleAlert /> MODERNISATION BLOCKER</span>
        <SelectedIcon />
        <small>CURRENT DEPENDENCY</small><h2>{selected.label}</h2>
        <p>{selected.detail}. This dependency ties the application to its current Windows-hosted operating model.</p>
        <dl><div><dt>Cloud readiness</dt><dd>LOW</dd></div><div><dt>Recommended pattern</dt><dd>{selected.target}</dd></div><div><dt>Affected code</dt><dd>{selected.id === 'queue' ? '17 references · 4 projects' : selected.detail}</dd></div><div><dt>Assigned agent</dt><dd>{selected.id === 'queue' ? 'Integration Moderniser' : 'Cloud Architect'}</dd></div></dl>
        <button className="main-action" onClick={onNext}>MEET THE AGENT TEAM <ArrowRight /></button>
      </aside>
    </div>
  </SceneFrame>
}

function FleetScene({ selected, onSelect, handoffStep, onReplay, onNext }: { selected: AgentId; onSelect: (value: AgentId) => void; handoffStep: number; onReplay: () => void; onNext: () => void }) {
  const current = agents[selected]
  const CurrentIcon = current.icon
  return <SceneFrame number="05" eyebrow="MEET YOUR DIGITAL ENGINEERING TEAM" title="Specialist agents take ownership, then hand work forward." summary="This is not one chatbot doing everything. It is an engineering organisation with expertise, tools and boundaries." ghcp="Runs specialised custom agents for recurring analysis and implementation tasks." copilotwith="Orchestrates missions, handoffs, evidence and mandatory human control points.">
    <div className="fleet-workspace">
      <div className="constellation-panel">
        <div className="orchestrator-core"><Radar /><strong>COPILOTWITH</strong><span>ORCHESTRATOR</span><i /></div>
        {(Object.entries(agents) as Array<[AgentId, typeof agents[AgentId]]>).map(([id, item], index) => { const Icon = item.icon; return <button key={id} aria-pressed={selected === id} aria-label={`${item.name}. ${item.role}`} className={`agent-node n${index} ${selected === id ? 'selected' : ''}`} onClick={() => onSelect(id)}><Icon /><span>{item.name}</span><small>{id === 'integration' ? 'ASSIGNED' : index < 4 ? 'ANALYSING' : 'STANDING BY'}</small></button> })}
      </div>
      <aside className="agent-panel" aria-live="polite" aria-atomic="true"><span>AGENT IN ACTION</span><CurrentIcon /><h2>{current.name}</h2><p>{current.role}</p><div className="power-grid">{current.powers.map((power) => <b key={power}><Zap />{power}</b>)}</div><dl><dt>TOOLS AVAILABLE</dt><dd>{current.tools}</dd><dt>WORKING NOW</dt><dd>{current.activity}</dd><dt>PRODUCES</dt><dd>{current.output}</dd><dt>HUMAN BOUNDARY</dt><dd>{current.approval}</dd></dl><button className="main-action" onClick={onNext}>BUILD THE PLAN <ArrowRight /></button></aside>
    </div>
    <div className="handoff-theatre"><header><div><span>LIVE AGENT HANDOFFS</span><strong>The application moves through the team</strong></div><button onClick={onReplay}><RefreshCw /> REPLAY</button></header><div className="handoff-flow">{handoffs.map(([name, message, type], index) => <div key={name} className={index < handoffStep ? 'visible' : ''}><span>{String(index + 1).padStart(2, '0')}</span><small>{name}</small><strong>“{message}”</strong><em>{type}</em>{index < handoffs.length - 1 && <ChevronRight />}</div>)}</div></div>
    <div className="pack-inventory"><header><span>COPILOTWITH AGENT LIBRARY</span><strong>127 DEFINITIONS ACROSS SPECIALIST PACKS</strong></header><div>{packInventory.map(([pack, count]) => <span key={pack}><b>{pack}</b><small>{count}</small></span>)}</div></div>
  </SceneFrame>
}

function PlanScene({ priority, constraint, approved, onPriority, onConstraint, onApprove, onNext }: { priority: string; constraint: string; approved: boolean; onPriority: (value: string) => void; onConstraint: (value: string) => void; onApprove: () => void; onNext: () => void }) {
  const tasks = [
    ['MOD-001', 'Freeze existing behaviour with characterisation tests', 'Test Engineer'],
    ['MOD-007', 'Upgrade shared libraries to modern .NET', 'Runtime Moderniser'],
    ['MOD-014', 'Replace MSMQ boundary with Azure Service Bus', 'Integration Moderniser'],
    ['MOD-019', constraint === 'Database unchanged' ? 'Retain SQL schema behind compatibility layer' : 'Externalise persistence boundary', 'Cloud Architect'],
    ['MOD-024', 'Containerise and create GitHub Actions workflow', 'Deployment Engineer'],
  ]
  return <SceneFrame number="06" eyebrow="HUMAN-DIRECTED MODERNISATION" title="Break the plan. Watch it adapt." summary="Real programmes have constraints. Change one and Copilot recomputes the sequence, effort, risk and assigned agents." ghcp="Produces a customisable plan from assessment findings and iterates through blockers." copilotwith="Applies programme patterns, records assumptions and requires approval before change.">
    <div className="plan-workspace">
      <aside className="plan-config"><label>OPTIMISE FOR</label>{planOptions.map((item) => <button key={item} className={priority === item ? 'selected' : ''} onClick={() => onPriority(item)}><i />{item}</button>)}<label>ADD A REAL-WORLD CONSTRAINT</label><select value={constraint} onChange={(event) => onConstraint(event.target.value)}>{constraints.map((item) => <option key={item}>{item}</option>)}</select><div className="plan-impact"><span>PROJECTED READINESS</span><strong>{priority === 'Lowest risk' ? '91' : priority === 'Fastest migration' ? '84' : '88'}<small>/100</small></strong><p>Demo estimate · not a measured customer outcome</p></div></aside>
      <div className="generated-plan"><header><div><small>GHCP APP MODERNISATION PLAN</small><h2>Lowest-risk path to Azure Container Apps</h2></div><span>REVISION {constraint === 'Database unchanged' ? '04' : '05'}</span></header>{tasks.map(([id, title, owner], index) => <div className="plan-task" key={id}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{id}</small><strong>{title}</strong><em>{owner}</em></div><b>{index < 2 ? 'FOUNDATION' : index < 4 ? 'TRANSFORM' : 'DELIVER'}</b></div>)}<div className="decision-gate"><LockKeyhole /><div><small>DECISION REQUIRED</small><strong>Approve Azure Service Bus and the bounded messaging pilot</strong><p>Agents can recommend and prepare. Architecture, scope and risk remain human decisions.</p></div>{approved ? <span className="approved"><Check /> APPROVED</span> : <button onClick={onApprove}>APPROVE RECOMMENDATION</button>}</div>{approved && <button className="main-action plan-next" onClick={onNext}>MODERNISE THE MESSAGING COMPONENT <ArrowRight /></button>}</div>
    </div>
  </SceneFrame>
}

function TransformScene({ transformed, onTransform, onNext }: { transformed: boolean; onTransform: () => void; onNext: () => void }) {
  return <SceneFrame number="07" eyebrow="BOUNDED CODE TRANSFORMATION" title="Now the application actually changes." summary="The approved task becomes a reviewable code change, updated configuration, tests and deployment assets." ghcp="Implements the recommendation, fixes build issues, creates tests and container assets." copilotwith="Keeps the change bounded, captures provenance and routes the result to independent gates.">
    <div className="transform-workspace">
      <div className="editor-shell"><header><span><FileCode2 /> BEFORE · QueuePublisher.cs</span><span className={transformed ? 'ready' : ''}><Code2 /> AFTER · ServiceBusPublisher.cs</span><b>MOD-014</b></header><div className="code-compare"><pre className="before"><code>{`using System.Messaging;\n\npublic void Publish(Enrollment item)\n{\n    var queue = new MessageQueue(\n        @".\\Private$\\enrollment");\n    queue.Send(item);\n}\n\n// Windows-only MSMQ dependency`}</code></pre><pre className={transformed ? 'after revealed' : 'after'}><code>{transformed ? `public async Task PublishAsync(\n    Enrollment item, CancellationToken ct)\n{\n    var payload = BinaryData.FromObjectAsJson(item);\n    await sender.SendMessageAsync(\n        new ServiceBusMessage(payload), ct);\n}\n\n// Cloud-ready messaging abstraction` : `// Integration Moderniser waiting\n// for an approved architecture decision.\n\n// No code has been changed yet.`}</code></pre></div><footer><span>FILES <b>{transformed ? '14 changed' : '—'}</b></span><span>DIFF <b>{transformed ? '+228 / -163' : '—'}</b></span><span>PACKAGES <b>{transformed ? '3 updated' : '—'}</b></span><span>TESTS <b>{transformed ? '12 added' : '—'}</b></span></footer></div>
      <aside className="run-panel"><span>AGENT EXECUTION</span>{[['Integration Moderniser', 'Refactor messaging boundary', Code2], ['Test Engineer', 'Create compatibility tests', TestTube2], ['Security Guardian', 'Inspect identity and packages', ShieldCheck], ['Deployment Engineer', 'Add container configuration', Box]].map(([name, task, Icon], index) => { const TypedIcon = Icon as typeof Code2; return <div className={transformed ? 'run-step complete' : 'run-step'} key={String(name)}><TypedIcon /><div><strong>{name as string}</strong><small>{transformed ? ['Refactor prepared', '12 tests created', 'Identity control added', 'Container assets ready'][index] : task as string}</small></div>{transformed ? <Check /> : <i />}</div> })}{transformed ? <><div className="terminal-output"><span>$ dotnet build</span><p>Build succeeded. 0 Error(s)</p><span>$ dotnet test</span><p>47 passed in 8.4s</p></div><button className="main-action" onClick={onNext}>PROVE THE CHANGE <ArrowRight /></button></> : <button className="transform-button" onClick={onTransform}><Zap /> MODERNISE THIS COMPONENT</button>}</aside>
    </div>
  </SceneFrame>
}

function ValidateScene({ validated, onValidate, onNext }: { validated: boolean; onValidate: () => void; onNext: () => void }) {
  const checks = [
    ['Build', 'Modern .NET solution', 'PASSED', PackageCheck],
    ['Behaviour', '47 baseline tests', 'PASSED', TestTube2],
    ['Security', 'Secrets, CVEs, identity', '2 RESOLVED', ShieldCheck],
    ['Container', 'Linux image + health probe', 'PASSED', Box],
    ['Pull request', 'Code, ADR and rollback', '#47 READY', GitPullRequest],
  ]
  return <SceneFrame number="08" eyebrow="SECURITY · TEST · REVIEW" title="Proof, not AI theatre." summary="Every claim resolves to evidence. Independent agents check the change before a human decides whether it can progress." ghcp="Runs the build/fix/test loop, security analysis and pull-request preparation." copilotwith="Defines the gates, separates maker from checker and preserves the approval record.">
    <div className="proof-workspace">
      <div className="proof-list">{checks.map(([name, detail, status, Icon], index) => { const TypedIcon = Icon as typeof PackageCheck; return <div key={String(name)} className={validated ? 'passed' : ''}><TypedIcon /><span><small>GATE {String(index + 1).padStart(2, '0')}</small><strong>{name as string}</strong><p>{detail as string}</p></span><b>{validated ? status as string : 'WAITING'}</b>{validated ? <Check /> : <i />}</div> })}</div>
      <div className="security-gate"><header><ShieldCheck /><div><small>GATE 03 · SECURITY REVIEW</small><h2>Two findings required action</h2></div></header><div className="security-items"><span><Check /> Secrets exposure <b>NONE</b></span><span><Check /> Unsupported package <b>UPDATED</b></span><span><Check /> Managed identity <b>CONFIGURED</b></span><span><Check /> Public network access <b>DISABLED</b></span></div>{validated ? <div className="pr-card"><GitPullRequest /><div><small>PR #47 · ILLUSTRATIVE REPLAY</small><strong>Modernise enrollment messaging</strong><p>14 files · 12 tests · ADR · rollback plan</p></div><span>READY FOR HUMAN REVIEW</span></div> : <button className="validate-button" onClick={onValidate}><ShieldCheck /> RUN VALIDATION GATES</button>}</div>
      <aside className={validated ? 'review-panel ready' : 'review-panel'}><UserCheck /><span>TARGETED HUMAN REVIEW</span><h2>{validated ? 'Evidence complete. The decision is yours.' : 'Agents cannot approve their own work.'}</h2><p>Review architecture impact, test evidence, security findings and rollback conditions before progression.</p>{validated && <button className="main-action" onClick={onNext}>APPROVE & SEE THE FUTURE <ArrowRight /></button>}</aside>
    </div>
  </SceneFrame>
}

function TimeScene({ value, onChange, onNext }: { value: number; onChange: (value: number) => void; onNext: () => void }) {
  const transitions = [
    ['Windows Server', 'Azure Container Apps', Server, Cloud],
    ['.NET Framework 4.8', 'Modern .NET', Braces, Braces],
    ['MSMQ', 'Azure Service Bus', Network, Network],
    ['Local file system', 'Azure Blob Storage', FileText, Database],
    ['Manual deployment', 'GitHub Actions', Users, GitBranch],
  ]
  return <SceneFrame number="09" eyebrow="MODERNISATION TIME MACHINE" title="Drag the architecture through the change." summary="At each point the diagram shows a credible transition state, not a fictional big-bang rewrite." ghcp="Produces the code, tests, containers and deployment assets for each bounded slice." copilotwith="Sequences those slices into a reversible journey with evidence at every gate.">
    <div className="time-workspace"><header><span>LEGACY APPLICATION</span><strong>{value}% MODERNISED</strong><span>CLOUD-READY PRODUCT</span></header><input aria-label="Modernisation progress" type="range" min="0" max="100" value={value} onChange={(event) => onChange(Number(event.target.value))} /><div className="transition-grid">{transitions.map(([before, after, BeforeIcon, AfterIcon], index) => { const LeftIcon = BeforeIcon as typeof Server; const RightIcon = AfterIcon as typeof Cloud; const switched = value > 15 + index * 17; return <div key={String(before)} className={switched ? 'switched' : ''}><span><LeftIcon />{before as string}</span><i><ArrowRight /></i><span><RightIcon />{after as string}</span></div> })}</div><div className="architecture-stage"><div className="legacy-stack" style={{ opacity: Math.max(.12, 1 - value / 100) }}><Server /><b>CONTOSO UNIVERSITY</b><span>Coupled Windows application</span></div><div className="transformation-energy"><Sparkles /><strong>{value < 35 ? 'DISCOVERING' : value < 70 ? 'TRANSFORMING' : 'CLOUD-READY'}</strong></div><div className="modern-stack" style={{ opacity: Math.max(.12, value / 100) }}><Cloud /><b>MODERN PRODUCT</b><span>Containerised services on Azure</span></div></div><button className="main-action time-next" onClick={onNext}>THAT IS ONE APP. WHAT ABOUT 300? <ArrowRight /></button></div>
  </SceneFrame>
}

function ScaleScene({ waves, persona, adoptionLevel, onAdoptionLevel, onGenerate, onRestart }: { waves: boolean; persona: Persona; adoptionLevel: number; onAdoptionLevel: (value: number) => void; onGenerate: () => void; onRestart: () => void }) {
  const apps = Array.from({ length: 72 }, (_, index) => ({ id: index, x: 5 + ((index * 37) % 89), y: 7 + ((index * 53) % 80), wave: index < 16 ? 1 : index < 39 ? 2 : index < 59 ? 3 : 4 }))
  return <SceneFrame number="10" eyebrow="FROM ONE APPLICATION TO AN ESTATE" title="This is where Copilot becomes a modernisation programme." summary="The same evidence, patterns, specialists and human gates can organise 5, 50 or 500 applications into executable waves." ghcp="Provides the analysis and engineering capacity across the software lifecycle." copilotwith="Standardises the method, allocates specialists and governs portfolio-scale progression.">
    <div className="scale-workspace"><div className="estate-map"><span className="axis-y">BUSINESS CRITICALITY</span><span className="axis-x">MODERNISATION COMPLEXITY</span>{apps.map((app) => <i key={app.id} className={waves ? `app-dot wave-${app.wave}` : 'app-dot'} style={waves ? { left: `${8 + (app.wave - 1) * 24}%`, top: `${9 + (app.id % 16) * 5.25}%` } : { left: `${app.x}%`, top: `${app.y}%` }} />)}{waves && <div className="wave-headings"><span>WAVE 1<small>QUICK WINS</small></span><span>WAVE 2<small>MODERATE</small></span><span>WAVE 3<small>TRANSFORM</small></span><span>WAVE 4<small>COMPLEX</small></span></div>}</div><aside className="estate-panel"><span>APPLICATION ESTATE · {persona.toUpperCase()} VIEW</span><h2>127 applications</h2><div className="estate-stats"><p><strong>32</strong><span>assessed</span></p><p><strong>11</strong><span>high risk</span></p><p><strong>23</strong><span>Wave 1 candidates</span></p></div>{waves ? <div className="capacity"><small>AI + HUMAN CAPACITY</small><span><Bot /> 8 application agents</span><span><Cloud /> 3 architecture agents</span><span><ShieldCheck /> 2 security agents</span><span><Users /> 5 human reviewers</span></div> : <button className="generate-waves" onClick={onGenerate}><Sparkles /> GENERATE MODERNISATION WAVES</button>}</aside></div>
    {waves && <><div className="adoption-console"><header><div><span>CONTROLLED ADOPTION</span><strong>Start with trust you can earn.</strong></div><b>RECOMMENDED START · LEVEL 02</b></header><div className="adoption-levels">{adoptionLevels.map(([number, title, detail], index) => <button key={number} className={adoptionLevel === index + 1 ? 'active' : ''} onClick={() => onAdoptionLevel(index + 1)}><span>{number}</span><strong>{title}</strong><small>{detail}</small>{index === 1 && <em>START HERE</em>}</button>)}</div><div className="adoption-boundary"><ShieldCheck /><span><small>CONTROL DOES NOT DISAPPEAR AS CAPABILITY GROWS</small>Every level retains evidence labels, human stage gates, pull-request review and accountable acceptance.</span><div><b>PROVEN</b> Middleware factory</div><div><b>DEMONSTRATED</b> App modernisation</div><div><b>DESIGNED</b> Specialist accelerators</div></div></div><div className="final-reveal"><div><span>WHAT JUST HAPPENED?</span><h2>Copilot gives engineers superpowers. CopilotWith industrialises those superpowers across the application estate.</h2></div><div className="operating-model"><span>CUSTOMER <b>Priorities · constraints · approvals</b></span><span>COPILOTWITH <b>Method · governance · orchestration</b></span><span>GITHUB COPILOT <b>Assess · plan · transform · validate</b></span><span>AZURE <b>Target · deploy · operate</b></span></div><button onClick={onRestart}>REPLAY THE MISSION <RefreshCw /></button></div></>}
  </SceneFrame>
}

function SceneFrame({ number, eyebrow, title, summary, ghcp, copilotwith, children }: { number: string; eyebrow: string; title: string; summary: string; ghcp: string; copilotwith: string; children: React.ReactNode }) {
  return <section className="scene-frame scene-enter"><header className="scene-heading"><span className="scene-number">{number}</span><div><small>{eyebrow}</small><h1>{title}</h1><p>{summary}</p></div></header>{children}<div className="explanation-rail"><div><Bot /><span><small>WHAT GITHUB COPILOT DOES</small>{ghcp}</span></div><div><Radar /><span><small>WHAT COPILOTWITH ADDS</small>{copilotwith}</span></div></div></section>
}

function EvidenceDrawer({ onClose, transformed, validated }: { onClose: () => void; transformed: boolean; validated: boolean }) {
  const rows = [
    ['Application assessment', '23 dependencies · 4 blockers', 'AVAILABLE'],
    ['Modernisation plan', '5 sequenced tasks · revision 04', 'AVAILABLE'],
    ['Files changed', transformed ? '14 files · +228 / -163' : 'Not executed', transformed ? 'AVAILABLE' : 'PENDING'],
    ['Build and tests', validated ? 'Build green · 47/47 tests' : 'Awaiting validation', validated ? 'AVAILABLE' : 'PENDING'],
    ['Security review', validated ? '2 findings resolved' : 'Awaiting validation', validated ? 'AVAILABLE' : 'PENDING'],
    ['Pull request', validated ? 'PR #47 · ADR · rollback' : 'Not generated', validated ? 'AVAILABLE' : 'PENDING'],
    ['Deployment', 'Human approval required', 'CONTROLLED'],
  ]
  return <div className="drawer-backdrop" role="presentation" onClick={onClose}><aside className="evidence-drawer" role="dialog" aria-modal="true" aria-label="Mission evidence" onKeyDown={(event) => { if (event.key === 'Escape') onClose() }} onClick={(event) => event.stopPropagation()}><header><div><ShieldCheck /><span><small>MISSION EVIDENCE</small><strong>Every claim has a receipt.</strong></span></div><button autoFocus onClick={onClose} aria-label="Close evidence"><X /></button></header><p>This is an illustrative replay. A connected mission would retain source citations, producing agent, timestamp, confidence and reviewer.</p><div className="evidence-rows">{rows.map(([name, detail, status]) => <div key={name}><FileText /><span><strong>{name}</strong><small>{detail}</small></span><b className={status.toLowerCase()}>{status}</b></div>)}</div><footer><LockKeyhole /><span>Agents produce evidence. People own consequential decisions.</span></footer></aside></div>
}

export default MissionControl
