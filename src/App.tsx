import { useEffect, useState } from 'react'
import {
  ArrowLeft, ArrowRight, Bot, Boxes, Check, ChevronRight, CircleAlert,
  FileCheck2, GitPullRequest, Menu, Network, Play, ShieldCheck,
  Sparkles, UserCheck, X, Zap,
} from 'lucide-react'
import heroAsset from './assets/hero.png'
import './App.css'

const chapters = [
  ['01', 'The fog'], ['02', 'The reveal'], ['03', 'The gap'], ['04', 'The choice'],
  ['05', 'The slice'], ['06', 'The proof'], ['07', 'The scale'],
]

const interfaces = [
  { id: 'a9', name: 'A9_Sales', kind: 'hub', x: 47, y: 48, evidence: 3, risk: 'CRITICAL' },
  { id: 'pos', name: 'PoS systems', kind: 'source', x: 8, y: 22, evidence: 3, risk: 'MEDIUM' },
  { id: 'esfa', name: 'ESFA', kind: 'simple', x: 82, y: 10, evidence: 3, risk: 'LOW' },
  { id: 'i0659', name: 'I0659', kind: 'node', x: 88, y: 29, evidence: 3, risk: 'MEDIUM' },
  { id: 'i0977', name: 'I0977', kind: 'node', x: 88, y: 48, evidence: 4, risk: 'MEDIUM' },
  { id: 'i1092', name: 'I1092', kind: 'node', x: 88, y: 67, evidence: 3, risk: 'MEDIUM' },
  { id: 'sagg', name: 'Sales aggregation', kind: 'node', x: 75, y: 86, evidence: 3, risk: 'MEDIUM' },
  { id: 'idt', name: 'Sales IDT', kind: 'simple', x: 48, y: 89, evidence: 3, risk: 'LOW' },
  { id: 'adapter', name: 'InsertSAGG', kind: 'node', x: 23, y: 82, evidence: 3, risk: 'MEDIUM' },
  { id: 'i1804', name: 'I1804', kind: 'node', x: 9, y: 65, evidence: 3, risk: 'HIGH' },
]

const links = interfaces.filter((item) => item.id !== 'a9').map((item) => ({ from: interfaces[0], to: item }))

const agents = {
  census: ['01', 'Estate census', 'Scans broadly, classifies the estate, and cites every finding.'],
  analysis: ['02', 'Deep analysis', 'Reconstructs behaviour and separates evidence from inference.'],
  design: ['03', 'Displacement designer', 'Turns validated evidence into options and trade-offs.'],
  implementation: ['04', 'Slice implementer', 'Changes only the bounded scope a human approved.'],
  governance: ['12', 'Governance', 'Verifies proof is present. It cannot approve its own progression.'],
}

function AgentBadge({ agent }: { agent: keyof typeof agents }) {
  const [order, name, description] = agents[agent]
  return <div className="agent-badge"><span>{order}</span><Bot size={18} /><div><strong>{name}</strong><small>{description}</small></div></div>
}

