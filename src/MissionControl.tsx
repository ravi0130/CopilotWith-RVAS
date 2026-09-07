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
type Scene = 'brief' | 'xray' | 'fleet' | 'plan' | 'transform' | 'validate' | 'time' | 'scale'
type AgentId = 'archaeologist' | 'dependency' | 'planner' | 'architect' | 'integration' | 'security' | 'test' | 'deployment'

const scenes: Array<{ id: Scene; label: string; verb: string }> = [
  { id: 'brief', label: 'Mission', verb: 'ENTER' },
  { id: 'xray', label: 'Application X-Ray', verb: 'DISCOVER' },
  { id: 'fleet', label: 'Agent Team', verb: 'ORCHESTRATE' },
  { id: 'plan', label: 'Modernisation Plan', verb: 'DECIDE' },
  { id: 'transform', label: 'Transform', verb: 'MODERNISE' },
  { id: 'validate', label: 'Proof', verb: 'VALIDATE' },
  { id: 'time', label: 'Before / After', verb: 'COMPARE' },
  { id: 'scale', label: 'Portfolio', verb: 'SCALE' },
]

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

function MissionControl() {
  const [scene, setScene] = useState<Scene>('brief')
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
  const [autoDemo, setAutoDemo] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [applicationIndex, setApplicationIndex] = useState(0)

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
      setScene('xray')
      setScan(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 7600)
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
    if (next === 'xray' && scan === 0) setScan(1)
    if (next === 'fleet') setHandoffStep(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const next = () => sceneIndex < scenes.length - 1 && go(scenes[sceneIndex + 1].id)
  const previous = () => sceneIndex > 0 && go(scenes[sceneIndex - 1].id)

  return <div className="mc-shell">
    <header className="mc-topbar">
      <button className="mc-brand" onClick={() => go('brief')} aria-label="Return to mission start">
        <span className="brand-mark"><Radar /></span>
        <span><b>COPILOTWITH</b><small>MODERNISATION MISSION CONTROL</small></span>
      </button>
      <nav className="mc-nav" aria-label="Mission journey">
        {scenes.map((item, index) => <button key={item.id} className={scene === item.id ? 'active' : ''} onClick={() => go(item.id)}><span>{String(index + 1).padStart(2, '0')}</span>{item.verb}</button>)}
      </nav>
      <button className="evidence-button" onClick={() => setEvidenceOpen(true)}><ShieldCheck /> SHOW ME THE EVIDENCE</button>
      <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Open mission navigation" aria-expanded={menuOpen}><Menu /></button>
      {menuOpen && <nav className="mobile-nav">{scenes.map((item, index) => <button key={item.id} onClick={() => go(item.id)}>{String(index + 1).padStart(2, '0')} · {item.label}</button>)}</nav>}
    </header>

    <div className="mc-statusbar">
      <span><i /> {autoDemo ? 'AUTONOMOUS DEMO RUNNING' : 'PRESENTER CONTROL'}</span>
      <span className="app-status"><b>ACTIVE APPLICATION</b> {scene === 'brief' ? applicationTypes[applicationIndex].name.toUpperCase() : 'CONTOSO UNIVERSITY · .NET FRAMEWORK 4.8'}</span>
      <button className="autoplay-toggle" onClick={() => setAutoDemo((value) => !value)}>{autoDemo ? <Pause /> : <Play />} {autoDemo ? 'PAUSE' : 'AUTOPLAY'}</button>
      <div className="persona-switch"><small>VIEW AS</small>{(['Executive', 'Architect', 'Developer'] as Persona[]).map((item) => <button key={item} className={persona === item ? 'active' : ''} onClick={() => setPersona(item)}>{item}</button>)}</div>
    </div>

    <main className="mc-main">
      {scene === 'brief' && <BriefScene selected={applicationIndex} onSelect={setApplicationIndex} onStart={() => { setAutoDemo(true); go('xray') }} />}
      {scene === 'xray' && <XrayScene scan={scan} focus={focus} onFocus={setFocus} onNext={next} />}
      {scene === 'fleet' && <FleetScene selected={agent} onSelect={setAgent} handoffStep={handoffStep} onReplay={() => setHandoffStep(0)} onNext={next} />}
      {scene === 'plan' && <PlanScene priority={priority} constraint={constraint} approved={approved} onPriority={(value) => { setPriority(value); setApproved(false) }} onConstraint={(value) => { setConstraint(value); setApproved(false) }} onApprove={() => setApproved(true)} onNext={next} />}
      {scene === 'transform' && <TransformScene transformed={transformed} onTransform={() => setTransformed(true)} onNext={next} />}
      {scene === 'validate' && <ValidateScene validated={validated} onValidate={() => setValidated(true)} onNext={next} />}
      {scene === 'time' && <TimeScene value={modernity} onChange={setModernity} onNext={next} />}
      {scene === 'scale' && <ScaleScene waves={waves} persona={persona} onGenerate={() => setWaves(true)} onRestart={() => go('brief')} />}
    </main>

    {scene !== 'brief' && <footer className="mission-footer">
      <button onClick={previous}><ChevronLeft /> PREVIOUS</button>
      <div><span>{scenes[sceneIndex].verb}</span><strong>{scenes[sceneIndex].label}</strong><i style={{ width: `${((sceneIndex + 1) / scenes.length) * 100}%` }} /></div>
      <button onClick={next} disabled={sceneIndex === scenes.length - 1} aria-label={sceneIndex === scenes.length - 1 ? 'Final mission scene' : 'Next mission scene'}>NEXT <ChevronRight /></button>
    </footer>}

    {evidenceOpen && <EvidenceDrawer onClose={() => setEvidenceOpen(false)} transformed={transformed} validated={validated} />}
  </div>
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

function XrayScene({ scan, focus, onFocus, onNext }: { scan: number; focus: string; onFocus: (value: string) => void; onNext: () => void }) {
  const selected = blockers.find((item) => item.id === focus) ?? blockers[1]
  const SelectedIcon = selected.icon
  return <SceneFrame number="01" eyebrow="UNDERSTAND AN UNFAMILIAR APPLICATION" title="Copilot turns source code into an application X-Ray." summary="The graph is the explanation. Ask a question and the application shows you the answer." ghcp="Assesses the codebase, identifies upgrade blockers and traces affected code." copilotwith="Assigns evidence to specialists and keeps findings separate from decisions.">
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
  return <SceneFrame number="02" eyebrow="MEET YOUR DIGITAL ENGINEERING TEAM" title="Specialist agents take ownership, then hand work forward." summary="This is not one chatbot doing everything. It is an engineering organisation with expertise, tools and boundaries." ghcp="Runs specialised custom agents for recurring analysis and implementation tasks." copilotwith="Orchestrates missions, handoffs, evidence and mandatory human control points.">
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
  return <SceneFrame number="03" eyebrow="HUMAN-DIRECTED MODERNISATION" title="Break the plan. Watch it adapt." summary="Real programmes have constraints. Change one and Copilot recomputes the sequence, effort, risk and assigned agents." ghcp="Produces a customisable plan from assessment findings and iterates through blockers." copilotwith="Applies programme patterns, records assumptions and requires approval before change.">
    <div className="plan-workspace">
      <aside className="plan-config"><label>OPTIMISE FOR</label>{planOptions.map((item) => <button key={item} className={priority === item ? 'selected' : ''} onClick={() => onPriority(item)}><i />{item}</button>)}<label>ADD A REAL-WORLD CONSTRAINT</label><select value={constraint} onChange={(event) => onConstraint(event.target.value)}>{constraints.map((item) => <option key={item}>{item}</option>)}</select><div className="plan-impact"><span>PROJECTED READINESS</span><strong>{priority === 'Lowest risk' ? '91' : priority === 'Fastest migration' ? '84' : '88'}<small>/100</small></strong><p>Demo estimate · not a measured customer outcome</p></div></aside>
      <div className="generated-plan"><header><div><small>GHCP APP MODERNISATION PLAN</small><h2>Lowest-risk path to Azure Container Apps</h2></div><span>REVISION {constraint === 'Database unchanged' ? '04' : '05'}</span></header>{tasks.map(([id, title, owner], index) => <div className="plan-task" key={id}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{id}</small><strong>{title}</strong><em>{owner}</em></div><b>{index < 2 ? 'FOUNDATION' : index < 4 ? 'TRANSFORM' : 'DELIVER'}</b></div>)}<div className="decision-gate"><LockKeyhole /><div><small>DECISION REQUIRED</small><strong>Approve Azure Service Bus and the bounded messaging pilot</strong><p>Agents can recommend and prepare. Architecture, scope and risk remain human decisions.</p></div>{approved ? <span className="approved"><Check /> APPROVED</span> : <button onClick={onApprove}>APPROVE RECOMMENDATION</button>}</div>{approved && <button className="main-action plan-next" onClick={onNext}>MODERNISE THE MESSAGING COMPONENT <ArrowRight /></button>}</div>
    </div>
  </SceneFrame>
}

function TransformScene({ transformed, onTransform, onNext }: { transformed: boolean; onTransform: () => void; onNext: () => void }) {
  return <SceneFrame number="04" eyebrow="BOUNDED CODE TRANSFORMATION" title="Now the application actually changes." summary="The approved task becomes a reviewable code change, updated configuration, tests and deployment assets." ghcp="Implements the recommendation, fixes build issues, creates tests and container assets." copilotwith="Keeps the change bounded, captures provenance and routes the result to independent gates.">
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
  return <SceneFrame number="05" eyebrow="SECURITY · TEST · REVIEW" title="Proof, not AI theatre." summary="Every claim resolves to evidence. Independent agents check the change before a human decides whether it can progress." ghcp="Runs the build/fix/test loop, security analysis and pull-request preparation." copilotwith="Defines the gates, separates maker from checker and preserves the approval record.">
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
  return <SceneFrame number="06" eyebrow="MODERNISATION TIME MACHINE" title="Drag the architecture through the change." summary="At each point the diagram shows a credible transition state, not a fictional big-bang rewrite." ghcp="Produces the code, tests, containers and deployment assets for each bounded slice." copilotwith="Sequences those slices into a reversible journey with evidence at every gate.">
    <div className="time-workspace"><header><span>LEGACY APPLICATION</span><strong>{value}% MODERNISED</strong><span>CLOUD-READY PRODUCT</span></header><input aria-label="Modernisation progress" type="range" min="0" max="100" value={value} onChange={(event) => onChange(Number(event.target.value))} /><div className="transition-grid">{transitions.map(([before, after, BeforeIcon, AfterIcon], index) => { const LeftIcon = BeforeIcon as typeof Server; const RightIcon = AfterIcon as typeof Cloud; const switched = value > 15 + index * 17; return <div key={String(before)} className={switched ? 'switched' : ''}><span><LeftIcon />{before as string}</span><i><ArrowRight /></i><span><RightIcon />{after as string}</span></div> })}</div><div className="architecture-stage"><div className="legacy-stack" style={{ opacity: Math.max(.12, 1 - value / 100) }}><Server /><b>CONTOSO UNIVERSITY</b><span>Coupled Windows application</span></div><div className="transformation-energy"><Sparkles /><strong>{value < 35 ? 'DISCOVERING' : value < 70 ? 'TRANSFORMING' : 'CLOUD-READY'}</strong></div><div className="modern-stack" style={{ opacity: Math.max(.12, value / 100) }}><Cloud /><b>MODERN PRODUCT</b><span>Containerised services on Azure</span></div></div><button className="main-action time-next" onClick={onNext}>THAT IS ONE APP. WHAT ABOUT 300? <ArrowRight /></button></div>
  </SceneFrame>
}

function ScaleScene({ waves, persona, onGenerate, onRestart }: { waves: boolean; persona: Persona; onGenerate: () => void; onRestart: () => void }) {
  const apps = Array.from({ length: 72 }, (_, index) => ({ id: index, x: 5 + ((index * 37) % 89), y: 7 + ((index * 53) % 80), wave: index < 16 ? 1 : index < 39 ? 2 : index < 59 ? 3 : 4 }))
  return <SceneFrame number="07" eyebrow="FROM ONE APPLICATION TO AN ESTATE" title="This is where Copilot becomes a modernisation programme." summary="The same evidence, patterns, specialists and human gates can organise 5, 50 or 500 applications into executable waves." ghcp="Provides the analysis and engineering capacity across the software lifecycle." copilotwith="Standardises the method, allocates specialists and governs portfolio-scale progression.">
    <div className="scale-workspace"><div className="estate-map"><span className="axis-y">BUSINESS CRITICALITY</span><span className="axis-x">MODERNISATION COMPLEXITY</span>{apps.map((app) => <i key={app.id} className={waves ? `app-dot wave-${app.wave}` : 'app-dot'} style={waves ? { left: `${8 + (app.wave - 1) * 24}%`, top: `${9 + (app.id % 16) * 5.25}%` } : { left: `${app.x}%`, top: `${app.y}%` }} />)}{waves && <div className="wave-headings"><span>WAVE 1<small>QUICK WINS</small></span><span>WAVE 2<small>MODERATE</small></span><span>WAVE 3<small>TRANSFORM</small></span><span>WAVE 4<small>COMPLEX</small></span></div>}</div><aside className="estate-panel"><span>APPLICATION ESTATE · {persona.toUpperCase()} VIEW</span><h2>127 applications</h2><div className="estate-stats"><p><strong>32</strong><span>assessed</span></p><p><strong>11</strong><span>high risk</span></p><p><strong>23</strong><span>Wave 1 candidates</span></p></div>{waves ? <div className="capacity"><small>AI + HUMAN CAPACITY</small><span><Bot /> 8 application agents</span><span><Cloud /> 3 architecture agents</span><span><ShieldCheck /> 2 security agents</span><span><Users /> 5 human reviewers</span></div> : <button className="generate-waves" onClick={onGenerate}><Sparkles /> GENERATE MODERNISATION WAVES</button>}</aside></div>
    {waves && <div className="final-reveal"><div><span>WHAT JUST HAPPENED?</span><h2>Copilot gives engineers superpowers. CopilotWith industrialises those superpowers across the application estate.</h2></div><div className="operating-model"><span>CUSTOMER <b>Priorities · constraints · approvals</b></span><span>COPILOTWITH <b>Method · governance · orchestration</b></span><span>GITHUB COPILOT <b>Assess · plan · transform · validate</b></span><span>AZURE <b>Target · deploy · operate</b></span></div><button onClick={onRestart}>REPLAY THE MISSION <RefreshCw /></button></div>}
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
