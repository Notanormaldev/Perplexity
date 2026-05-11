import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { usechat } from '../hook/usechat'
import { setcurrentchatid, setchats } from '../chat.slice'
import 'remixicon/fonts/remixicon.css'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const GlobalStyles = () => (
  <style>{`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0d0d0d;color:#ececec}
    input,textarea,button{font-family:inherit}
    ::-webkit-scrollbar{display:none}
    *{scrollbar-width:none;-ms-overflow-style:none}
    @keyframes bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-5px);opacity:1}}
    @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
    @keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
    .ai-msg p{margin-bottom:10px;line-height:1.72}
    .ai-msg p:last-child{margin-bottom:0}
    .ai-msg code{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);padding:2px 6px;border-radius:5px;font-size:.865em;color:#e4e4e7;font-family:'JetBrains Mono',monospace}
    .ai-msg pre{background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px 16px;margin:12px 0;overflow-x:auto}
    .ai-msg pre code{background:none;border:none;padding:0;color:#e4e4e7;font-size:13px}
    .ai-msg h1,.ai-msg h2,.ai-msg h3{color:#ececec;font-weight:600;margin:16px 0 8px}
    .ai-msg ul,.ai-msg ol{padding-left:20px;margin:8px 0}
    .ai-msg li{margin-bottom:4px}
    .ai-msg strong{color:#ececec;font-weight:600}
    .ai-msg a{color:#a1a1aa;text-decoration:underline}
    .ai-msg blockquote{border-left:2px solid rgba(255,255,255,0.18);padding-left:14px;margin:8px 0;color:#a1a1aa}
    .ai-msg table{width:100%;border-collapse:collapse;margin:12px 0;font-size:13px}
    .ai-msg th,.ai-msg td{padding:8px 12px;border:1px solid rgba(255,255,255,0.08);text-align:left}
    .ai-msg th{background:rgba(255,255,255,0.04);color:#ececec}
    .ai-msg hr{border:none;border-top:1px solid rgba(255,255,255,0.08);margin:16px 0}
    @media(max-width:768px){.desktop-sidebar{display:none!important}.mobile-topbar{display:flex!important}}
    @media(min-width:769px){.mobile-topbar{display:none!important}}
  `}</style>
)

