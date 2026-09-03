import { useEffect, useState } from 'react'
import {
  Activity, ArrowRight, Bot, Boxes, Check, ChevronRight, CircleHelp,
  FileCheck2, GitBranch, Menu, Network, Pause, Play, Radar, RotateCcw,
  Search, ShieldCheck, Sparkles, Target, UserCheck, X, Zap,
} from 'lucide-react'
import { agents, evidenceEvents, links, nodes, packs, type Confidence } from './data'
import './App.css'

type Mode = 'briefing' | 'replay' | 'explore'
type View = 'mission' | 'agents' | 'packs' | 'outcomes'

function App() {
  const [mode, setMode] = useState<Mode>('replay')
  const [view, setView] = useState<View>('mission')
  const [selectedAgent, setSelectedAgent] = useState('discovery')
  const [selectedNode, setSelectedNode] = useState('a9')
  const [replayStep, setReplayStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [confidence, setConfidence] = useState<Confidence | 'ALL'>('ALL')
  const [gateState, setGateState] = useState<'waiting' | 'approved' | 'challenged'>('waiting')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setReplayStep((step) => {
        if (step >= evidenceEvents.length) {
          setPlaying(false)
          return step
        }
        return step + 1
      })
    }, 1050)
    return () => window.clearInterval(timer)
  }, [playing])

  const resetReplay = () => {
    setReplayStep(0)
    setGateState('waiting')
    setPlaying(false)
  }
  const changeView = (next: View) => {
    setView(next)
    setMobileOpen(false)
  }
  const visibleEvents = evidenceEvents.slice(0, replayStep)
    .filter((event) => confidence === 'ALL' || event.confidence === confidence)
  const agent = agents.find((item) => item.id === selectedAgent) ?? agents[1]
  const node = nodes.find((item) => item.id === selectedNode) ?? nodes[2]

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => changeView('mission')} aria-label="CopilotWith home">
          <span className="brand-mark"><GitBranch size={18} /></span>
          <span><strong>CopilotWith</strong><small>Modernisation Mission Control</small></span>
        </button>
        <nav className={mobileOpen ? 'nav open' : 'nav'} aria-label="Primary navigation">
          {(['mission', 'agents', 'packs', 'outcomes'] as View[]).map((item) => (
            <button key={item} className={view === item ? 'active' : ''} onClick={() => changeView(item)}>{item}</button>
          ))}
        </nav>
        <div className="mode-switch" aria-label="Experience mode">
          {(['briefing', 'replay', 'explore'] as Mode[]).map((item) => (
            <button key={item} className={mode === item ? 'active' : ''} onClick={() => setMode(item)}>{item}</button>
          ))}
        </div>
        <button className="icon-button mobile-menu" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu"><Menu /></button>
      </header>

      {view === 'mission' && <main>
        <section className="hero-band">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> {mode === 'replay' ? 'REPLAY · ANONYMISED CUSTOMER PATTERN' : mode.toUpperCase()}</div>
            <h1>Turn legacy uncertainty into a governed modernisation programme.</h1>
            <p>Watch specialist agents discover an estate, connect evidence, expose unknowns, and prepare safe decisions while people remain in control.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => { resetReplay(); setPlaying(true); setMode('replay') }}><Play size={17} fill="currentColor" /> Run the mission</button>
              <button className="secondary" onClick={() => changeView('agents')}><Bot size={17} /> Meet the agents</button>
            </div>
          </div>
          <div className="pulse-panel" aria-label="Mission summary">
            <div className="pulse-head"><span>CONTOSO RETAIL · INTEGRATION ESTATE</span><span className="status">REPLAY</span></div>
            <div className="metric-grid">
              <div><strong>{replayStep >= 2 ? '1,994' : '—'}</strong><span>artefacts scanned</span></div>
              <div><strong>{replayStep >= 3 ? '16' : '—'}</strong><span>interfaces found</span></div>
              <div><strong>{replayStep >= 3 ? '9' : '—'}</strong><span>technologies</span></div>
              <div><strong>{replayStep >= 4 ? '8' : '—'}</strong><span>hub consumers</span></div>
            </div>
            <div className="scan-line"><span style={{ width: `${(replayStep / evidenceEvents.length) * 100}%` }} /></div>
            <p><Activity size={15} /> {replayStep === 0 ? 'Ready to inspect the approved boundary' : replayStep < 6 ? evidenceEvents[replayStep - 1].title : 'Evidence pack ready for human review'}</p>
          </div>
        </section>

        <section className="operating-strip">
          {[
            ['01', 'Discover', 'Find and classify'], ['02', 'Understand', 'Trace evidence'], ['03', 'Decide', 'Compare options'], ['04', 'Change', 'Bounded slices'], ['05', 'Prove', 'Verify and learn'],
          ].map(([number, title, detail], index) => (
            <div key={number} className={replayStep > index ? 'stage reached' : 'stage'}><span>{number}</span><div><strong>{title}</strong><small>{detail}</small></div>{index < 4 && <ChevronRight size={16} />}</div>
          ))}
        </section>

        <section className="workspace">
          <aside className="agent-rail">
            <div className="section-label">AGENT TEAM <span>{agents.length}</span></div>
            {agents.map((item) => (
              <button key={item.id} className={selectedAgent === item.id ? 'agent-row active' : 'agent-row'} onClick={() => setSelectedAgent(item.id)}>
                <span className="agent-order">{item.order}</span><span><strong>{item.name}</strong><small>{item.role} · {item.verb}</small></span>
                {evidenceEvents.slice(0, replayStep).some((event) => event.agentId === item.id) && <Check size={15} />}
              </button>
            ))}
          </aside>

          <div className="canvas-panel">
            <div className="panel-head">
              <div><span className="section-label">PROGRAMME TWIN</span><h2>Integration estate topology</h2></div>
              <div className="legend"><span><i />Source</span><span><i className="hub" />Critical hub</span><span><i className="integration" />Integration</span></div>
            </div>
            <div className="topology">
              <svg className="links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {links.map(([from, to]) => {
                  const a = nodes.find((item) => item.id === from)!
                  const b = nodes.find((item) => item.id === to)!
                  return <line key={`${from}-${to}`} x1={a.x + 3} y1={a.y + 3} x2={b.x + 3} y2={b.y + 3} />
                })}
              </svg>
              {nodes.map((item) => (
                <button key={item.id} className={`topology-node ${item.type} ${selectedNode === item.id ? 'selected' : ''} ${replayStep < 3 ? 'dormant' : ''}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => setSelectedNode(item.id)} aria-label={`Inspect ${item.label}`}>
                  <span>{item.type === 'hub' ? <Radar /> : item.type === 'source' ? <Boxes /> : item.type === 'target' ? <Target /> : <Zap />}</span>
                  <strong>{item.label}</strong><small>L{item.evidence} · Risk {item.risk}</small>
                </button>
              ))}
            </div>
            <div className="node-inspector">
              <div><span className="section-label">SELECTED ASSET</span><h3>{node.label}</h3><p>{node.note}</p></div>
              <div className="tech-list">{node.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
              <div className="risk-meter"><span>Risk</span><div>{[1, 2, 3, 4, 5].map((level) => <i key={level} className={level <= node.risk ? 'filled' : ''} />)}</div></div>
            </div>
          </div>

          <aside className="evidence-rail">
            <div className="panel-head compact"><div><span className="section-label">EVIDENCE STREAM</span><h2>What the agents know</h2></div><span className="count">{replayStep}/6</span></div>
            <div className="filter-row">
              {(['ALL', 'OBSERVED', 'INFERRED', 'UNKNOWN'] as const).map((item) => <button key={item} className={confidence === item ? 'active' : ''} onClick={() => setConfidence(item)}>{item}</button>)}
            </div>
            <div className="event-list">
              {visibleEvents.length === 0 && <div className="empty-state"><Search /><p>{replayStep === 0 ? 'Run the mission to reveal inspectable evidence.' : 'No evidence matches this filter.'}</p></div>}
              {visibleEvents.map((event) => <article className="event" key={event.time}>
                <div><time>{event.time}</time><span className={`confidence ${event.confidence.toLowerCase()}`}>{event.confidence}</span></div>
                <h3>{event.title}</h3><p>{event.detail}</p>
              </article>)}
            </div>
            <div className="replay-controls">
              <button className="icon-button" onClick={resetReplay} title="Reset replay"><RotateCcw size={17} /></button>
              <button className="primary play" onClick={() => replayStep >= evidenceEvents.length ? resetReplay() : setPlaying((state) => !state)}>{playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}{playing ? 'Pause' : replayStep >= 6 ? 'Replay' : 'Continue'}</button>
            </div>
          </aside>
        </section>

        <section className="agent-detail">
          <div className="agent-identity"><span className="large-order">{agent.order}</span><div><span className="section-label">{agent.role.toUpperCase()} AGENT</span><h2>{agent.name}</h2><p>{agent.description}</p></div></div>
          <div><span className="section-label">READS</span>{agent.reads.map((item) => <p className="capability" key={item}><ArrowRight size={14} />{item}</p>)}</div>
          <div><span className="section-label">PRODUCES</span>{agent.produces.map((item) => <p className="capability" key={item}><FileCheck2 size={14} />{item}</p>)}</div>
          <div className="boundary"><ShieldCheck /><div><span className="section-label">CONTROL BOUNDARY</span><p>{agent.boundary}</p></div></div>
        </section>

        <section className="gate-band">
          <div className="gate-icon"><UserCheck /></div>
          <div><span className="section-label">HUMAN STAGE GATE · G1</span><h2>Is the evidence sufficient to begin deep analysis?</h2><p>Runtime evidence and business ownership remain unresolved. The governance agent can verify readiness; only the customer approves progression.</p></div>
          <div className="gate-actions">
            {gateState === 'waiting' ? <><button className="secondary" onClick={() => setGateState('challenged')}><CircleHelp size={16} /> Request evidence</button><button className="primary" onClick={() => setGateState('approved')}><Check size={16} /> Approve bounded scope</button></> :
              <div className={`gate-result ${gateState}`}><strong>{gateState === 'approved' ? 'Scope approved' : 'Evidence requested'}</strong><span>{gateState === 'approved' ? 'Decision recorded with conditions.' : 'Programme paused at Gate G1.'}</span><button onClick={() => setGateState('waiting')}><X size={14} /> Clear</button></div>}
          </div>
        </section>
      </main>}

      {view === 'agents' && <AgentsView onSelect={(id) => { setSelectedAgent(id); changeView('mission') }} />}
      {view === 'packs' && <PacksView />}
      {view === 'outcomes' && <OutcomesView />}
      <footer><span>CopilotWith · Governed agentic modernisation</span><span>Replay data is illustrative and derived from anonymised repository samples · September 2026</span></footer>
    </div>
  )
}

function AgentsView({ onSelect }: { onSelect: (id: string) => void }) {
  return <main className="library-page"><div className="library-intro"><span className="eyebrow">THE GOVERNED TEAM</span><h1>Specialists with explicit jobs, evidence, and boundaries.</h1><p>Each agent owns one part of the programme. No agent can discover, decide, implement, review, and approve its own work.</p></div><div className="agent-grid">{agents.map((agent) => <button key={agent.id} className="agent-card" onClick={() => onSelect(agent.id)}><div><span>{agent.order}</span><Bot /></div><small>{agent.role}</small><h2>{agent.name}</h2><p>{agent.description}</p><strong>{agent.verb} <ArrowRight size={15} /></strong></button>)}</div></main>
}

function PacksView() {
  return <main className="library-page"><div className="library-intro"><span className="eyebrow">SCENARIO ACCELERATORS</span><h1>One governance model. Many modernisation missions.</h1><p>Agent packs adapt the common spine to a technology, estate, or transformation problem.</p></div><div className="pack-list">{packs.map(([name, count, maturity], index) => <article key={name}><span className="pack-index">0{index + 1}</span><div><h2>{name}</h2><p>{count} · {maturity}</p></div><Network /><ChevronRight /></article>)}</div></main>
}

function OutcomesView() {
  const outcomes = [
    ['Unknown → Legible', 'Build an evidence-linked view of systems, interfaces, rules, risks, and ownership.'],
    ['Spreadsheet → Programme twin', 'Keep topology, findings, migration waves, and decisions connected as the estate changes.'],
    ['Big bang → Bounded slices', 'Implement one approved, reversible change at a time behind test and human gates.'],
    ['Opinion → Defensible evidence', 'Separate observed facts, inferences, assumptions, unknowns, and SME confirmation.'],
  ]
  return <main className="library-page"><div className="library-intro"><span className="eyebrow">THE PROGRAMME SHIFT</span><h1>Move from estate archaeology to evidence-led change.</h1><p>Value comes from making uncertainty, dependencies, decisions, and delivery evidence visible as one continuous system.</p></div><div className="outcome-grid">{outcomes.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><Sparkles /><h2>{title}</h2><p>{text}</p></article>)}</div></main>
}

export default App
