'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft, ArrowRight, Bell, BookOpen, Check, ChevronDown, CircleHelp, Clock3,
  Heart, Home, Lock, MessageCircle, MoreHorizontal, Play, Plus, Send, Settings2,
  Sparkles, UserRound, Users, X, Zap,
} from 'lucide-react'
import { groupSupports, initialOf, useProfile } from '@/lib/profile'
import { generateStory, type Story } from '@/lib/story'

const navItems = [
  { label: 'Home', icon: Home },
  { label: 'Stories', icon: BookOpen },
  { label: 'Requests', icon: MessageCircle },
  { label: 'Routines', icon: Clock3 },
  { label: 'Profile', icon: UserRound },
]

const situations = ['Doctor visit', 'School morning', 'New place', 'Bedtime', 'Something else']
const formats = ['Short story', 'Visual schedule', 'Practice together']
const requestTypes = [
  { label: 'Bathroom', detail: 'I need to go', color: 'yellow' },
  { label: 'Drink', detail: 'I am thirsty', color: 'blue' },
  { label: 'Break', detail: 'I need quiet', color: 'purple' },
  { label: 'Help', detail: 'Something is tricky', color: 'coral' },
]

/** "Alex" -> "Alex's", "Chris" -> "Chris'". Keeps possessive labels readable for any saved name. */
function possessive(name: string) {
  return name.endsWith('s') ? `${name}’` : `${name}’s`
}

function IconButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick?: () => void }) {
  return <button aria-label={label} onClick={onClick} className="icon-button">{children}</button>
}

function SectionTitle({ eyebrow, title, detail }: { eyebrow?: string; title: string; detail?: string }) {
  return <div className="section-title">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{detail && <p>{detail}</p>}</div>
}

export default function Page() {
  const { profile } = useProfile()
  const [active, setActive] = useState('Home')
  const [childMode, setChildMode] = useState(false)
  const [childScreen, setChildScreen] = useState<'home' | 'help' | 'sent'>('home')
  const [situation, setSituation] = useState('Doctor visit')
  const [format, setFormat] = useState('Short story')
  const [difficulty, setDifficulty] = useState('A little new')
  const [story, setStory] = useState<Story | null>(null)
  const [pendingRequest, setPendingRequest] = useState<string | null>(null)
  const [caregiverComing, setCaregiverComing] = useState(false)
  const [today, setToday] = useState('')
  const [weekday, setWeekday] = useState('')

  const childName = profile.name
  const childInitial = initialOf(profile.name)
  const caregiverName = profile.caregiverName

  useEffect(() => {
    const now = new Date()
    setToday(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    setWeekday(now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase())
  }, [])

  const openChildMode = () => { setChildMode(true); setChildScreen('home') }
  const sendRequest = (type: string) => { setPendingRequest(type); setChildScreen('sent') }
  const makeStory = () => setStory(generateStory({ situation, difficulty, format, childName }))

  if (childMode) return <ChildMode screen={childScreen} setScreen={setChildScreen} onExit={() => setChildMode(false)} coming={caregiverComing} onRequest={sendRequest} childName={childName} childInitial={childInitial} caregiverName={caregiverName} weekday={weekday} pin={profile.pin} />

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Heart size={20} fill="currentColor" /></div><span>Kindly</span></div>
        <div className="profile-mini"><div className="avatar">{childInitial}</div><div><strong>{possessive(childName)} space</strong><small>Caregiver view</small></div><ChevronDown size={15} /></div>
        <nav aria-label="Main navigation">{navItems.map(({ label, icon: Icon }) => <button key={label} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => setActive(label)} aria-label={label}><Icon size={19} /><span>{label}</span>{label === 'Requests' && pendingRequest && <b className="nav-badge">1</b>}<span className="nav-tooltip" role="tooltip">{label}</span></button>)}</nav>
        <div className="sidebar-bottom"><button className="nav-item" onClick={() => setActive('Settings')} aria-label="Settings"><Settings2 size={19} /><span>Settings</span><span className="nav-tooltip" role="tooltip">Settings</span></button><div className="made-for"><Sparkles size={16} /><span>Made for<br /><strong>more good days</strong></span></div></div>
      </aside>
      <section className="main-content">
        <header className="topbar"><div><span className="mobile-brand">Kindly</span><p className="date-label">{today}</p><h1>{active === 'Home' ? `Good morning, ${caregiverName}` : active}</h1></div><div className="top-actions"><IconButton label="Notifications"><Bell size={20} /></IconButton><div className="avatar large">{initialOf(caregiverName)}</div></div></header>
        {active === 'Home' && <HomeView openChildMode={openChildMode} story={story} makeStory={makeStory} clearStory={() => setStory(null)} situation={situation} setSituation={setSituation} format={format} setFormat={setFormat} difficulty={difficulty} setDifficulty={setDifficulty} pendingRequest={pendingRequest} setActive={setActive} childName={childName} childInitial={childInitial} />}
        {active === 'Stories' && <StoriesView openChildMode={openChildMode} story={story} childName={childName} />}
        {active === 'Requests' && <RequestsView pendingRequest={pendingRequest} coming={caregiverComing} onComing={() => setCaregiverComing(true)} childName={childName} childInitial={childInitial} />}
        {active === 'Routines' && <SimpleView icon={<Clock3 />} title="A softer rhythm" detail="Create predictable routines that leave room for the day to change." items={['Morning check-in', 'Getting ready for school', 'Wind-down time']} />}
        {active === 'Profile' && <ProfileView profile={profile} childInitial={childInitial} />}
      </section>
    </main>
  )
}