function App() {
  const [chapter, setChapter] = useState(-1)
  const [highestReached, setHighestReached] = useState(-1)
  const [selected, setSelected] = useState('a9')
  const [scan, setScan] = useState(0)
  const [smeConfirmed, setSmeConfirmed] = useState(false)
  const [strategy, setStrategy] = useState<'first' | 'last' | null>(null)
  const [proofOpen, setProofOpen] = useState<number | null>(null)
  const [approved, setApproved] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (chapter !== 1 || scan >= 100) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frame = window.requestAnimationFrame(() => setScan(100))
      return () => window.cancelAnimationFrame(frame)
    }
    const timer = window.setInterval(() => setScan((value) => Math.min(100, value + 4)), 45)
    return () => window.clearInterval(timer)
  }, [chapter, scan])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
    return () => window.cancelAnimationFrame(frame)
  }, [chapter])

  const go = (next: number) => {
    setChapter(next)
    setMenuOpen(false)
  }

  const resetStory = () => {
    setChapter(-1)
    setHighestReached(-1)
    setSelected('a9')
    setScan(0)
    setSmeConfirmed(false)
    setStrategy(null)
    setProofOpen(null)
    setApproved(false)
    setMenuOpen(false)
  }

  const next = () => {
    const target = Math.min(6, chapter + 1)
    setHighestReached((value) => Math.max(value, target))
    go(target)
  }
  const startStory = () => {
    setSelected('a9')
    setScan(0)
    setSmeConfirmed(false)
    setStrategy(null)
    setProofOpen(null)
    setApproved(false)
    setHighestReached(0)
    go(0)
  }
  const back = () => go(Math.max(-1, chapter - 1))
  const canAdvance = chapter !== 2 || smeConfirmed
    ? chapter !== 3 || Boolean(strategy)
      ? chapter !== 5 || approved
      : false
    : false

  return <div className="story-shell">
    <header className="story-nav">
      <button className="wordmark" onClick={resetStory}><span><Network size={18} /></span><strong>CopilotWith</strong></button>
      {chapter >= 0 && <nav className="chapter-progress" aria-label="Story chapters">
        {chapters.map(([number, label], index) => <button key={number} disabled={index > highestReached} aria-current={index === chapter ? 'step' : undefined} className={index === chapter ? 'active' : index < highestReached ? 'done' : ''} onClick={() => go(index)}><span>{number}</span><small>{label}</small></button>)}
      </nav>}
      {chapter >= 0 && <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close chapters' : 'Open chapters'} aria-expanded={menuOpen} aria-controls="mobile-chapters"><Menu /></button>}
      {menuOpen && <nav className="mobile-chapters" id="mobile-chapters" aria-label="Story chapters">{chapters.map(([number, label], index) => <button key={number} disabled={index > highestReached} aria-current={index === chapter ? 'step' : undefined} onClick={() => go(index)}>{number} {label}</button>)}</nav>}
      <span className="truth-label">ILLUSTRATIVE REPLAY · REPOSITORY-GROUNDED</span>
    </header>

    {chapter === -1 ? <Landing onStart={startStory} /> : <main className="chapter-stage">
      {chapter === 0 && <FogChapter onNext={next} />}
      {chapter === 1 && <RevealChapter scan={scan} selected={selected} onSelect={setSelected} onNext={next} />}
      {chapter === 2 && <GapChapter confirmed={smeConfirmed} onConfirm={() => setSmeConfirmed(true)} onNext={next} />}
      {chapter === 3 && <ChoiceChapter strategy={strategy} onChoose={(value) => { setStrategy(value); setProofOpen(null); setApproved(false); setHighestReached(3) }} onNext={next} />}
      {chapter === 4 && <SliceChapter strategy={strategy} onNext={next} />}
      {chapter === 5 && <ProofChapter open={proofOpen} onOpen={setProofOpen} approved={approved} onApprove={() => setApproved(true)} onNext={next} />}
      {chapter === 6 && <ScaleChapter approved={approved} onRestart={resetStory} />}
      <div className="story-controls"><button onClick={back}><ArrowLeft size={16} /> Back</button><span>{chapter + 1} / 7</span>{chapter < 6 && <button onClick={next} disabled={!canAdvance}>Next chapter <ArrowRight size={16} /></button>}</div>
    </main>}
  </div>
}

function Landing({ onStart }: { onStart: () => void }) {
  return <main className="landing">
    <div className="landing-copy">
      <span className="kicker">A COPILOTWITH STORY</span>
      <h1>Modernisation does not start with code.</h1>
      <p className="landing-line">It starts with knowing <em>what is true.</em></p>
      <p className="landing-intro">Enter a legacy integration estate where nobody can see the whole system. Watch a governed team of agents turn 1,994 scattered artefacts into one human-owned decision.</p>
      <button className="story-cta" onClick={onStart}><Play size={18} fill="currentColor" /> Begin the 7-minute story</button>
      <div className="landing-proof"><span>16 interfaces</span><span>9 technologies</span><span>12 specialist agents</span><span>1 human decision</span></div>
    </div>
    <div className="landing-visual" aria-label="Legacy and evidence layers">
      <img src={heroAsset} alt="Layered system visual" />
      <div className="visual-label legacy"><span />LEGACY ESTATE</div>
      <div className="visual-label evidence"><span />EVIDENCE LAYER</div>
      <div className="signal s1" /><div className="signal s2" /><div className="signal s3" />
      <p>Thousands of files.<br />No shared truth.</p>
    </div>
  </main>
}