const LogoIcon = ({ size=22 }) => (
  <div style={{maskImage:'linear-gradient(to bottom,white 40%,transparent 100%)',WebkitMaskImage:'linear-gradient(to bottom,white 40%,transparent 100%)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
    <i className="ri-ancient-gate-line" style={{fontSize:size,color:'#9ca3af'}}/>
  </div>
)

const IconBtn = ({ onClick, icon, title }) => {
  const [h,setH]=useState(false)
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:30,height:30,borderRadius:7,border:'none',background:h?'rgba(255,255,255,0.08)':'transparent',color:h?'#ececec':'#71717a',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .14s',flexShrink:0}}>
      <i className={icon} style={{fontSize:15}}/>
    </button>
  )
}

const ConfirmModal = ({ open, title, message, confirmText='Confirm', onConfirm, onCancel, danger }) => {
  if(!open) return null
  return (
    <div style={{position:'fixed',inset:0,zIndex:300,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.8)',backdropFilter:'blur(6px)'}} onClick={onCancel}/>
      <div style={{position:'relative',background:'#1c1c1c',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:'22px',width:'100%',maxWidth:340,margin:'0 20px',boxShadow:'0 25px 60px rgba(0,0,0,.7)',animation:'scaleIn .18s ease'}}>
        <h3 style={{color:'#ececec',fontSize:16,fontWeight:600,marginBottom:8}}>{title}</h3>
        <p style={{color:'#a1a1aa',fontSize:13,lineHeight:1.55,marginBottom:22}}>{message}</p>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button onClick={onCancel} style={{padding:'8px 16px',borderRadius:8,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'#a1a1aa',fontSize:13,cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Cancel</button>
          <button onClick={onConfirm} style={{padding:'8px 16px',borderRadius:8,border:danger?'1px solid rgba(239,68,68,0.35)':'1px solid rgba(255,255,255,0.18)',background:danger?'rgba(239,68,68,0.14)':'rgba(255,255,255,0.08)',color:danger?'#f87171':'#ececec',fontSize:13,fontWeight:500,cursor:'pointer'}}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}

const SettingsRow = ({ icon, label, onClick, danger }) => {
  const [h,setH]=useState(false)
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'11px 12px',borderRadius:11,marginBottom:5,border:danger?'1px solid rgba(239,68,68,0.14)':'1px solid rgba(255,255,255,0.07)',background:h?(danger?'rgba(239,68,68,0.06)':'rgba(255,255,255,0.04)'):'transparent',cursor:'pointer',transition:'all .16s',textAlign:'left'}}>
      <div style={{width:33,height:33,borderRadius:8,flexShrink:0,background:danger?'rgba(239,68,68,0.1)':'rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <i className={icon} style={{fontSize:15,color:danger?'#f87171':'#a1a1aa'}}/>
      </div>
      <span style={{color:danger?'#f87171':'#a1a1aa',fontSize:13,fontWeight:500,flex:1}}>{label}</span>
      <i className="ri-arrow-right-s-line" style={{color:danger?'rgba(239,68,68,0.35)':'#3f3f46',fontSize:16}}/>
    </button>
  )
}

const SettingsModal = ({ open, onClose, user }) => {
  const [showLogout,setShowLogout]=useState(false)
  const [showDelete,setShowDelete]=useState(false)
  if(!open) return null
  const init=(user?.username||'Z').charAt(0).toUpperCase()
  return (
    <>
      <div style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.72)',backdropFilter:'blur(6px)'}} onClick={onClose}/>
        <div style={{position:'relative',width:'100%',maxWidth:440,background:'#151515',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'20px 20px 0 0',boxShadow:'0 -16px 50px rgba(0,0,0,.5)',overflow:'hidden',animation:'fadeIn .24s ease'}}>
          <div style={{display:'flex',justifyContent:'center',padding:'10px 0 0'}}>
            <div style={{width:36,height:4,borderRadius:4,background:'rgba(255,255,255,0.12)'}}/>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 18px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
            <span style={{color:'#ececec',fontWeight:600,fontSize:15}}>Settings</span>
            <IconBtn onClick={onClose} icon="ri-close-line"/>
          </div>
          <div style={{padding:'14px 18px 32px'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:13,marginBottom:12}}>
              <div style={{width:46,height:46,borderRadius:12,flexShrink:0,background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:700,color:'#ececec'}}>{init}</div>
              <div style={{minWidth:0}}>
                <div style={{color:'#ececec',fontWeight:500,fontSize:14,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.username||'User'}</div>
                <div style={{color:'#71717a',fontSize:12,marginTop:1}}>@{(user?.username||'user').toLowerCase()}</div>
                <div style={{color:'#71717a',fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email||'•••@zerio.ai'}</div>
              </div>
            </div>
            <SettingsRow icon="ri-logout-box-r-line" label="Logout" onClick={()=>setShowLogout(true)}/>
            <SettingsRow icon="ri-delete-bin-6-line" label="Delete Account" onClick={()=>setShowDelete(true)} danger/>
            <p style={{color:'#3f3f46',fontSize:11,textAlign:'center',marginTop:18}}>Zerio AI • v1.0.0</p>
          </div>
        </div>
      </div>
      <ConfirmModal open={showLogout} title="Logout?" message="You'll be signed out from Zerio AI." confirmText="Logout" onConfirm={()=>setShowLogout(false)} onCancel={()=>setShowLogout(false)}/>
      <ConfirmModal open={showDelete} title="Delete Account?" message="Permanent. All chats and data will be erased." confirmText="Delete" danger onConfirm={()=>setShowDelete(false)} onCancel={()=>setShowDelete(false)}/>
    </>
  )
}

const AboutModal = ({ open, onClose }) => {
  if(!open) return null
  return (
    <div style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.75)',backdropFilter:'blur(6px)'}} onClick={onClose}/>
      <div style={{position:'relative',width:'100%',maxWidth:340,margin:'0 20px',background:'#151515',border:'1px solid rgba(255,255,255,0.09)',borderRadius:18,boxShadow:'0 25px 60px rgba(0,0,0,.7)',overflow:'hidden',animation:'scaleIn .18s ease'}}>
        <div style={{padding:'26px 22px 22px',textAlign:'center'}}>
          <div style={{width:58,height:58,margin:'0 auto 14px',borderRadius:16,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <LogoIcon size={26}/>
          </div>
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
          <button onClick={onClose} style={{width:'100%',padding:'10px',borderRadius:11,border:'1px solid rgba(255,255,255,0.08)',background:'transparent',color:'#a1a1aa',fontSize:13,cursor:'pointer',transition:'all .16s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ── Search / History Modal ──
const SearchModal = ({ open, onClose, chats, onSelectChat, onNewChat }) => {
  const [search,setSearch]=useState('')
  const inputRef=useRef(null)
  useEffect(()=>{ if(open){setSearch('');setTimeout(()=>inputRef.current?.focus(),60)} },[open])
  if(!open) return null

  const arr=Object.values(chats)
  const filtered=search?arr.filter(c=>c.title.toLowerCase().includes(search.toLowerCase())):arr
  const today=new Date();today.setHours(0,0,0,0)
  const g={today:[],yesterday:[],week:[],month:[]}
  filtered.forEach(c=>{
    const d=new Date(c.lastUpdated||Date.now());d.setHours(0,0,0,0)
    const diff=Math.round((today-d)/86400000)
    if(diff===0)g.today.push(c)
    else if(diff===1)g.yesterday.push(c)
    else if(diff<=7)g.week.push(c)
    else if(diff<=30)g.month.push(c)
  })

  const ChatRow=({chat})=>{
    const [h,setH]=useState(false)
    return(
      <div onClick={()=>{onSelectChat(chat.id);onClose()}}
        onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',cursor:'pointer',background:h?'rgba(255,255,255,0.06)':'transparent',borderRadius:8,margin:'0 6px',transition:'all .12s'}}>
        <i className="ri-chat-3-line" style={{fontSize:15,color:'#71717a',flexShrink:0}}/>
        <span style={{flex:1,fontSize:14,color:'#ececec',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{chat.title}</span>
      </div>
    )
  }

  const Section=({label,items})=>{
    if(!items.length)return null
    return(
      <div style={{marginBottom:4}}>
        <p style={{color:'#52525b',fontSize:11,fontWeight:500,padding:'8px 14px 4px',textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</p>
        {items.map(c=><ChatRow key={c.id} chat={c}/>)}
      </div>
    )
  }

  return(
    <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:64}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)'}} onClick={onClose}/>
      <div style={{position:'relative',width:'100%',maxWidth:540,margin:'0 16px',background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,overflow:'hidden',boxShadow:'0 24px 60px rgba(0,0,0,0.7)',animation:'scaleIn .18s ease',maxHeight:'68vh',display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'13px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
          <i className="ri-search-line" style={{fontSize:17,color:'#71717a',flexShrink:0}}/>
          <input ref={inputRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chats…"
            style={{flex:1,background:'transparent',border:'none',outline:'none',color:'#ececec',fontSize:15}}
            onKeyDown={e=>e.key==='Escape'&&onClose()}/>
          <button onClick={onClose} style={{width:26,height:26,borderRadius:6,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'#71717a',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}>
            <i className="ri-close-line"/>
          </button>
        </div>
        <div style={{overflowY:'auto',padding:'6px 0 8px'}}>
          <div onClick={()=>{onNewChat();onClose()}}
            style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',cursor:'pointer',margin:'4px 6px 4px',borderRadius:10,background:'rgba(255,255,255,0.06)',transition:'all .12s'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}>
            <div style={{width:30,height:30,borderRadius:8,background:'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <i className="ri-edit-line" style={{fontSize:15,color:'#ececec'}}/>
            </div>
            <span style={{fontSize:14,color:'#ececec',fontWeight:500}}>New chat</span>
          </div>
          <div style={{height:1,background:'rgba(255,255,255,0.06)',margin:'6px 0'}}/>
          {filtered.length>0?(
            <>
              <Section label="Today" items={g.today}/>
              <Section label="Yesterday" items={g.yesterday}/>
              <Section label="This Week" items={g.week}/>
              <Section label="Last 30 Days" items={g.month}/>
            </>
          ):(
            <div style={{textAlign:'center',padding:'32px 0',color:'#52525b'}}>
              <i className="ri-history-line" style={{fontSize:22,display:'block',marginBottom:8}}/>
              <p style={{fontSize:13}}>{search?'No chats found':'No chats yet'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── SIDEBAR — Collapsible ──
const Sidebar = ({ chats, selectedChatId, onSelectChat, onDeleteChat, onNewChat, onClose, onSearchOpen, user, collapsed, onToggleCollapse }) => {
  const [settingsOpen,setSettings]=useState(false)
  const [aboutOpen,setAbout]=useState(false)

  const grouped=(()=>{
    const arr=Object.values(chats)
    const today=new Date();today.setHours(0,0,0,0)
    const g={today:[],yesterday:[],week:[],month:[]}
    arr.forEach(c=>{
      const d=new Date(c.lastUpdated||Date.now());d.setHours(0,0,0,0)
      const diff=Math.round((today-d)/86400000)
      if(diff===0)g.today.push(c)
      else if(diff===1)g.yesterday.push(c)
      else if(diff<=7)g.week.push(c)
      else if(diff<=30)g.month.push(c)
    })
    return g
  })()

  const ChatItem=({chat})=>{
    const [menu,setMenu]=useState(false)
    const [h,setH]=useState(false)
    const sel=selectedChatId===chat.id
    return(
      <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setMenu(false)}}
        onClick={()=>{onSelectChat(chat.id);onClose?.()}}
        title={collapsed?chat.title:undefined}
        style={{padding:'8px 10px',borderRadius:8,marginBottom:1,cursor:'pointer',transition:'all .12s',display:'flex',alignItems:'center',gap:8,justifyContent:collapsed?'center':'flex-start',background:sel?'rgba(255,255,255,0.08)':h?'rgba(255,255,255,0.05)':'transparent'}}>
        <i className="ri-chat-3-line" style={{fontSize:13,color:sel?'#a1a1aa':'#52525b',flexShrink:0}}/>
        {!collapsed&&<span style={{flex:1,fontSize:13,color:sel?'#ececec':'#a1a1aa',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{chat.title}</span>}
        {!collapsed&&(h||menu)&&(
          <div style={{position:'relative',flexShrink:0}}>
            <button onClick={e=>{e.stopPropagation();setMenu(p=>!p)}} style={{width:22,height:22,borderRadius:5,border:'none',background:'transparent',color:'#71717a',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>
              <i className="ri-more-2-fill"/>
            </button>
            {menu&&(
              <div style={{position:'absolute',right:0,top:25,background:'#1c1c1c',border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,padding:4,zIndex:80,minWidth:105,boxShadow:'0 8px 24px rgba(0,0,0,.5)'}}>
                <button onClick={e=>{e.stopPropagation();onDeleteChat(chat.id);setMenu(false)}} style={{width:'100%',textAlign:'left',padding:'7px 10px',background:'transparent',border:'none',color:'#f87171',fontSize:12,cursor:'pointer',borderRadius:6,display:'flex',alignItems:'center',gap:5}} onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <i className="ri-delete-bin-6-line" style={{fontSize:13}}/> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const Section=({label,items})=>{
    if(!items.length)return null
    return(
      <div style={{marginBottom:16}}>
        {!collapsed&&<p style={{color:'#52525b',fontSize:10,textTransform:'uppercase',letterSpacing:'.08em',padding:'0 10px',marginBottom:4}}>{label}</p>}
        {items.map(c=><ChatItem key={c.id} chat={c}/>)}
      </div>
    )
  }

  const NavBtn=({icon,label,onClick})=>{
    const [h,setH]=useState(false)
    return(
      <button onClick={onClick} title={label}
        onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{width:'100%',display:'flex',alignItems:'center',gap:collapsed?0:10,padding:collapsed?'9px 0':'8px 10px',justifyContent:collapsed?'center':'flex-start',borderRadius:8,border:'none',background:h?'rgba(255,255,255,0.05)':'transparent',color:h?'#ececec':'#a1a1aa',fontSize:13,cursor:'pointer',transition:'all .14s'}}>
        <i className={icon} style={{fontSize:16,flexShrink:0}}/>
        {!collapsed&&<span>{label}</span>}
      </button>
    )
  }

  return(
    <div style={{width:collapsed?56:268,background:'#131313',borderRight:'1px solid rgba(255,255,255,0.07)',height:'100dvh',display:'flex',flexDirection:'column',transition:'width .22s cubic-bezier(.4,0,.2,1)',overflow:'hidden',flexShrink:0}}>

      {/* Header */}
      <div style={{padding:'13px 12px 11px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:collapsed?'center':'space-between',gap:8}}>
        {!collapsed&&(
          <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:0}}>
            <LogoIcon size={18}/>
            <span style={{color:'#ececec',fontWeight:700,fontSize:14,letterSpacing:'-.01em',whiteSpace:'nowrap'}}>ZErio AI</span>
          </div>
        )}
        <button onClick={onToggleCollapse} title={collapsed?'Open sidebar':'Close sidebar'}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.color='#ececec'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#71717a'}}
          style={{width:30,height:30,borderRadius:7,border:'none',background:'transparent',color:'#71717a',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .14s'}}>
          <i className={collapsed?'ri-sidebar-unfold-line':'ri-sidebar-fold-line'} style={{fontSize:17}}/>
        </button>
      </div>

      {/* Nav: History → Search → New Chat */}
      <div style={{padding:'6px 8px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',flexDirection:'column',gap:1}}>
        {/* History — opens search/history modal */}
        <NavBtn icon="ri-history-line" label="History" onClick={onSearchOpen}/>
        {/* Search — opens search modal */}
        <NavBtn icon="ri-search-line" label="Search" onClick={onSearchOpen}/>
        {/* New Chat */}
        <NavBtn icon="ri-add-line" label="New Chat" onClick={onNewChat}/>
      </div>

      {/* Chat List */}
      <div style={{flex:1,overflowY:'auto',padding:collapsed?'8px 4px':'10px 8px'}}>
        <Section label="Today" items={grouped.today}/>
        <Section label="Yesterday" items={grouped.yesterday}/>
        <Section label="This Week" items={grouped.week}/>
        <Section label="Last 30 Days" items={grouped.month}/>
        {!collapsed&&Object.keys(chats).length===0&&(
          <div style={{textAlign:'center',paddingTop:40}}>
            <i className="ri-chat-off-line" style={{fontSize:22,color:'#3f3f46',display:'block',marginBottom:8}}/>
            <p style={{color:'#52525b',fontSize:12}}>No chats yet</p>
          </div>
        )}
      </div>

      {/* User Bottom */}
      <div style={{padding:collapsed?'10px 4px':'10px 12px',borderTop:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:10,justifyContent:collapsed?'center':'flex-start'}}>
        <div onClick={()=>setSettings(true)} title="Settings"
          style={{width:30,height:30,borderRadius:8,flexShrink:0,background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#ececec',cursor:'pointer'}}>
          {(user?.username||'Z').charAt(0).toUpperCase()}
        </div>
        {!collapsed&&(
          <>
            <span style={{flex:1,fontSize:13,color:'#a1a1aa',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.username||'User'}</span>
            <IconBtn onClick={()=>setSettings(true)} icon="ri-settings-3-line" title="Settings"/>
            <IconBtn onClick={()=>setAbout(true)} icon="ri-information-line" title="About"/>
          </>
        )}
      </div>

      <SettingsModal open={settingsOpen} onClose={()=>setSettings(false)} user={user}/>
      <AboutModal open={aboutOpen} onClose={()=>setAbout(false)}/>
    </div>
  )
}

const useTypewriter=(text,active)=>{
  const [d,setD]=useState(()=>active?'':text)
  useEffect(()=>{
    if(!active){setD(text);return}
    setD('');let i=0
    const id=setInterval(()=>{i++;setD(text.slice(0,i));if(i>=text.length)clearInterval(id)},11)
    return()=>clearInterval(id)
  },[active])
  return d
}

// ── Message — NO avatar/logo ──
const Message=({msg,isLatestAI})=>{
  const isUser=msg.role==='user'
  const [h,setH]=useState(false)
  const [copied,setCopied]=useState(false)
  const content=useTypewriter(msg.content,isLatestAI&&!isUser)
  const copy=()=>{navigator.clipboard.writeText(msg.content);setCopied(true);setTimeout(()=>setCopied(false),2000)}

  if(isUser)return(
    <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
      <div style={{maxWidth:'70%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'16px 16px 4px 16px',padding:'10px 15px',color:'#ececec',fontSize:14,lineHeight:1.62}}>
        {msg.content}
      </div>
    </div>
  )

  return(
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{marginBottom:22}}>
      <div className="ai-msg" style={{color:'#a1a1aa',fontSize:14,lineHeight:1.72}}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
      <div style={{display:'flex',gap:2,marginTop:8,opacity:h?1:0,transition:'opacity .18s'}}>
        {[
          {icon:copied?'ri-check-line':'ri-clipboard-line',fn:copy,label:'Copy'},
          {icon:'ri-refresh-line',fn:()=>{},label:'Retry'},
          {icon:'ri-share-line',fn:()=>{},label:'Share'},
          {icon:'ri-thumb-up-line',fn:()=>{},label:'Good'},
          {icon:'ri-thumb-down-line',fn:()=>{},label:'Bad'},
        ].map((a,i)=><IconBtn key={i} icon={a.icon} onClick={a.fn} title={a.label}/>)}
      </div>
    </div>
  )
}

const InputBar=({value,onChange,onSubmit,onKeyDown,onAudio,isRecording,textareaRef,disabled,large})=>{
  const [focused,setFocused]=useState(false)
  const autoH=e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,144)+'px'}
  return(
    <div style={{display:'flex',alignItems:'flex-end',background:'rgba(255,255,255,0.05)',border:`1px solid ${focused?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.09)'}`,borderRadius:16,padding:'10px 10px 10px 15px',boxShadow:focused?'0 0 0 3px rgba(255,255,255,0.03)':'none',transition:'all .18s'}}>
      <textarea ref={textareaRef} value={value} disabled={disabled}
        onChange={e=>{onChange(e.target.value);autoH(e)}} onKeyDown={onKeyDown}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        placeholder="Ask anything…" rows={1}
        style={{flex:1,background:'transparent',border:'none',outline:'none',color:disabled?'#52525b':'#ececec',fontSize:large?15:14,resize:'none',lineHeight:1.55,padding:'4px 0',fontFamily:'inherit',maxHeight:144,overflowY:'auto'}}/>
      <div style={{display:'flex',alignItems:'center',gap:2,paddingBottom:2}}>
        <SBtn icon="ri-image-add-line" title="Attach" onClick={()=>{}}/>
        <SBtn icon={isRecording?'ri-stop-circle-line':'ri-mic-line'} onClick={onAudio} isRec={isRecording} title={isRecording?'Stop':'Voice'}/>
        <SBtn icon="ri-arrow-up-line" onClick={onSubmit} canSend={!!value.trim()&&!disabled} title="Send"/>
      </div>
    </div>
  )
}

const SBtn=({onClick,icon,title,canSend,isRec})=>{
  const [h,setH]=useState(false)
  let bg='transparent',color='#71717a'
  if(isRec){bg='rgba(239,68,68,0.12)';color='#f87171'}
  else if(canSend){bg=h?'rgba(255,255,255,0.14)':'rgba(255,255,255,0.09)';color='#ececec'}
  else if(h){bg='rgba(255,255,255,0.07)';color='#a1a1aa'}
  return(
    <button onClick={onClick} title={title}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:34,height:34,borderRadius:10,border:'none',background:bg,color,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .14s',position:'relative',flexShrink:0}}>
      {isRec&&<span style={{position:'absolute',top:7,right:7,width:5,height:5,borderRadius:'50%',background:'#f87171',animation:'pulseDot 1s ease-in-out infinite'}}/>}
      <i className={icon} style={{fontSize:17}}/>
    </button>
  )
}

const SuggestionRow=({text,onClick})=>{
  const [h,setH]=useState(false)
  return(
    <div onClick={()=>onClick(text)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 2px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.06)',transition:'all .15s'}}>
      <span style={{color:h?'#e8e8e8':'#a1a1aa',fontSize:14,lineHeight:1.4,flex:1,transition:'color .15s'}}>{text}</span>
      <i className="ri-arrow-right-up-line" style={{fontSize:14,color:h?'#a1a1aa':'#52525b',flexShrink:0,marginLeft:16,transition:'color .15s'}}/>
    </div>
  )
}

// ── Chips (4 boxes) ──
const CHIPS=[
  {icon:'ri-graduation-cap-line',text:'Learn MERN Stack'},
  {icon:'ri-global-line',text:'Search on Web'},
  {icon:'ri-robot-line',text:'About Zerio AI'},
  {icon:'ri-brain-line',text:'Can AI take jobs?'},
]

// ── Suggestions (6 rows) ──
const SUGGESTIONS=[
  'How does machine learning actually work?',
  'Build a full stack app with React and Node.js',
  'Explain REST API vs GraphQL with examples',
  'What is RAG and how to implement it in Node?',
  'Best practices for MongoDB schema design',
  'How to deploy a MERN app to production?',
]

// ── Welcome Screen ──
const WelcomeScreen=({onSendMessage,incognito,onToggleIncognito})=>{
  const [value,setValue]=useState('')
  const [isRec,setRec]=useState(false)
  const recognitionRef=useRef(null)
  const textareaRef=useRef(null)

  const submit=()=>{if(!value.trim())return;onSendMessage(value.trim());setValue('')}
  const handleKey=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit()}}
  const handleAudio=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return
    if(isRec){recognitionRef.current?.stop();return}
    const r=new SR();r.lang='en-US';r.continuous=false;r.interimResults=false
    r.onresult=e=>setValue(p=>p+e.results[0][0].transcript)
    r.onend=()=>setRec(false);r.onerror=()=>setRec(false)
    recognitionRef.current=r;r.start();setRec(true)
  }

  return(
    <div style={{
      flex:1,display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',
      padding:'40px 24px',
      background:incognito?'#090909':'#0d0d0d',
      minHeight:'100dvh',
      transition:'background .3s',
      position:'relative',
      overflowY:'auto',
    }}>

      {/* ── Incognito toggle — top-right corner ── */}
      <button
        onClick={onToggleIncognito}
        title={incognito?'Incognito ON — click to disable':'Enable Incognito mode'}
        style={{
          position:'absolute',top:16,right:16,
          width:38,height:38,borderRadius:10,
          border:incognito?'1px solid rgba(255,255,255,0.2)':'1px solid rgba(255,255,255,0.08)',
          background:incognito?'rgba(255,255,255,0.12)':'transparent',
          color:incognito?'#ececec':'#52525b',
          cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
          transition:'all .2s',
          zIndex:10,
        }}
        onMouseEnter={e=>{if(!incognito){e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='#a1a1aa'}}}
        onMouseLeave={e=>{if(!incognito){e.currentTarget.style.background='transparent';e.currentTarget.style.color='#52525b'}}}
      >
        <i className="ri-spy-line" style={{fontSize:18}}/>
      </button>

      {/* Logo */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:22}}>
        <LogoIcon size={44}/>
        <h1 style={{fontSize:26,fontWeight:700,color:'#ececec',letterSpacing:'-.02em',marginTop:10,marginBottom:2}}>
          ZErio AI
        </h1>
        {incognito&&(
          <div style={{display:'flex',alignItems:'center',gap:5,marginTop:6,padding:'4px 12px',borderRadius:20,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)'}}>
            <i className="ri-spy-line" style={{fontSize:12,color:'#71717a'}}/>
            <span style={{color:'#71717a',fontSize:12}}>Incognito — chats won't be saved</span>
          </div>
        )}
      </div>

      {/* 4 Chip boxes */}
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:20,maxWidth:600,width:'100%'}}>
        {CHIPS.map((c,i)=>{
          const [h,setH]=useState(false)
          return(
            <button key={i} onClick={()=>onSendMessage(c.text)}
              onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
              style={{display:'flex',alignItems:'center',gap:7,padding:'9px 16px',borderRadius:20,background:h?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.04)',border:`1px solid ${h?'rgba(255,255,255,0.13)':'rgba(255,255,255,0.07)'}`,color:h?'#ececec':'#9ca3af',fontSize:13,cursor:'pointer',whiteSpace:'nowrap',transition:'all .18s',flexShrink:0}}>
              <i className={c.icon} style={{fontSize:14}}/>{c.text}
            </button>
          )
        })}
      </div>

      {/* Input bar */}
      <div style={{width:'100%',maxWidth:600,marginBottom:incognito?6:16}}>
        <InputBar value={value} onChange={setValue} onSubmit={submit} onKeyDown={handleKey}
          onAudio={handleAudio} isRecording={isRec} textareaRef={textareaRef} large/>
      </div>

      {incognito&&(
        <p style={{color:'#3f3f46',fontSize:12,marginBottom:14,textAlign:'center'}}>
          This conversation won't be saved to your history
        </p>
      )}

      {/* 6 Suggestion rows */}
      <div style={{width:'100%',maxWidth:600}}>
        {SUGGESTIONS.map((s,i)=>(
          <SuggestionRow key={i} text={s} onClick={onSendMessage}/>
        ))}
      </div>
    </div>
  )
}

const CHAT_CHIPS=[
  {icon:'ri-code-s-slash-line',text:'Explain code'},
  {icon:'ri-translate-2',text:'Translate'},
  {icon:'ri-file-text-line',text:'Summarize'},
  {icon:'ri-lightbulb-line',text:'Give ideas'},
]

const ChatInputArea=({onSend,disabled})=>{
  const [value,setValue]=useState('')
  const [isRec,setRec]=useState(false)
  const recognitionRef=useRef(null)
  const textareaRef=useRef(null)

  const submit=()=>{if(!value.trim()||disabled)return;onSend(value.trim());setValue('');if(textareaRef.current)textareaRef.current.style.height='auto'}
  const handleKey=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit()}}
  const handleAudio=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return
    if(isRec){recognitionRef.current?.stop();return}
    const r=new SR();r.lang='en-US';r.continuous=false;r.interimResults=false
    r.onresult=e=>setValue(p=>p+e.results[0][0].transcript)
    r.onend=()=>setRec(false);r.onerror=()=>setRec(false)
    recognitionRef.current=r;r.start();setRec(true)
  }

  return(
    <div style={{padding:'10px 16px 18px',borderTop:'1px solid rgba(255,255,255,0.07)',background:'#0d0d0d',flexShrink:0}}>
      <div style={{display:'flex',gap:5,marginBottom:10,overflowX:'auto'}}>
        {CHAT_CHIPS.map((c,i)=>{
          const [h,setH]=useState(false)
          return(
            <button key={i} onClick={()=>setValue(c.text+' ')}
              onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
              style={{display:'flex',alignItems:'center',gap:5,padding:'5px 12px',borderRadius:14,background:h?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',color:h?'#ececec':'#71717a',fontSize:12,cursor:'pointer',whiteSpace:'nowrap',transition:'all .14s',flexShrink:0}}>
              <i className={c.icon} style={{fontSize:12}}/>{c.text}
            </button>
          )
        })}
      </div>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <InputBar value={value} onChange={setValue} onSubmit={submit} onKeyDown={handleKey}
          onAudio={handleAudio} isRecording={isRec} textareaRef={textareaRef} disabled={disabled}/>
      </div>
    </div>
  )
}

const ChatView=({currentchatId,chats,onSend})=>{
  const {loading}=useSelector(s=>s.chat)
  const chat=chats[currentchatId]
  const messages=chat?.messages||[]
  const endRef=useRef(null)
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[messages.length,loading])
  if(!chat)return null

  return(
    <div style={{flex:1,display:'flex',flexDirection:'column',height:'100dvh',overflow:'hidden',background:'#0d0d0d'}}>
      <div style={{padding:'13px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',flexShrink:0}}>
        <div style={{flex:1,minWidth:0}}>
          {loading?(
            <div style={{display:'flex',alignItems:'center',gap:7}}>
              {[0,.15,.3].map((d,i)=><span key={i} style={{width:5,height:5,borderRadius:'50%',background:'#71717a',animation:`bounce .88s ${d}s ease-in-out infinite`}}/>)}
              <span style={{color:'#52525b',fontSize:13,marginLeft:4}}>Zerio is thinking…</span>
            </div>
          ):(
            <h2 style={{color:'#ececec',fontSize:14,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{chat.title}</h2>
          )}
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'22px 20px 0'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          {messages.map((msg,i)=><Message key={i} msg={msg} isLatestAI={msg.role==='assistant'&&i===messages.length-1}/>)}
          {loading&&(
            <div style={{display:'flex',gap:4,marginBottom:20,paddingTop:4}}>
              {[0,.18,.36].map((d,i)=>(
                <span key={i} style={{width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,0.25)',animation:`bounce .88s ${d}s ease-in-out infinite`}}/>
              ))}
            </div>
          )}
          <div ref={endRef} style={{height:20}}/>
        </div>
      </div>
      <ChatInputArea onSend={onSend} disabled={loading}/>
    </div>
  )
}

// ── DASHBOARD ──
function Dashboard(){
  const dispatch=useDispatch()
  const {user}=useSelector(s=>s.auth)
  const currentchatid=useSelector(s=>s.chat.currentchatid)
  const chats=useSelector(s=>s.chat.chats)
  const [mobileOpen,setMobileOpen]=useState(false)
  const [searchOpen,setSearchOpen]=useState(false)
  const [sidebarCollapsed,setSidebarCollapsed]=useState(false)
  const [incognito,setIncognito]=useState(false)

  const {intializesocketconnection,handlegenraterespons,handleloadchats,handleloadmessages,handledeletechat}=usechat()

  useEffect(()=>{intializesocketconnection();handleloadchats()},[])

  const onSelectChat=chatId=>{
    dispatch(setcurrentchatid(chatId))
    if(chats[chatId]?.messages?.length===0)handleloadmessages({chatid:chatId})
    setMobileOpen(false)
  }
  const onNewChat=()=>{dispatch(setcurrentchatid(null));setMobileOpen(false)}

  // ── Incognito: chatid stays null (no save) ──
  const onSend=content=>{
    handlegenraterespons({
      message:content,
      chatid: incognito ? null : currentchatid||null,
    })
  }

  const onDelete=async chatId=>{
    try{
      await handledeletechat({chatid:chatId})
      const u={...chats};delete u[chatId]
      dispatch(setchats(u))
      if(currentchatid===chatId)dispatch(setcurrentchatid(null))
    }catch(e){console.error(e)}
  }

  const sidebarProps={
    chats,selectedChatId:currentchatid,
    onSelectChat,onDeleteChat:onDelete,onNewChat,user,
    onSearchOpen:()=>setSearchOpen(true),
    collapsed:sidebarCollapsed,
    onToggleCollapse:()=>setSidebarCollapsed(p=>!p),
  }

  return(
    <>
      <GlobalStyles/>
      <div style={{display:'flex',height:'100dvh',background:'#0d0d0d',overflow:'hidden'}}>

        {/* Desktop Sidebar */}
        <div className="desktop-sidebar" style={{flexShrink:0}}>
          <Sidebar {...sidebarProps}/>
        </div>

        {/* Mobile Sidebar */}
        {mobileOpen&&(
          <div style={{position:'fixed',inset:0,zIndex:70}}>
            <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.65)',backdropFilter:'blur(4px)'}} onClick={()=>setMobileOpen(false)}/>
            <div style={{position:'relative',zIndex:1,animation:'slideRight .22s ease'}}>
              <Sidebar {...sidebarProps} onClose={()=>setMobileOpen(false)} collapsed={false}/>
            </div>
          </div>
        )}

        {/* Search / History Modal */}
        <SearchModal
          open={searchOpen} onClose={()=>setSearchOpen(false)}
          chats={chats} onSelectChat={onSelectChat} onNewChat={onNewChat}
        />

        {/* Main */}
        <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,overflow:'hidden'}}>
          {/* Mobile TopBar */}
          <div className="mobile-topbar" style={{display:'none',alignItems:'center',gap:12,padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)',background:'#0d0d0d',flexShrink:0}}>
            <button onClick={()=>setMobileOpen(true)} style={{width:34,height:34,borderRadius:9,border:'1px solid rgba(255,255,255,0.08)',background:'transparent',color:'#a1a1aa',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <i className="ri-menu-line" style={{fontSize:17}}/>
            </button>
            <LogoIcon size={17}/>
            <span style={{color:'#ececec',fontWeight:700,fontSize:14}}>ZErio AI</span>
          </div>

          {currentchatid===null
            ?<WelcomeScreen
                onSendMessage={onSend}
                incognito={incognito}
                onToggleIncognito={()=>setIncognito(p=>!p)}
              />
            :<ChatView currentchatId={currentchatid} chats={chats} onSend={onSend}/>
          }
        </div>
      </div>
    </>
  )
}

export default Dashboard