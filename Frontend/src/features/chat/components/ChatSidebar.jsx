import React, { useState, useEffect, useRef } from 'react'
import { LogoIcon, IconBtn, ConfirmModal } from './DashboardUI'



const SettingsRow = ({ icon, label, onClick, danger }) => {
  const [h, setH] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 12px',
        borderRadius: 11,
        marginBottom: 5,
        border: danger
          ? '1px solid rgba(239,68,68,0.14)'
          : '1px solid rgba(255,255,255,0.07)',
        background: h
          ? danger
            ? 'rgba(239,68,68,0.06)'
            : 'rgba(255,255,255,0.04)'
          : 'transparent',
        cursor: 'pointer',
        transition: 'all .16s',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          width: 33,
          height: 33,
          borderRadius: 8,
          flexShrink: 0,
          background: danger
            ? 'rgba(239,68,68,0.1)'
            : 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i
          className={icon}
          style={{
            fontSize: 15,
            color: danger ? '#f87171' : '#a1a1aa',
          }}
        />
      </div>

      <span
        style={{
          color: danger ? '#f87171' : '#a1a1aa',
          fontSize: 13,
          fontWeight: 500,
          flex: 1,
        }}
      >
        {label}
      </span>

      <i
        className="ri-arrow-right-s-line"
        style={{
          color: danger ? 'rgba(239,68,68,0.35)' : '#3f3f46',
          fontSize: 16,
        }}
      />
    </button>
  )
}

const SettingsModal = ({
  open,
  onClose,
  user,
  onLogout,
  onDeleteAccount,
}) => {
  const [showLogout, setShowLogout] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  if (!open) return null

  const init = (user?.username || 'Z').charAt(0).toUpperCase()

  return (
    <>
      {/* MAIN MODAL */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {/* BACKDROP */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,.72)',
            backdropFilter: 'blur(6px)',
          }}
          onClick={onClose}
        />

        {/* PANEL */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 440,
            background: '#151515',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '20px 20px 0 0',
            boxShadow: '0 -16px 50px rgba(0,0,0,.5)',
            overflow: 'hidden',
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '13px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <span style={{ color: '#ececec', fontWeight: 600 }}>
              Settings
            </span>
            <IconBtn
              onClick={onClose}
              icon="ri-close-line"
              title="Close"
            />
          </div>

          {/* BODY */}
          <div style={{ padding: '14px 18px 32px' }}>
            {/* USER INFO */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 13,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#ececec',
                }}
              >
                {init}
              </div>

              <div>
                <div style={{ color: '#ececec' }}>
                  {user?.username || 'User'}
                </div>
                <div style={{ color: '#71717a', fontSize: 12 }}>
                  @{(user?.username || 'user').toLowerCase()}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <SettingsRow
              icon="ri-logout-box-r-line"
              label="Logout"
              onClick={() => setShowLogout(true)}
            />

            <SettingsRow
              icon="ri-delete-bin-6-line"
              label="Delete Account"
              danger
              onClick={() => setShowDelete(true)}
            />
          </div>
        </div>
      </div>

      {/* LOGOUT CONFIRM */}
      <ConfirmModal
        open={showLogout}
        title="Logout?"
        message="You'll be signed out."
        confirmText="Logout"
        onConfirm={() => {
          setShowLogout(false)
          onLogout?.()   // ✅ FIX (no crash)
          onClose()
        }}
        onCancel={() => setShowLogout(false)}
      />

      {/* DELETE CONFIRM */}
      <ConfirmModal
        open={showDelete}
        title="Delete Account?"
        message="This action is permanent."
        confirmText="Delete"
        danger
        onConfirm={() => {
          setShowDelete(false)
          onDeleteAccount?.()   // ✅ FIX
          onClose()
        }}
        onCancel={() => setShowDelete(false)}
      />
    </>
  )
}

export default SettingsModal

