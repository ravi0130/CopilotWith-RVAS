import { useEffect, useState } from 'react'
import {
  Activity, AppWindow, ArrowRight, Blocks, Bot, Box, Braces, Check,
  ChevronRight, CircleAlert, Cloud, Code2, Database, FileText,
  GitBranch, GitPullRequest, LockKeyhole, Menu, MessageSquareText,
  Network, PackageCheck, Play, Radar, RefreshCw, Rocket, Search, Server,
  ShieldCheck, Sparkles, TestTube2, UserCheck, Users, Zap,
} from 'lucide-react'
import './MissionControl.css'

type Persona = 'Executive' | 'Architect' | 'Engineer'
type Stage = 'mission' | 'xray' | 'agents' | 'plan' | 'transform' | 'prove' | 'future' | 'portfolio'
type BlockerId = 'runtime' | 'wcf' | 'documents' | 'delivery'

const stages: Array<{ id: Stage; short: string; label: string }> = [
  { id: 'mission', short: '01', label: 'Mission' },
  { id: 'xray', short: '02', label: 'X-Ray' },
  { id: 'agents', short: '03', label: 'Agent Fleet' },
  { id: 'plan', short: '04', label: 'Plan' },
  { id: 'transform', short: '05', label: 'Transform' },
  { id: 'prove', short: '06', label: 'Prove' },
  { id: 'future', short: '07', label: 'Time Machine' },
  { id: 'portfolio', short: '08', label: 'Scale' },
]

const blockers = {
  runtime: { name: '.NET Framework 4.8', kind: 'Runtime', risk: 'HIGH', files: '47 projects', replacement: 'Modern .NET', agent: 'Runtime Moderniser', icon: Braces, x: 47, y: 16 },
  wcf: { name: 'WCF Services', kind: 'Integration', risk: 'CRITICAL', files: '4 endpoints', replacement: 'REST + Service Bus', agent: 'Integration Moderniser', icon: Network, x: 22, y: 48 },
  documents: { name: 'Word Interop', kind: 'Platform', risk: 'HIGH', files: '19 service files', replacement: 'Template engine + Blob', agent: 'Cloud Architect', icon: FileText, x: 75, y: 48 },
  delivery: { name: 'TeamCity + Octopus', kind: 'Delivery', risk: 'MEDIUM', files: '2 pipelines', replacement: 'GitHub Actions', agent: 'Deployment Engineer', icon: GitBranch, x: 47, y: 79 },
} satisfies Record<BlockerId, { name: string; kind: string; risk: string; files: string; replacement: string; agent: string; icon: typeof Braces; x: number; y: number }>

const agentFleet = [
  { name: 'Application Archaeologist', role: 'Understands architecture and business logic', icon: Search, status: 'complete', evidence: '380K LOC mapped' },
  { name: 'Dependency Specialist', role: 'Finds compatibility and coupling risks', icon: Blocks, status: 'complete', evidence: '4 blockers escalated' },
  { name: 'Modernisation Strategist', role: 'Builds the sequenced, reversible plan', icon: Radar, status: 'active', evidence: '7 phases proposed' },
  { name: 'Cloud Architect', role: 'Maps legacy patterns to Azure targets', icon: Cloud, status: 'active', evidence: '6 target services' },
  { name: 'Runtime Moderniser', role: 'Upgrades runtime and dependencies', icon: Braces, status: 'queued', evidence: 'Awaiting approval' },
  { name: 'Integration Moderniser', role: 'Replaces WCF, queues, files, and APIs', icon: Network, status: 'queued', evidence: 'WCF slice assigned' },
  { name: 'Security Guardian', role: 'Checks packages, identity, secrets, and exposure', icon: ShieldCheck, status: 'watching', evidence: '2 gates configured' },
  { name: 'Test Engineer', role: 'Preserves behaviour and validates each slice', icon: TestTube2, status: 'watching', evidence: 'Baseline required' },
]