function HomeView(props: any) {
  const { openChildMode, story, makeStory, clearStory, situation, setSituation, format, setFormat, difficulty, setDifficulty, pendingRequest, setActive, childName, childInitial } = props
  return <div className="content-wrap">
    <div className="journey"><div className="journey-line" /><div className="journey-step done"><span><Check size={16} /></span><div><b>Prepare</b><small>Make a plan</small></div></div><div className="journey-step current"><span>2</span><div><b>Communicate</b><small>Find the words</small></div></div><div className="journey-step"><span>3</span><div><b>Connect</b><small>Feel understood</small></div></div></div>
    <div className="hero-grid"><div className="welcome-card"><span className="eyebrow">TODAY&apos;S LITTLE WIN</span><h2>Small steps count.</h2><p>One prepared moment can make the whole day feel easier.</p><button className="button coral" onClick={openChildMode}>Try child mode <ArrowRight size={17} /></button></div><div className="today-card"><div className="card-heading"><div><span className="eyebrow">UP NEXT</span><h3>Getting ready for school</h3></div><IconButton label="More options"><MoreHorizontal size={19} /></IconButton></div><div className="routine-row"><div className="routine-icon yellow-bg">☀</div><div><b>Morning check-in</b><small>Now · 3 steps</small></div><Play size={17} fill="currentColor" /></div><div className="routine-row"><div className="routine-icon blue-bg">◒</div><div><b>Pack my bag</b><small>8:30 AM · 5 steps</small></div><ChevronDown size={17} /></div></div></div>
    <div className="section-title split"><div><span className="eyebrow">YOUR TOOLKIT</span><h2>What would help today?</h2></div><button className="text-button" onClick={() => setActive('Stories')}>See all <ArrowRight size={16} /></button></div>
    <div className="tool-grid"><button className="tool-card peach" onClick={() => document.getElementById('prepare')?.scrollIntoView({ behavior: 'smooth' })}><div className="tool-art">✦</div><b>Prepare for a situation</b><span>Make a simple plan together</span></button><button className="tool-card lavender" onClick={openChildMode}><div className="tool-art">☁</div><b>Practice communication</b><span>Try words, pictures, or gestures</span></button><button className="tool-card mint" onClick={() => setActive('Routines')}><div className="tool-art">☼</div><b>Build a routine</b><span>Make the next step clearer</span></button></div>
    <div id="prepare" className="prepare-layout"><div className="prepare-form"><SectionTitle eyebrow="PREPARE TOGETHER" title="A little planning can help a lot." detail={`Choose a situation and we’ll make a gentle practice story for ${childName}.`} /><label>What are you getting ready for?</label><div className="chip-wrap">{situations.map((item: string) => <button key={item} type="button" className={situation === item ? 'choice selected' : 'choice'} aria-pressed={situation === item} onClick={() => setSituation(item)}>{item}</button>)}</div><label>How new does this feel?</label><div className="chip-wrap">{['I know it well', 'A little new', 'Very new'].map(item => <button key={item} type="button" className={difficulty === item ? 'choice selected' : 'choice'} aria-pressed={difficulty === item} onClick={() => setDifficulty(item)}>{item}</button>)}</div><label>What would feel best?</label><div className="format-list">{formats.map(item => <button key={item} type="button" className={format === item ? 'format selected' : 'format'} aria-pressed={format === item} onClick={() => setFormat(item)}><span className="radio" />{item}<small>{item === 'Short story' ? 'A few simple steps' : item === 'Visual schedule' ? 'See what comes next' : 'Try it side by side'}</small></button>)}</div><button className="button yellow" onClick={makeStory}><Sparkles size={17} /> Make my story</button></div><StoryPreview story={story} onClose={clearStory} openChildMode={openChildMode} childName={childName} /></div>
    <div className="recent-header"><SectionTitle eyebrow="STAY CONNECTED" title="Recent requests" /><button className="text-button" onClick={() => setActive('Requests')}>View requests <ArrowRight size={16} /></button></div><div className="request-card"><div className="request-avatar">{childInitial}</div><div><b>{pendingRequest ? pendingRequest : 'No new requests'}</b><p>{pendingRequest ? `${childName} is waiting for a response` : `When ${childName} asks for help, it will show here.`}</p></div><span className={pendingRequest ? 'status waiting' : 'status quiet'}>{pendingRequest ? 'Waiting' : 'All quiet'}</span></div>
  </div>
}