const AboutModal = ({ open, onClose }) => {
  if (!open) return null
  return (
    <div style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.75)',backdropFilter:'blur(6px)'}} onClick={onClose}/>
      <div style={{position:'relative',width:'100%',maxWidth:340,margin:'0 20px',background:'#151515',border:'1px solid rgba(255,255,255,0.09)',borderRadius:18,boxShadow:'0 25px 60px rgba(0,0,0,.7)',overflow:'hidden',animation:'scaleIn .18s ease'}}>
        <div style={{padding:'26px 22px 22px',textAlign:'center'}}>
          <div style={{width:58,height:58,margin:'0 auto 14px',borderRadius:16,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}><LogoIcon size={26}/></div>
          <h2 style={{color:'#ececec',fontWeight:700,fontSize:20,marginBottom:4}}>Zerio AI</h2>
          <p style={{color:'#52525b',fontSize:12,marginBottom:14}}>v1.0.0 — Smart answers, instantly</p>
          <p style={{color:'#a1a1aa',fontSize:13,lineHeight:1.65,marginBottom:18}}>Zerio combines powerful LLMs with real-time internet access to deliver accurate, up-to-date answers.</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:5,justifyContent:'center',marginBottom:18}}>
            {['React','Node.js','MongoDB','Socket.io','Gemini AI'].map(t=>(
              <span key={t} style={{fontSize:11,padding:'3px 9px',borderRadius:6,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#a1a1aa'}}>{t}</span>
            ))}
          </div>
          <div style={{padding:'12px 14px',borderRadius:11,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',textAlign:'left',marginBottom:16}}>
            <p style={{color:'#52525b',fontSize:10,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8}}>Developer</p>
            <p style={{color:'#ececec',fontWeight:500,fontSize:13,marginBottom:8}}>Your Name Here</p>
            <div style={{display:'flex',gap:16}}>
              <a href="https://github.com/yourhandle" target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:5,color:'#a1a1aa',fontSize:12,textDecoration:'none'}}><i className="ri-github-fill" style={{fontSize:14}}/> GitHub</a>
              <a href="https://linkedin.com/in/yourhandle" target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:5,color:'#a1a1aa',fontSize:12,textDecoration:'none'}}><i className="ri-linkedin-box-fill" style={{fontSize:14}}/> LinkedIn</a>
            </div>
          </div>
          <button onClick={onClose} style={{width:'100%',padding:'10px',borderRadius:11,border:'1px solid rgba(255,255,255,0.08)',background:'transparent',color:'#a1a1aa',fontSize:13,cursor:'pointer'}}>Close</button>
        </div>
      </div>
    </div>
  )
}