const handoffs = [
  ['Application Archaeologist', 'Found four WCF service boundaries', 'OBSERVED'],
  ['Dependency Specialist', '47 projects share Framework-era dependencies', 'OBSERVED'],
  ['Cloud Architect', 'Recommend REST APIs plus asynchronous Service Bus', 'PROPOSED'],
  ['Modernisation Strategist', 'Pricing extraction becomes the low-risk pilot', 'PROPOSED'],
  ['Human reviewer', 'Architecture choice required before code changes', 'DECISION'],
]

const constraints = ['Lowest risk', 'Fastest migration', 'No database change', 'Zero downtime', 'No public endpoints']

const portfolioApps = Array.from({ length: 34 }, (_, index) => ({
  id: index + 1,
  x: 7 + ((index * 29) % 86),
  y: 9 + ((index * 47) % 78),
  size: 7 + (index % 5) * 2,
  wave: index < 8 ? 1 : index < 22 ? 2 : index < 29 ? 3 : 4,
}))

function MissionControl() {
  const [stage, setStage] = useState<Stage>('mission')
  const [persona, setPersona] = useState<Persona>('Architect')
  const [scan, setScan] = useState(0)
  const [selectedBlocker, setSelectedBlocker] = useState<BlockerId>('wcf')
  const [selectedAgent, setSelectedAgent] = useState(5)
  const [constraint, setConstraint] = useState('Lowest risk')
  const [target, setTarget] = useState('Azure Container Apps')
  const [planApproved, setPlanApproved] = useState(false)
  const [transformRun, setTransformRun] = useState(false)
  const [proofApproved, setProofApproved] = useState(false)
  const [future, setFuture] = useState(54)
  const [wavesGenerated, setWavesGenerated] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (stage !== 'xray' || scan >= 100) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frame = window.requestAnimationFrame(() => setScan(100))
      return () => window.cancelAnimationFrame(frame)
    }
    const timer = window.setInterval(() => setScan((value) => Math.min(100, value + 2)), 28)
    return () => window.clearInterval(timer)
  }, [stage, scan])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [stage])

  const go = (next: Stage) => {
    setStage(next)
    setMenuOpen(false)
    if (next === 'xray' && scan === 0) setScan(1)
  }

  return <div className="mission-shell">
    <header className="command-bar">
      <button className="brand" onClick={() => go('mission')}><span><Radar size={19} /></span><div><strong>COPILOTWITH</strong><small>MODERNISATION CONTROL</small></div></button>
      <nav className="stage-nav" aria-label="Mission stages">
        {stages.map((item) => <button key={item.id} className={stage === item.id ? 'active' : ''} aria-current={stage === item.id ? 'page' : undefined} onClick={() => go(item.id)}><span>{item.short}</span>{item.label}</button>)}
      </nav>
      <div className="mission-meta"><span className="live-dot" /> STORY MODE <small>REPOSITORY-GROUNDED</small></div>
      <button className="mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><Menu /></button>
      {menuOpen && <nav className="mobile-stage-nav">{stages.map((item) => <button key={item.id} onClick={() => go(item.id)}>{item.short} {item.label}</button>)}</nav>}
    </header>

    <div className="persona-bar">
      <span>VIEW AS</span>
      {(['Executive', 'Architect', 'Engineer'] as Persona[]).map((item) => <button key={item} className={persona === item ? 'active' : ''} onClick={() => setPersona(item)}>{item}</button>)}
      <div className="persona-context">{persona === 'Executive' ? 'Risk · waves · readiness' : persona === 'Architect' ? 'Topology · patterns · decisions' : 'Code · tests · pull requests'}</div>
    </div>

    <main className="mission-main">
      {stage === 'mission' && <MissionScreen onStart={() => go('xray')} />}
      {stage === 'xray' && <XrayScreen scan={scan} selected={selectedBlocker} onSelect={setSelectedBlocker} onNext={() => go('agents')} />}
      {stage === 'agents' && <AgentsScreen selected={selectedAgent} onSelect={setSelectedAgent} onNext={() => go('plan')} />}
      {stage === 'plan' && <PlanScreen constraint={constraint} target={target} approved={planApproved} onConstraint={setConstraint} onTarget={setTarget} onApprove={() => setPlanApproved(true)} onNext={() => go('transform')} />}
      {stage === 'transform' && <TransformScreen running={transformRun} onRun={() => setTransformRun(true)} onNext={() => go('prove')} />}
      {stage === 'prove' && <ProofScreen approved={proofApproved} onApprove={() => setProofApproved(true)} onNext={() => go('future')} />}
      {stage === 'future' && <FutureScreen value={future} onChange={setFuture} onNext={() => go('portfolio')} />}
      {stage === 'portfolio' && <PortfolioScreen generated={wavesGenerated} onGenerate={() => setWavesGenerated(true)} onRestart={() => go('mission')} />}
    </main>
  </div>
}