/** Shows the generated story one page at a time, or an empty state before anything is made. */
function StoryPreview({ story, onClose, openChildMode, childName }: { story: Story | null; onClose: () => void; openChildMode: () => void; childName: string }) {
  const [page, setPage] = useState(0)

  // A freshly generated story always starts from the beginning.
  useEffect(() => { setPage(0) }, [story])

  if (!story) return <div className="story-preview"><div className="empty-preview"><div className="preview-dots">✦</div><h3>Your story will appear here</h3><p>Pick a few options on the left, then make a story to practice together.</p></div></div>

  // Clamp during render: a regenerated story can be shorter than the last one,
  // and this render happens before the effect above resets the index.
  const index = Math.min(page, story.pages.length - 1)
  const current = story.pages[index]
  return <div className="story-preview">
    <div className="preview-top"><span className="eyebrow">{possessive(childName).toUpperCase()} {story.kicker}</span><button className="close-preview" onClick={onClose} aria-label="Close story preview"><X size={17} /></button></div>
    <div className="story-illustration" aria-hidden="true">{current.art}<span>✦</span></div>
    <h3>{story.title}</h3>
    <p className="story-page-heading">{current.heading}</p>
    <p className="story-body">{current.body}</p>
    <div className="story-controls">
      <button onClick={() => setPage(Math.max(0, index - 1))} disabled={index === 0} aria-label="Previous page">←</button>
      <span aria-live="polite">{index + 1} of {story.pages.length}</span>
      <button onClick={() => setPage(Math.min(story.pages.length - 1, index + 1))} disabled={index === story.pages.length - 1} aria-label="Next page">→</button>
    </div>
    <button className="button coral full" onClick={openChildMode}>Preview child mode <ArrowRight size={17} /></button>
  </div>
}

/**
 * Parent gate. A child tapping "Adult View" has to clear a PIN before the
 * caregiver dashboard opens. This keeps a child inside their own space; it is
 * not a security control (see the note on Profile.pin).
 */