export const SearchModal = ({ open, onClose, chats, onSelectChat, onNewChat }) => {
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)
  useEffect(() => {
    if (open) { setSearch(''); setTimeout(() => inputRef.current?.focus(), 60) }
  }, [open])

  if (!open) return null

  const arr = Object.values(chats)
  const filtered = search ? arr.filter(c => c.title.toLowerCase().includes(search.toLowerCase())) : arr
  const today = new Date(); today.setHours(0,0,0,0)
  const g = { today: [], yesterday: [], week: [], month: [] }

  filtered.forEach(c => {
    const d = new Date(c.lastUpdated||Date.now()); d.setHours(0,0,0,0)
    const diff = Math.round((today-d)/86400000)
    if (diff === 0) g.today.push(c)
    else if (diff === 1) g.yesterday.push(c)
    else if (diff <= 7) g.week.push(c)
    else if (diff <= 30) g.month.push(c)
  })

  const ChatRow = ({ chat }) => {
    const [h, setH] = useState(false)
    return (
      <div onClick={() => { onSelectChat(chat.id); onClose() }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',cursor:'pointer',background:h?'rgba(255,255,255,0.06)':'transparent',borderRadius:8,margin:'0 6px',transition:'all .12s'}}>
        <i className="ri-chat-3-line" style={{fontSize:15,color:'#71717a',flexShrink:0}}/>
        <span style={{flex:1,fontSize:14,color:'#ececec',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{chat.title}</span>
      </div>
    )
  }

  const Section = ({ label, items }) => {
    if (!items.length) return null
    return (
      <div style={{marginBottom:4}}>
        <p style={{color:'#52525b',fontSize:11,fontWeight:500,padding:'8px 14px 4px',textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</p>
        {items.map(c => <ChatRow key={c.id} chat={c}/>)}
      </div>
    )
  }

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:64}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)'}} onClick={onClose}/>
      <div style={{position:'relative',width:'100%',maxWidth:540,margin:'0 16px',background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,overflow:'hidden',boxShadow:'0 24px 60px rgba(0,0,0,0.7)',animation:'scaleIn .18s ease',maxHeight:'68vh',display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'13px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
          <i className="ri-search-line" style={{fontSize:17,color:'#71717a',flexShrink:0}}/>
          <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chats…"
            style={{flex:1,background:'transparent',border:'none',outline:'none',color:'#ececec',fontSize:15}}
            onKeyDown={e => e.key === 'Escape' && onClose()}/>
          <button onClick={onClose} style={{width:26,height:26,borderRadius:6,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'#71717a',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}>
            <i className="ri-close-line"/>
          </button>
        </div>
        <div style={{overflowY:'auto',padding:'6px 0 8px'}}>
          <div onClick={() => { onNewChat(); onClose() }}
            style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',cursor:'pointer',margin:'4px 6px',borderRadius:10,background:'rgba(255,255,255,0.06)',transition:'all .12s'}}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}>
            <div style={{width:30,height:30,borderRadius:8,background:'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <i className="ri-edit-line" style={{fontSize:15,color:'#ececec'}}/>
            </div>
            <span style={{fontSize:14,color:'#ececec',fontWeight:500}}>New chat</span>
          </div>
          <div style={{height:1,background:'rgba(255,255,255,0.06)',margin:'6px 0'}}/>
          {filtered.length > 0 ? (
            <>
              <Section label="Today" items={g.today}/>
              <Section label="Yesterday" items={g.yesterday}/>
              <Section label="This Week" items={g.week}/>
              <Section label="Last 30 Days" items={g.month}/>
            </>
          ) : (
            <div style={{textAlign:'center',padding:'32px 0',color:'#52525b'}}>
              <i className="ri-history-line" style={{fontSize:22,display:'block',marginBottom:8}}/>
              <p style={{fontSize:13}}>{search ? 'No chats found' : 'No chats yet'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const HistoryItem = ({ chat, onSelectChat, onDeleteChat, onClose }) => {
  const [h, setH] = useState(false)
  const date = new Date(chat.lastUpdated || Date.now())
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{display:'flex',alignItems:'center',gap:10,padding:'9px 16px',cursor:'pointer',background:h?'rgba(255,255,255,0.04)':'transparent',borderBottom:'1px solid rgba(255,255,255,0.03)',transition:'all .12s'}}>
      <div style={{width:30,height:30,borderRadius:8,flexShrink:0,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <i className="ri-chat-3-line" style={{fontSize:12,color:'#3f3f46'}}/>
      </div>
      <div style={{flex:1,minWidth:0}} onClick={() => { onSelectChat(chat.id); onClose() }}>
        <p style={{color:'#d4d4d8',fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:1}}>{chat.title}</p>
        <p style={{color:'#3f3f46',fontSize:11}}>{date.toLocaleDateString('en-US',{month:'short',day:'numeric'})} · {date.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</p>
      </div>
      {h && <button onClick={e => { e.stopPropagation(); onDeleteChat(chat.id) }} style={{width:24,height:24,borderRadius:6,border:'none',background:'rgba(239,68,68,0.08)',color:'#f87171',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
        <i className="ri-delete-bin-6-line" style={{fontSize:12}}/>
      </button>}
    </div>
  )
}

const SectionGroup = ({ label, items, onSelectChat, onDeleteChat, onClose }) => {
  if (!items.length) return null
  return (
    <div>
      <div style={{padding:'8px 16px 4px',background:'#1a1a1a',position:'sticky',top:0,zIndex:1}}>
        <span style={{color:'#3f3f46',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.1em'}}>{label}</span>
      </div>
      {items.map(chat => <HistoryItem key={chat.id} chat={chat} onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onClose={onClose}/>)}
    </div>
  )
}

export const HistoryModal = ({ open, onClose, chats, onSelectChat, onDeleteChat }) => {
  if (!open) return null
  const arr = Object.values(chats).sort((a,b)=>new Date(b.lastUpdated||0)-new Date(a.lastUpdated||0))
  const today = new Date(); today.setHours(0,0,0,0)
  const grouped = { today: [], yesterday: [], week: [], month: [], older: [] }
  arr.forEach(c => {
    const d = new Date(c.lastUpdated || Date.now()); d.setHours(0,0,0,0)
    const diff = Math.round((today-d)/86400000)
    if (diff === 0) grouped.today.push(c)
    else if (diff === 1) grouped.yesterday.push(c)
    else if (diff <= 7) grouped.week.push(c)
    else if (diff <= 30) grouped.month.push(c)
    else grouped.older.push(c)
  })

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,display:'flex'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.45)',backdropFilter:'blur(3px)'}} onClick={onClose}/>
      <div style={{position:'relative',width:340,height:'100dvh',background:'#1a1a1a',borderRight:'1px solid rgba(255,255,255,0.07)',boxShadow:'4px 0 40px rgba(0,0,0,.6)',animation:'slideRight .22s ease',display:'flex',flexDirection:'column',zIndex:1}}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
          <i className="ri-history-line" style={{fontSize:16,color:'#71717a'}}/>
          <span style={{color:'#ececec',fontWeight:600,fontSize:14,flex:1}}>Chat History</span>
          <span style={{color:'#3f3f46',fontSize:12}}>{arr.length} chats</span>
          <button onClick={onClose} style={{width:26,height:26,borderRadius:7,border:'none',background:'transparent',color:'#71717a',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <i className="ri-close-line" style={{fontSize:16}}/>
          </button>
        </div>
        <div style={{flex:1,overflowY:'auto'}}>
          {arr.length === 0 ? (
            <div style={{textAlign:'center',paddingTop:60}}>
              <i className="ri-chat-off-line" style={{fontSize:26,color:'#3f3f46',display:'block',marginBottom:10}}/>
              <p style={{color:'#3f3f46',fontSize:13}}>No conversations yet</p>
            </div>
          ) : (
            <>
              <SectionGroup label="Today" items={grouped.today} onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onClose={onClose}/>
              <SectionGroup label="Yesterday" items={grouped.yesterday} onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onClose={onClose}/>
              <SectionGroup label="This Week" items={grouped.week} onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onClose={onClose}/>
              <SectionGroup label="This Month" items={grouped.month} onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onClose={onClose}/>
              <SectionGroup label="Older" items={grouped.older} onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onClose={onClose}/>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const Sidebar = ({ chats, selectedChatId, onSelectChat, onDeleteChat, onNewChat, onClose, onHistoryOpen, onSearchOpen, user, collapsed, onToggleCollapse, hideChatId, onLogout, onDeleteAccount }) => {
  const [settingsOpen, setSettings] = useState(false)
  const [aboutOpen, setAbout] = useState(false)

  const filteredChats = Object.fromEntries(Object.entries(chats).filter(([id]) => id !== hideChatId))

  const grouped = (() => {
    const arr = Object.values(filteredChats)
    const today = new Date(); today.setHours(0,0,0,0)
    const g = { today: [], yesterday: [], week: [], month: [] }
    arr.forEach(c => {
      const d = new Date(c.lastUpdated || Date.now()); d.setHours(0,0,0,0)
      const diff = Math.round((today-d)/86400000)
      if (diff === 0) g.today.push(c)
      else if (diff === 1) g.yesterday.push(c)
      else if (diff <= 7) g.week.push(c)
      else if (diff <= 30) g.month.push(c)
    })
    return g
  })()

  const ChatItem = ({ chat }) => {
    const [menu,setMenu] = useState(false)
    const [h,setH] = useState(false)
    const sel = selectedChatId === chat.id
    return (
      <div onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setMenu(false) }}
        onClick={() => { onSelectChat(chat.id); onClose?.() }} title={collapsed ? chat.title : undefined}
        style={{padding:'7px 9px',borderRadius:8,marginBottom:1,cursor:'pointer',transition:'all .12s',display:'flex',alignItems:'center',gap:8,justifyContent:collapsed?'center':'flex-start',background:sel?'rgba(255,255,255,0.08)':h?'rgba(255,255,255,0.04)':'transparent'}}>
        <i className="ri-chat-3-line" style={{fontSize:13,color:sel?'#9ca3af':'#3f3f46',flexShrink:0}}/>
        {!collapsed && <span style={{flex:1,fontSize:13,color:sel?'#ececec':'#9ca3af',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{chat.title}</span>}
        {!collapsed && (h || menu) && (
          <div style={{position:'relative',flexShrink:0}}>
            <button onClick={e => { e.stopPropagation(); setMenu(p => !p) }} style={{width:22,height:22,borderRadius:5,border:'none',background:'transparent',color:'#52525b',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>
              <i className="ri-more-2-fill"/>
            </button>
            {menu && (
              <div style={{position:'absolute',right:0,top:25,background:'#1c1c1c',border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,padding:4,zIndex:80,minWidth:105,boxShadow:'0 8px 24px rgba(0,0,0,.5)'}}>
                <button onClick={e => { e.stopPropagation(); onDeleteChat(chat.id); setMenu(false) }} style={{width:'100%',textAlign:'left',padding:'7px 10px',background:'transparent',border:'none',color:'#f87171',fontSize:12,cursor:'pointer',borderRadius:6,display:'flex',alignItems:'center',gap:5}} onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <i className="ri-delete-bin-6-line" style={{fontSize:13}}/> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const Section = ({ label, items }) => {
    if (!items.length) return null
    return (
      <div style={{marginBottom:14}}>
        {!collapsed && <p style={{color:'#3f3f46',fontSize:10,textTransform:'uppercase',letterSpacing:'.08em',padding:'0 9px',marginBottom:3}}>{label}</p>}
        {items.map(c => <ChatItem key={c.id} chat={c}/>)}
      </div>
    )
  }

  const NavBtn = ({ icon, label, onClick }) => {
    const [h, setH] = useState(false)
    return (
      <button onClick={onClick} title={label}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{width:'100%',display:'flex',alignItems:'center',gap:collapsed?0:9,padding:collapsed?'9px 0':'7px 10px',justifyContent:collapsed?'center':'flex-start',borderRadius:7,border:'none',background:h?'rgba(255,255,255,0.05)':'transparent',color:h?'#ececec':'#9ca3af',fontSize:13,cursor:'pointer',transition:'all .13s'}}>
        <i className={icon} style={{fontSize:15,flexShrink:0}}/>
        {!collapsed && <span>{label}</span>}
      </button>
    )
  }

  return (
    <div style={{width:collapsed?50:264,background:'#131313',borderRight:'1px solid rgba(255,255,255,0.07)',height:'100dvh',display:'flex',flexDirection:'column',transition:'width .2s cubic-bezier(.4,0,.2,1)',overflow:'hidden',flexShrink:0}}>
      <div style={{padding:'11px 10px 10px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:collapsed?'center':'space-between',gap:6}}>
        {!collapsed && (
          <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:0}}>
            <LogoIcon size={30}/>
            <span style={{color:'#ececec',fontWeight:200,fontSize:17.5,letterSpacing:'-.01em',whiteSpace:'nowrap'}}>ZErio AI</span>
          </div>
        )}
        <button onClick={onToggleCollapse} title={collapsed?'Open':'Close'}
          style={{width:28,height:28,borderRadius:7,border:'none',background:'transparent',color:'#71717a',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .14s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='#ececec'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#71717a'}}>
          <i className={collapsed?'ri-sidebar-unfold-line':'ri-sidebar-fold-line'} style={{fontSize:16}}/>
        </button>
      </div>
      <div style={{padding:'5px 6px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',flexDirection:'column',gap:1}}>
        <NavBtn icon="ri-history-line" label="History" onClick={onHistoryOpen}/>
        <NavBtn icon="ri-search-line" label="Search" onClick={onSearchOpen}/>
        <NavBtn icon="ri-add-line" label="New Chat" onClick={onNewChat}/>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:collapsed?'6px 3px':'8px 6px'}}>
        <Section label="Today" items={grouped.today}/>
        <Section label="Yesterday" items={grouped.yesterday}/>
        <Section label="This Week" items={grouped.week}/>
        <Section label="Last 30 Days" items={grouped.month}/>
        {!collapsed && Object.keys(filteredChats).length === 0 && (
          <div style={{textAlign:'center',paddingTop:40}}>
            <i className="ri-chat-off-line" style={{fontSize:20,color:'#3f3f46',display:'block',marginBottom:8}}/>
            <p style={{color:'#3f3f46',fontSize:12}}>No chats yet</p>
          </div>
        )}
      </div>
      <div style={{padding:collapsed?'8px 3px':'9px 10px',borderTop:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:8,justifyContent:collapsed?'center':'flex-start'}}>
        <div onClick={() => setSettings(true)} title="Settings"
          style={{width:28,height:28,borderRadius:8,flexShrink:0,background:'rgba(255,255,255,0.09)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#ececec',cursor:'pointer'}}>
          {(user?.username||'Z').charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <>
            <span style={{flex:1,fontSize:12.5,color:'#9ca3af',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.username||'User'}</span>
            <IconBtn onClick={() => setSettings(true)} icon="ri-settings-3-line" title="Settings"/>
            <IconBtn onClick={() => setAbout(true)} icon="ri-information-line" title="About"/>
          </>
        )}
      </div>
      <SettingsModal  open={settingsOpen} 
  onClose={() => setSettings(false)} 
  user={user}
  onLogout={onLogout}
  onDeleteAccount={onDeleteAccount}/>
      <AboutModal open={aboutOpen} onClose={() => setAbout(false)}/>
    </div>
  )
}