function MissionScreen({ onStart }: { onStart: () => void }) {
  return <section className="mission-launch">
    <div className="launch-copy">
      <span className="eyebrow">COPILOTWITH // MODERNISATION MISSION CONTROL</span>
      <h1>Give us an application.</h1>
      <p>Watch a governed virtual engineering team understand it, challenge it, transform one bounded slice, and prove what changed.</p>
      <div className="mission-sequence"><span>EXPLORE</span><ChevronRight /><span>DIAGNOSE</span><ChevronRight /><span>DECIDE</span><ChevronRight /><span>MODERNISE</span><ChevronRight /><span>PROVE</span></div>
    </div>
    <div className="application-picker" aria-label="Choose an application">
      <button className="app-choice selected" onClick={onStart}>
        <span className="choice-state"><span /> READY FOR ANALYSIS</span>
        <AppWindow />
        <div><small>DETERMINISTIC STORY</small><h2>PolicyHub</h2><p>Contoso Insurance · .NET Framework 4.8</p></div>
        <strong>47 projects</strong><strong>380K LOC</strong><strong>4 WCF services</strong>
        <span className="launch-action"><Play size={16} fill="currentColor" /> START MODERNISATION MISSION</span>
      </button>
      <button className="app-choice north-star" onClick={onStart}>
        <span className="choice-state">REFERENCE ARCHITECTURE</span><Cloud />
        <div><small>EXPLORE NORTH STAR</small><h2>eShop</h2><p>Modern .NET · services · cloud-ready</p></div>
        <span className="launch-action">COMPARE TARGET <ArrowRight size={16} /></span>
      </button>
      <button className="app-choice connect" onClick={onStart}>
        <span className="choice-state">CONNECTED MODE</span><GitBranch />
        <div><small>BRING YOUR OWN REPOSITORY</small><h2>Your application</h2><p>Connect GitHub for a live assessment</p></div>
        <span className="launch-action">CONNECT REPOSITORY <ArrowRight size={16} /></span>
      </button>
    </div>
    <div className="launch-foot"><ShieldCheck /><span>Agents analyse and recommend. Humans approve architecture, scope, risk, and deployment.</span><small>DEMO FACTS FROM COPILOTWITH SAMPLE OUTPUTS</small></div>
  </section>
}