function FogChapter({ onNext }: { onNext: () => void }) {
  return <section className="story-grid fog-chapter">
    <div className="narrative"><span className="beat">01 · THE FOG</span><h1>Sixteen integrations.<br />Nobody sees the system.</h1><p>Contoso Retail's sales estate has grown across IBM MQ, ACE, DataStage, DB2, Sterling B2B, SFTP, Oracle, and REST. Every team owns a piece. No one owns the picture.</p><AgentBadge agent="census" /><button className="story-cta" onClick={onNext}>Let the agents look <ArrowRight size={17} /></button></div>
    <div className="fog-visual">
      <div className="file-cloud">{['1,470 MQSC', '198 ESQL', '60 flows', '218 scripts', '39 XML', '9 SQL'].map((item, index) => <span key={item} style={{ '--i': index } as React.CSSProperties}>{item}</span>)}</div>
      <div className="fog-statement"><CircleAlert /><strong>One failure can cascade across the estate.</strong><small>But the dependency path is buried across 1,994 artefacts.</small></div>
    </div>
  </section>
}

function RevealChapter({ scan, selected, onSelect, onNext }: { scan: number; selected: string; onSelect: (id: string) => void; onNext: () => void }) {
  const current = interfaces.find((item) => item.id === selected) ?? interfaces[0]
  return <section className="reveal-chapter">
    <div className="chapter-heading"><div><span className="beat">02 · THE REVEAL</span><h1>The files become a living map.</h1></div><AgentBadge agent="census" /></div>
    <div className="reveal-layout">
      <div className="estate-map">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">{links.map(({ from, to }) => <line key={to.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />)}</svg>
        {interfaces.map((item, index) => <button key={item.id} disabled={scan < index * 8} className={`${item.kind} ${selected === item.id ? 'selected' : ''}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => onSelect(item.id)}><span>{item.name}</span><small>L{item.evidence}</small></button>)}
        <div className="scan-beam" style={{ left: `${scan}%` }} />
      </div>
      <aside className="asset-story"><span className={`risk ${current.risk.toLowerCase()}`}>{current.risk} RISK</span><h2>{current.name}</h2>{current.id === 'a9' ? <><p>The central point-of-sale hub spans four platforms and feeds eight downstream consumers.</p><div className="big-number"><strong>8+</strong><span>direct consumers</span></div><div className="tech-row"><span>ACE</span><span>MQ</span><span>DataStage</span><span>DB2</span></div></> : <><p>One part of the connected estate, now visible with its evidence level and relationship to the critical hub.</p><div className="big-number"><strong>L{current.evidence}</strong><span>evidence level</span></div></>}<button className="story-cta" onClick={onNext}>Look beneath the map <ArrowRight size={17} /></button></aside>
    </div>
  </section>
}

function GapChapter({ confirmed, onConfirm, onNext }: { confirmed: boolean; onConfirm: () => void; onNext: () => void }) {
  return <section className="gap-chapter">
    <div className="chapter-heading"><div><span className="beat">03 · THE GAP</span><h1>A map is not the truth.</h1><p>The agents found structure. They also found the edge of their knowledge.</p></div><AgentBadge agent="analysis" /></div>
    <div className="evidence-board" role="table" aria-label="Evidence confidence matrix">
      <div className="evidence-columns" role="row"><span role="columnheader">Finding</span><span role="columnheader">Source</span><span role="columnheader">Runtime</span><span role="columnheader">SME</span><span role="columnheader">Confidence</span></div>
      {[
        ['16 interfaces exist', true, false, false, 'OBSERVED'],
        ['A9 feeds 8+ consumers', true, false, false, 'INFERRED'],
        ['I3248 can be retired', true, false, confirmed, confirmed ? 'SME-CONFIRMED' : 'UNKNOWN'],
        ['Current SLAs are preserved', false, false, false, 'UNKNOWN'],
      ].map(([finding, source, runtime, sme, confidence]) => <div className="evidence-row" role="row" key={String(finding)}><strong role="cell">{finding}</strong><CheckCell label="Source evidence" yes={Boolean(source)} /><CheckCell label="Runtime evidence" yes={Boolean(runtime)} /><CheckCell label="SME evidence" yes={Boolean(sme)} /><span role="cell" className={`confidence ${String(confidence).toLowerCase()}`}>{confidence}</span></div>)}
    </div>
    <div className={`sme-moment ${confirmed ? 'confirmed' : ''}`}><UserCheck /><div><span>YOUR TURN · DOMAIN OWNER</span><h2>{confirmed ? 'I3248 is a month-end finance scorecard.' : 'The agents cannot identify I3248.'}</h2><p>{confirmed ? 'Your context has changed the record from UNKNOWN to SME-CONFIRMED. It cannot be retired.' : 'MQ configuration exists, but purpose, direction, ownership, and consumers are absent. Is this obsolete, or critical?'}</p></div>{confirmed ? <button className="story-cta" onClick={onNext}>Carry the truth forward <ArrowRight size={17} /></button> : <button className="story-cta" onClick={onConfirm}><UserCheck size={17} /> Add SME knowledge</button>}</div>
  </section>
}

function CheckCell({ yes, label }: { yes: boolean; label: string }) { return <span role="cell" aria-label={`${label}: ${yes ? 'present' : 'not present'}`} className={yes ? 'yes' : 'no'}>{yes ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}</span> }

function ChoiceChapter({ strategy, onChoose, onNext }: { strategy: 'first' | 'last' | null; onChoose: (value: 'first' | 'last') => void; onNext: () => void }) {
  return <section className="choice-chapter">
    <div className="chapter-heading"><div><span className="beat">04 · THE CHOICE</span><h1>The machine finds the decision.<br />A human makes it.</h1></div><AgentBadge agent="design" /></div>
    <div className="decision-line"><div className="decision-source"><Zap /><strong>A9_Sales</strong><span>Critical hub</span></div><div className="fork"><span /></div><button className={strategy === 'first' ? 'decision-card selected' : 'decision-card'} onClick={() => onChoose('first')}><small>OPTION A</small><h2>Migrate the hub first</h2><p>Clear the critical path early, but take maximum complexity before the delivery pattern is proven.</p><div><span>Early risk retirement</span><strong>Higher first move</strong></div></button><button className={strategy === 'last' ? 'decision-card selected' : 'decision-card'} onClick={() => onChoose('last')}><small>OPTION B · RECOMMENDED</small><h2>Prove, then migrate the hub</h2><p>Learn on low-blast-radius consumers, then move A9 with evidence from the earlier slices.</p><div><span>Pattern proven first</span><strong>Risk remains longer</strong></div></button></div>
    <div className="human-rule"><ShieldCheck /><p><strong>CopilotWith recommends. It does not decide.</strong> The wave plan changes only after the programme owner records a choice.</p><button disabled={!strategy} className="story-cta" onClick={onNext}>{strategy ? `Record: ${strategy === 'last' ? 'prove first' : 'hub first'}` : 'Choose a strategy'} <ArrowRight size={17} /></button></div>
  </section>
}

function SliceChapter({ strategy, onNext }: { strategy: 'first' | 'last' | null; onNext: () => void }) {
  const proveFirst = strategy !== 'first'
  return <section className="slice-chapter">
    <div className="chapter-heading"><div><span className="beat">05 · THE SLICE</span><h1>Not a migration project.<br />One reversible move.</h1></div><AgentBadge agent="implementation" /></div>
    <div className="slice-board"><div className="slice-focus"><div className="slice-icon"><Boxes /></div><span>APPROVED SLICE 01</span><h2>{proveFirst ? 'ESFA consumer' : 'A9_Sales hub foundation'}</h2><p>{proveFirst ? 'A simple DataStage consumer validates the target pattern without disturbing the critical sales hub.' : 'The programme begins with the hub foundation, isolated behind parallel routing and rollback controls.'}</p></div><div className="scope-columns"><div><span>IN SCOPE</span>{['Reconstruct input contract', 'Build target workflow', 'Run old and new in parallel', 'Compare every output'].map((item) => <p key={item}><Check />{item}</p>)}</div><div><span>OUT OF SCOPE</span>{['Legacy decommissioning', 'Downstream redesign', 'Production routing switch', 'Unapproved dependencies'].map((item) => <p key={item}><X />{item}</p>)}</div></div><div className="pr-rail"><GitPullRequest /><div><small>PR #001</small><strong>Bounded. Reviewable. Reversible.</strong></div><ChevronRight /><span>Human review</span></div></div>
    <button className="story-cta chapter-cta" onClick={onNext}>Put the slice on trial <ArrowRight size={17} /></button>
  </section>
}

const proofItems = [
  ['Contract reconstructed', '15 message types and eight transformations traced to source evidence.'],
  ['Parallel run observed', 'Seven-day comparison completed; outliers remain visible for review.'],
  ['Security controls checked', 'Identity, secrets, logging, and target access boundaries inspected.'],
  ['Rollback exercised', 'Legacy routing restored inside the agreed recovery window.'],
]

function ProofChapter({ open, onOpen, approved, onApprove, onNext }: { open: number | null; onOpen: (index: number | null) => void; approved: boolean; onApprove: () => void; onNext: () => void }) {
  return <section className="proof-chapter">
    <div className="chapter-heading"><div><span className="beat">06 · THE PROOF · ILLUSTRATIVE REPLAY</span><h1>Progress is earned with evidence.</h1><p>These example checks show the proof a live engagement would need to supply.</p></div><AgentBadge agent="governance" /></div>
    <div className="proof-layout"><div className="proof-list">{proofItems.map(([title, detail], index) => <button key={title} onClick={() => onOpen(open === index ? null : index)} className={open === index ? 'open' : ''} aria-expanded={open === index} aria-controls={`proof-detail-${index}`}><FileCheck2 /><div><strong>{title}</strong>{open === index && <p id={`proof-detail-${index}`}>{detail}</p>}</div><span>PASS</span><ChevronRight /></button>)}</div><aside className={`approval-panel ${approved ? 'approved' : ''}`}><UserCheck /><span>STAGE GATE · G6</span><h2>{approved ? 'Approved to progress.' : 'Agents have finished checking.'}</h2><p>{approved ? 'The human decision, conditions, evidence set, and timestamp are now part of the programme record.' : 'The governance agent reports that required proof is present. It cannot merge the change or accept the risk.'}</p>{approved ? <button className="story-cta" onClick={onNext}>See what scales <ArrowRight /></button> : <button className="story-cta" onClick={onApprove}><UserCheck /> Human approval</button>}</aside></div>
  </section>
}

function ScaleChapter({ approved, onRestart }: { approved: boolean; onRestart: () => void }) {
  return <section className="scale-chapter">
    <div className="scale-copy"><span className="beat">07 · THE SCALE</span><h1>The first slice does more than move an interface.</h1><p>It turns assumptions into observed delivery evidence. That evidence improves the next estimate, the next sequence, and the next decision.</p></div>
    <div className="before-after"><div><span>BEFORE</span><strong>1,994</strong><p>scattered artefacts</p><small>Unknown ownership · hidden coupling · no common evidence</small></div><ArrowRight /><div className="after"><span>AFTER ONE SLICE</span><strong>{approved ? '1' : '0'}</strong><p>proven delivery pattern</p><small>Visible estate · bounded change · human-owned decision trail</small></div></div>
    <div className="wave-story"><div><span>WAVE 01 · PROVE</span><strong>ESFA</strong><small>Low blast radius</small></div><ChevronRight /><div><span>WAVE 02 · LEARN</span><strong>I0977 + Sales IDT</strong><small>Reuse observed pattern</small></div><ChevronRight /><div className="critical-wave"><span>WAVE 03 · TRANSFORM</span><strong>A9_Sales</strong><small>Move the hub with evidence</small></div></div>
    <div className="closing"><Sparkles /><div><h2>That is CopilotWith.</h2><p>Not AI writing code in isolation. A governed operating model that makes the estate visible, uncertainty explicit, changes reversible, and every consequential decision human.</p></div><button className="story-cta" onClick={onRestart}>Replay the story</button></div>
  </section>
}

export default App