function ParentGate({ pin, onPass, onCancel }: { pin: string; onPass: () => void; onCancel: () => void }) {
  const [entry, setEntry] = useState('')
  const [error, setError] = useState(false)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (entry === pin) { onPass(); return }
    setError(true)
    setEntry('')
  }

  return <div className="gate-backdrop" role="dialog" aria-modal="true" aria-labelledby="gate-title">
    <form className="gate-card" onSubmit={submit}>
      <div className="gate-icon"><Lock size={24} /></div>
      <span className="eyebrow">GROWN-UP CHECK</span>
      <h2 id="gate-title">Enter your code</h2>
      <p>This keeps the caregiver view just for you.</p>
      <input
        id="gate-pin"
        autoFocus
        type="password"
        inputMode="numeric"
        autoComplete="off"
        maxLength={8}
        value={entry}
        aria-label="Parent code"
        aria-invalid={error}
        aria-describedby={error ? 'gate-error' : undefined}
        onChange={(event) => { setEntry(event.target.value.replace(/\D/g, '')); setError(false) }}
      />
      {error && <p className="gate-error" id="gate-error" role="alert">That code did not match. Try again.</p>}
      <div className="gate-actions">
        <button type="button" className="button secondary" onClick={onCancel}>Go back</button>
        <button type="submit" className="button coral" disabled={!entry}>Unlock</button>
      </div>
    </form>
  </div>
}

function ChildMode({ screen, setScreen, onExit, coming, onRequest, childName, childInitial, caregiverName, weekday, pin }: any) {
  const [gateOpen, setGateOpen] = useState(false)
  // With no PIN saved there is nothing to check, so leave the gate out of the way.
  const requestExit = () => (pin ? setGateOpen(true) : onExit())

  return <main className="child-mode">
    <header className="child-top"><button className="child-exit" onClick={requestExit}><ArrowLeft size={20} /> Adult View</button><div className="child-avatar">{childInitial}</div></header>
    {screen === 'home' && <div className="child-home"><div className="child-greeting"><span className="eyebrow">{weekday}</span><h1>Hi {childName}!</h1><p>What would you like to do?</p></div><div className="child-cards"><button className="child-card yellow-card"><span>☀</span><b>My day</b><small>See what&apos;s next</small></button><button className="child-card blue-card"><span>☁</span><b>My stories</b><small>Practice together</small></button><button className="child-card coral-card" onClick={() => setScreen('help')}><span>♡</span><b>I need help</b><small>Ask for what you need</small></button><button className="child-card lavender-card"><span>◒</span><b>How I feel</b><small>Share my feelings</small></button></div><div className="child-footer"><span>Take your time.</span><button className="skip-button">Help <CircleHelp size={16} /></button></div></div>}
    {screen === 'help' && <div className="help-screen"><button className="back-link" onClick={() => setScreen('home')}><ArrowLeft size={17} /> Back</button><div className="child-greeting"><span className="eyebrow">I NEED HELP WITH...</span><h1>What do you need?</h1><p>Choose one. You can change your mind.</p></div><div className="help-grid">{requestTypes.map(item => <button key={item.label} className={`help-card ${item.color}`} onClick={() => onRequest(item.label)}><span>{item.label === 'Bathroom' ? '◒' : item.label === 'Drink' ? '◯' : item.label === 'Break' ? '☁' : '♡'}</span><b>{item.label}</b><small>{item.detail}</small></button>)}</div></div>}
    {screen === 'sent' && <div className="sent-screen"><div className="sent-icon">{coming ? <Check size={35} /> : <Clock3 size={35} />}</div><span className="eyebrow">{coming ? 'ON THE WAY' : 'REQUEST SENT'}</span><h1>{coming ? `${caregiverName} is coming.` : 'You asked for help.'}</h1><p>{coming ? 'You are not alone. Take a slow breath while you wait.' : 'Your grown-up knows. You can wait here or go back.'}</p><button className="button coral" onClick={() => setScreen('home')}>Back to my day <ArrowRight size={17} /></button></div>}
    {gateOpen && <ParentGate pin={pin} onPass={onExit} onCancel={() => setGateOpen(false)} />}
  </main>
}