function XrayScreen({ scan, selected, onSelect, onNext }: { scan: number; selected: BlockerId; onSelect: (id: BlockerId) => void; onNext: () => void }) {
  const current = blockers[selected]
  const CurrentIcon = current.icon
  return <section className="control-screen xray-screen">
    <ScreenHeader step="02 // APPLICATION X-RAY" title="The application tells us where it hurts." copy="Repository evidence becomes a living topology. Red nodes are blockers, not decoration." agent="APPLICATION ARCHAEOLOGIST" />
    <div className="xray-grid">
      <div className="topology-panel">
        <div className="panel-toolbar"><span><Activity /> SCAN {scan}%</span><div className="scan-progress"><i style={{ width: `${scan}%` }} /></div><small>23 COMPONENTS · 4 BLOCKERS</small></div>
        <div className="app-topology">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="50" y1="50" x2="47" y2="16"/><line x1="50" y1="50" x2="22" y2="48"/><line x1="50" y1="50" x2="75" y2="48"/><line x1="50" y1="50" x2="47" y2="79"/></svg>
          <div className="topology-core"><Server /><strong>PolicyHub</strong><span>IIS monolith</span></div>
          {(Object.entries(blockers) as Array<[BlockerId, typeof blockers[BlockerId]]>).map(([id, item], index) => { const Icon = item.icon; return <button key={id} disabled={scan < 20 + index * 17} className={`topology-node ${selected === id ? 'selected' : ''}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => onSelect(id)}><Icon /><strong>{item.name}</strong><small>{item.risk}</small></button> })}
          <div className="topology-context db"><Database /> SQL Server 2017</div><div className="topology-context users"><Users /> 2 portals</div>
          <div className="scanner" style={{ left: `${scan}%` }} />
        </div>
      </div>
      <aside className="inspector-panel">
        <span className="risk-label"><CircleAlert /> MODERNISATION BLOCKER</span>
        <CurrentIcon className="inspector-icon" />
        <small>{current.kind.toUpperCase()}</small><h2>{current.name}</h2>
        <div className="inspection-facts"><p><span>Cloud readiness</span><strong>LOW</strong></p><p><span>Affected scope</span><strong>{current.files}</strong></p><p><span>Recommended pattern</span><strong>{current.replacement}</strong></p><p><span>Assigned specialist</span><strong>{current.agent}</strong></p></div>
        <div className="ask-strip"><MessageSquareText /><span><small>ASK COPILOTWITH</small>Why is this blocking cloud readiness?</span></div>
        <button className="primary-action" onClick={onNext}>ACTIVATE AGENT FLEET <ArrowRight /></button>
      </aside>
    </div>
  </section>
}

function AgentsScreen({ selected, onSelect, onNext }: { selected: number; onSelect: (index: number) => void; onNext: () => void }) {
  const agent = agentFleet[selected]
  const AgentIcon = agent.icon
  return <section className="control-screen agents-screen">
    <ScreenHeader step="03 // AGENT FLEET" title="Meet the digital engineering team." copy="Each specialist has a bounded mission, explicit evidence, and a point where it must stop for a person." agent="COPILOTWITH ORCHESTRATOR" />
    <div className="agents-layout">
      <div className="constellation">
        <div className="orchestrator"><Radar /><strong>COPILOTWITH</strong><span>ORCHESTRATOR</span></div>
        {agentFleet.map((item, index) => { const Icon = item.icon; return <button key={item.name} className={`agent-orbit a${index} ${selected === index ? 'selected' : ''}`} onClick={() => onSelect(index)}><Icon /><span>{item.name}</span><small>{item.status}</small></button> })}
      </div>
      <aside className="agent-dossier"><span className="agent-number">AGENT {String(selected + 1).padStart(2, '0')}</span><AgentIcon /><h2>{agent.name}</h2><p>{agent.role}.</p><div className="mission-facts"><span>MISSION</span><strong>{selected === 5 ? 'Replace the WCF integration boundary without changing business behaviour.' : agent.role}</strong><span>CURRENT EVIDENCE</span><strong>{agent.evidence}</strong><span>HUMAN APPROVAL</span><strong>Required before architecture or code changes</strong></div><button className="primary-action" onClick={onNext}>WATCH THE HANDOFFS <ArrowRight /></button></aside>
    </div>
    <div className="handoff-strip">{handoffs.map(([name, message, type], index) => <div key={name} className={type.toLowerCase()}><span>{index + 1}</span><small>{name}</small><strong>{message}</strong><em>{type}</em></div>)}</div>
  </section>
}

function PlanScreen({ constraint, target, approved, onConstraint, onTarget, onApprove, onNext }: { constraint: string; target: string; approved: boolean; onConstraint: (value: string) => void; onTarget: (value: string) => void; onApprove: () => void; onNext: () => void }) {
  const tasks = [
    ['MOD-001', 'Freeze behavioural baseline', 'Test Engineer', '2 days'],
    ['MOD-002', 'Extract pricing boundary', 'Runtime Moderniser', '8 days'],
    ['MOD-003', 'Replace WCF with REST contract', 'Integration Moderniser', '6 days'],
    ['MOD-004', `Deploy pilot to ${target}`, 'Deployment Engineer', '3 days'],
  ]
  return <section className="control-screen plan-screen">
    <ScreenHeader step="04 // MODERNISATION PATH BUILDER" title="The plan bends around reality." copy="Change the objective, platform, or constraint. The sequence, agents, and risk respond." agent="MODERNISATION STRATEGIST" />
    <div className="plan-layout">
      <aside className="plan-controls"><label>OPTIMISE FOR</label>{constraints.map((item) => <button key={item} className={constraint === item ? 'selected' : ''} onClick={() => onConstraint(item)}><span />{item}</button>)}<label>TARGET PLATFORM</label><select value={target} onChange={(event) => onTarget(event.target.value)}><option>Azure Container Apps</option><option>Azure App Service</option><option>AKS</option><option>Hybrid</option></select><div className="plan-score"><span>PROJECTED READINESS</span><strong>{constraint === 'Lowest risk' ? 91 : constraint === 'Fastest migration' ? 84 : 88}</strong><small>Illustrative estimate</small></div></aside>
      <div className="roadmap-panel"><div className="roadmap-head"><span>GENERATED PLAN · REVISION 03</span><strong>{constraint.toUpperCase()}</strong></div>{tasks.map(([id, title, owner, effort], index) => <div className="roadmap-task" key={id}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{id}</small><strong>{title}</strong><em>{owner}</em></div><b>{effort}</b><ChevronRight /></div>)}<div className="plan-decision"><UserCheck /><div><small>DECISION REQUIRED</small><strong>Approve the pricing-service pilot and target platform</strong><p>Agents cannot begin code changes until a human accepts scope and architecture.</p></div>{approved ? <span className="approved-mark"><Check /> APPROVED</span> : <button className="primary-action" onClick={onApprove}>APPROVE PLAN</button>}</div>{approved && <button className="primary-action continue" onClick={onNext}>BEGIN TRANSFORMATION <ArrowRight /></button>}</div>
    </div>
  </section>
}

function TransformScreen({ running, onRun, onNext }: { running: boolean; onRun: () => void; onNext: () => void }) {
  return <section className="control-screen transform-screen">
    <ScreenHeader step="05 // TRANSFORMATION" title="One component. One reviewable change." copy="The approved slice becomes code, tests, deployment assets, and a pull request." agent="INTEGRATION MODERNISER" />
    <div className="transform-layout">
      <div className="code-workbench"><div className="editor-tabs"><span className="old active">BEFORE · RatingEngine.svc</span><span className={running ? 'new ready' : 'new'}>AFTER · PricingEndpoint.cs</span><small>PR #47</small></div><div className="code-columns"><pre className="legacy-code"><code>{`[ServiceContract]\npublic interface IRatingEngine {\n  [OperationContract]\n  Premium Calculate(Policy policy);\n}\n\n// IIS-hosted WCF endpoint\n// Windows-only runtime\n// Shared database context`}</code></pre><pre className={running ? 'modern-code revealed' : 'modern-code'}><code>{running ? `app.MapPost("/api/pricing",\n  async (Policy policy, IPricingEngine engine) =>\n    Results.Ok(await engine.CalculateAsync(policy)));\n\n// .NET API contract\n// Container-ready boundary\n// Independently testable` : '// Select “Modernise this component”\n// to prepare the bounded change.'}</code></pre></div><div className="diff-status"><span>FILES <strong>{running ? '14 changed' : '—'}</strong></span><span>DIFF <strong>{running ? '+228 / -163' : '—'}</strong></span><span>PACKAGE <strong>{running ? '3 updated' : '—'}</strong></span></div></div>
      <aside className="execution-panel"><span>ACTIVE SPECIALISTS</span>{[['Integration Moderniser', Code2], ['Test Engineer', TestTube2], ['Security Guardian', ShieldCheck], ['Deployment Engineer', Rocket]].map(([name, Icon], index) => { const TypedIcon = Icon as typeof Code2; return <div className={running ? 'execution-step complete' : 'execution-step'} key={String(name)}><TypedIcon /><div><strong>{name as string}</strong><small>{running ? ['Refactor prepared', '47 tests passed', 'No critical findings', 'Container assets ready'][index] : 'Waiting for execution'}</small></div>{running ? <Check /> : <span />}</div> })}{running ? <><div className="terminal"><span>$ dotnet test</span><p>Passed! 47 tests in 8.4s</p><span>$ docker build</span><p>Successfully tagged policyhub-pricing:47</p></div><button className="primary-action" onClick={onNext}>OPEN EVIDENCE GATE <ArrowRight /></button></> : <button className="primary-action" onClick={onRun}><Zap /> MODERNISE THIS COMPONENT</button>}</aside>
    </div>
  </section>
}

function ProofScreen({ approved, onApprove, onNext }: { approved: boolean; onApprove: () => void; onNext: () => void }) {
  const checks = [['Build', 'Succeeded', PackageCheck], ['Unit tests', '47 / 47 passed', TestTube2], ['Security', '0 critical findings', ShieldCheck], ['Container', 'Image produced', Box], ['Pull request', '#47 ready for review', GitPullRequest]]
  return <section className="control-screen proof-screen">
    <ScreenHeader step="06 // PROOF, NOT PROMISES" title="Show me the evidence." copy="Illustrative replay of the evidence a real agent run must produce and retain." agent="QUALITY + GOVERNANCE" />
    <div className="proof-console"><div className="proof-grid">{checks.map(([name, result, Icon]) => { const TypedIcon = Icon as typeof PackageCheck; return <div key={String(name)}><TypedIcon /><span>{name as string}</span><strong>{result as string}</strong><Check /></div> })}</div><div className="pr-preview"><div className="pr-title"><GitPullRequest /><div><small>PR #47 · ILLUSTRATIVE</small><h2>Extract pricing service boundary</h2></div><span>14 files changed</span></div><p>Generated by Integration Moderniser · validated by Test Engineer and Security Guardian</p><div className="pr-files"><span>PricingEndpoint.cs <b>+48</b></span><span>PricingEngineTests.cs <b>+126</b></span><span>Dockerfile <b>+31</b></span><span>architecture-decision-004.md <b>+23</b></span></div></div><aside className={approved ? 'human-gate approved' : 'human-gate'}><LockKeyhole /><span>GATE 06 · HUMAN REVIEW</span><h2>{approved ? 'Approved to progress.' : 'Agents cannot approve their own work.'}</h2><p>{approved ? 'Decision, evidence set, conditions, and reviewer are now attached to the programme record.' : 'Review the architecture change, evidence, rollback, and deployment conditions.'}</p>{approved ? <button className="primary-action" onClick={onNext}>OPEN TIME MACHINE <ArrowRight /></button> : <button className="primary-action" onClick={onApprove}><UserCheck /> APPROVE & CONTINUE</button>}</aside></div>
  </section>
}

function FutureScreen({ value, onChange, onNext }: { value: number; onChange: (value: number) => void; onNext: () => void }) {
  const modern = value > 50
  return <section className="control-screen future-screen">
    <ScreenHeader step="07 // MODERNISATION TIME MACHINE" title="Drag the architecture through the change." copy="The transformation is not a slide. It is the accumulated effect of approved, evidenced slices." agent="ARCHITECTURE VIEW" />
    <div className="time-machine"><div className="time-labels"><span>LEGACY APPLICATION</span><strong>{value}% MODERNISED</strong><span>MODERN PRODUCT</span></div><input aria-label="Modernisation progress" type="range" min="0" max="100" value={value} onChange={(event) => onChange(Number(event.target.value))} /><div className="architecture-morph"><div className={modern ? 'arch-side legacy faded' : 'arch-side legacy'}><span>BEFORE</span>{[['Windows Server', Server], ['.NET Framework 4.8', Braces], ['WCF', Network], ['Word Interop', FileText], ['TeamCity', GitBranch]].map(([name, Icon]) => { const TypedIcon = Icon as typeof Server; return <div key={String(name)}><TypedIcon />{name as string}</div> })}</div><div className="morph-core"><RefreshCw style={{ transform: `rotate(${value * 3.6}deg)` }} /><strong>{modern ? 'CLOUD-READY' : 'TIGHTLY COUPLED'}</strong><span>{modern ? 'Reversible slices' : 'Shared runtime'}</span></div><div className={modern ? 'arch-side target' : 'arch-side target faded'}><span>AFTER</span>{[['Container Apps', Cloud], ['Modern .NET', Braces], ['REST + Service Bus', Network], ['Blob Storage', Database], ['GitHub Actions', GitBranch]].map(([name, Icon]) => { const TypedIcon = Icon as typeof Cloud; return <div key={String(name)}><TypedIcon />{name as string}</div> })}</div></div><div className="morph-summary"><p><span>Readiness</span><strong>{Math.round(42 + value * .49)} / 100</strong></p><p><span>Windows dependencies</span><strong>{Math.max(0, 12 - Math.round(value * .12))}</strong></p><p><span>Deployments / month</span><strong>{Math.max(1, Math.round(value * .1))}+</strong></p><small>Projected demo outcomes · not measured customer benefits</small></div></div>
    <button className="primary-action stage-action" onClick={onNext}>ZOOM OUT TO THE ESTATE <ArrowRight /></button>
  </section>
}

function PortfolioScreen({ generated, onGenerate, onRestart }: { generated: boolean; onGenerate: () => void; onRestart: () => void }) {
  return <section className="control-screen portfolio-screen">
    <ScreenHeader step="08 // PROGRAMME SCALE" title="One application becomes an operating model." copy="Copilot accelerates engineering. CopilotWith industrialises it across the application estate." agent="PROGRAMME ORCHESTRATOR" />
    <div className="portfolio-layout"><div className="estate-chart"><div className="axis y">BUSINESS CRITICALITY</div><div className="axis x">MODERNISATION COMPLEXITY</div>{portfolioApps.map((app) => <span key={app.id} className={generated ? `portfolio-app wave-${app.wave} arranged` : 'portfolio-app'} style={generated ? { left: `${12 + (app.wave - 1) * 24}%`, top: `${12 + (app.id % 8) * 10}%`, width: app.size, height: app.size } : { left: `${app.x}%`, top: `${app.y}%`, width: app.size, height: app.size }} title={`Application ${app.id}`} />)}<div className="estate-legend"><span><i /> READY</span><span><i /> REVIEW</span><span><i /> COMPLEX</span></div></div><aside className="portfolio-command"><span>APPLICATION ESTATE</span><h2>127 applications</h2><div className="portfolio-stats"><p><strong>32</strong><span>assessed</span></p><p><strong>11</strong><span>high-risk</span></p><p><strong>8</strong><span>Wave 1 candidates</span></p></div>{generated ? <div className="wave-list">{[['WAVE 1', '8 apps', 'Quick wins'], ['WAVE 2', '14 apps', 'Moderate refactoring'], ['WAVE 3', '7 apps', 'Architecture transformation'], ['WAVE 4', '3 apps', 'Dependency constrained']].map(([wave, count, label]) => <div key={wave}><span>{wave}</span><strong>{count}</strong><small>{label}</small></div>)}</div> : <button className="primary-action" onClick={onGenerate}><Sparkles /> GENERATE MODERNISATION WAVES</button>}</aside></div>
    {generated && <div className="programme-reveal"><div><span>WHAT JUST HAPPENED?</span><h2>GitHub Copilot powered the engineering. CopilotWith governed the programme.</h2><p>Specialists discovered, planned, transformed, tested, secured, and prepared deployment evidence. Humans owned scope, architecture, risk, review, and progression.</p></div><div className="programme-lanes"><span>CUSTOMER <b>Priorities · constraints · approvals</b></span><span>COPILOTWITH <b>Governance · patterns · orchestration</b></span><span>GITHUB COPILOT <b>Analysis · transformation · validation</b></span><span>AZURE <b>Target platform · deployment · operations</b></span></div><button className="secondary-action" onClick={onRestart}>REPLAY MISSION <RefreshCw /></button></div>}
  </section>
}

function ScreenHeader({ step, title, copy, agent }: { step: string; title: string; copy: string; agent: string }) {
  return <header className="screen-header"><div><span className="eyebrow">{step}</span><h1>{title}</h1><p>{copy}</p></div><div className="active-agent"><span className="live-dot" /><Bot /><div><small>ACTIVE AGENT</small><strong>{agent}</strong></div></div></header>
}

export default MissionControl