function StoriesView({ openChildMode, story, childName }: any) { return <div className="content-wrap"><SectionTitle eyebrow={`${possessive(childName).toUpperCase()} LIBRARY`} title="Stories for everyday moments" detail="Short, gentle ways to make unfamiliar moments feel more familiar." /><div className="library-hero"><div><span className="eyebrow">FEATURED STORY</span><h2>{story ? story.title : 'A trip to the doctor'}</h2><p>Take it one step at a time. There is always a way to pause.</p><button className="button coral" onClick={openChildMode}><Play size={16} fill="currentColor" /> Read together</button></div><div className="large-art">☀</div></div><div className="story-list">{['A trip to the doctor', 'When plans change', 'Finding a quiet place'].map((x, i) => <div className="story-row" key={x}><div className={`story-thumb thumb-${i}`}>{i === 0 ? '♡' : i === 1 ? '↻' : '☁'}</div><div><b>{x}</b><small>{i + 3} pages · 2 min</small></div><ArrowRight size={17} /></div>)}</div></div> }

function RequestsView({ pendingRequest, coming, onComing, childName, childInitial }: any) {
  const request = requestTypes.find((item) => item.label === pendingRequest)
  return <div className="content-wrap"><SectionTitle eyebrow="STAY CONNECTED" title="Requests" detail={`A calm place to notice what ${childName} is communicating.`} />{pendingRequest ? <div className="inbox-card"><div className="request-avatar">{childInitial}</div><div className="inbox-main"><div className="inbox-title"><b>{childName} needs help</b><span className="status waiting">{coming ? 'Coming' : 'Waiting'}</span></div><h3>{pendingRequest}</h3><p>{request ? request.detail : 'Sent just now'} · {childName} is waiting for a response</p><div className="inbox-actions"><button className="button coral" onClick={onComing}><Check size={16} /> I&apos;m coming</button><button className="button secondary">Not right now</button></div></div></div> : <div className="blank-state"><div className="blank-icon"><MessageCircle size={25} /></div><h3>All quiet for now</h3><p>New requests from {childName} will appear here.</p></div>}</div>
}

function SimpleView({ icon, title, detail, items }: any) { return <div className="content-wrap"><SectionTitle eyebrow="ROUTINES" title={title} detail={detail} /><div className="routine-list">{items.map((item: string, i: number) => <div className="routine-large" key={item}><div className="routine-icon yellow-bg">{icon}</div><div><b>{item}</b><small>{i === 0 ? 'Every weekday · 7:30 AM' : 'A gentle sequence of steps'}</small></div><ChevronDown size={18} /></div>)}<button className="button yellow"><Plus size={17} /> Add a routine</button></div></div> }

function ProfileView({ profile, childInitial }: any) {
  const { sensory, communication } = groupSupports(profile.supports)
  const name = profile.name
  return <div className="content-wrap">
    <SectionTitle eyebrow={`${possessive(name).toUpperCase()} PROFILE`} title={`What helps ${name} feel safe`} detail="These preferences are here to guide every little moment." />
    <div className="profile-card">
      <div className="profile-banner"><div className="avatar profile-avatar">{childInitial}</div><div><h2>{name}</h2><p>Curious, thoughtful, and growing every day.</p></div><a className="button secondary" href="/onboarding">Edit profile</a></div>
      <div className="preference-grid">
        <div><span className="eyebrow">SENSORY PREFERENCES</span><h3>Things that help</h3>{sensory.length ? <div className="preference-tags">{sensory.map((item: string) => <span key={item}>{item}</span>)}</div> : <p className="preference-empty">No sensory supports chosen yet.</p>}</div>
        <div><span className="eyebrow">COMMUNICATION</span><h3>{possessive(name)} ways</h3>{communication.length ? <div className="preference-tags">{communication.map((item: string) => <span key={item}>{item}</span>)}</div> : <p className="preference-empty">No communication supports chosen yet.</p>}</div>
      </div>
    </div>
  </div>
}
