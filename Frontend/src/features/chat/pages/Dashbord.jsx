import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { usechat } from '../hook/usechat'
import { setcurrentchatid, setchats } from '../chat.slice'
import 'remixicon/fonts/remixicon.css'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const C = {
  bg:'#0d0d0d', sidebar:'#111111', card:'#1a1a1a', elevated:'#1f1f1f',
  border:'rgba(255,255,255,0.07)', text:'#e8e8e8', textSub:'#9ca3af',
  textMuted:'#6b7280', blue:'#93c5fd', blueAccent:'#3b82f6',
  blueSoft:'rgba(59,130,246,0.14)', danger:'#ef4444',
}

const GlobalStyles = () => (
  <style>{`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0d0d0d;color:#e8e8e8}
    input,textarea,button{font-family:inherit}
    ::-webkit-scrollbar{display:none}
    *{scrollbar-width:none;-ms-overflow-style:none}
    @keyframes bounce{0%,100%{transform:translateY(0);opacity:.45}50%{transform:translateY(-6px);opacity:1}}
    @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.65)}}
    @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .ai-msg p{margin-bottom:10px;line-height:1.72}
    .ai-msg p:last-child{margin-bottom:0}
    .ai-msg code{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);padding:2px 6px;border-radius:5px;font-size:.865em;color:#93c5fd;font-family:'JetBrains Mono','Fira Code',monospace}
    .ai-msg pre{background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px 16px;margin:12px 0;overflow-x:auto}
    .ai-msg pre code{background:none;border:none;padding:0;color:#e8e8e8;font-size:13px}
    .ai-msg h1,.ai-msg h2,.ai-msg h3{color:#e8e8e8;font-weight:600;margin:16px 0 8px}
    .ai-msg h1{font-size:1.2em}.ai-msg h2{font-size:1.08em}.ai-msg h3{font-size:1em}
    .ai-msg ul,.ai-msg ol{padding-left:20px;margin:8px 0}
    .ai-msg li{margin-bottom:4px}
    .ai-msg strong{color:#e8e8e8;font-weight:600}
    .ai-msg em{color:#9ca3af}
    .ai-msg a{color:#93c5fd;text-decoration:none}
    .ai-msg a:hover{text-decoration:underline}
    .ai-msg blockquote{border-left:3px solid rgba(59,130,246,.4);padding-left:14px;margin:8px 0;color:#9ca3af;font-style:italic}
    .ai-msg table{width:100%;border-collapse:collapse;margin:12px 0;font-size:13px}
    .ai-msg th,.ai-msg td{padding:8px 12px;border:1px solid rgba(255,255,255,0.08);text-align:left}
    .ai-msg th{background:rgba(255,255,255,0.05);color:#e8e8e8}
    .ai-msg hr{border:none;border-top:1px solid rgba(255,255,255,0.07);margin:16px 0}
    @media(max-width:768px){.desktop-sidebar{display:none!important}.mobile-topbar{display:flex!important}}
    @media(min-width:769px){.mobile-topbar{display:none!important}}
  `}</style>
)

// ── Logo ──
const LogoIcon = ({ size = 22 }) => (
  <div style={{maskImage:'linear-gradient(to bottom,white 40%,transparent 100%)',WebkitMaskImage:'linear-gradient(to bottom,white 40%,transparent 100%)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
    <i className="ri-ancient-gate-line" style={{fontSize:size,color:'#93c5fd'}} />
  </div>
)

// ── Icon Button ──
const IconBtn = ({ onClick, icon, title, danger }) => {
  const [h,setH] = useState(false)
  return (
    <button onClick={onClick} title={title} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:32,height:32,borderRadius:9,border:`1px solid rgba(255,255,255,0.07)`,background:h?(danger?'rgba(239,68,68,.1)':'rgba(255,255,255,.07)'):'transparent',color:h?(danger?'#ef4444':'#e8e8e8'):'#6b7280',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s',flexShrink:0}}>
      <i className={icon} style={{fontSize:15}} />
    </button>
  )
}

// ── Small Button (input bar) ──
const SmallBtn = ({ onClick, icon, title, accent, danger, active, dot, disabled }) => {
  const [h,setH] = useState(false)
  let bg='transparent', color='#6b7280'
  if(danger&&active){bg='rgba(239,68,68,.14)';color='#ef4444'}
  else if(accent){bg=h?'rgba(59,130,246,.26)':'rgba(59,130,246,.15)';color='#93c5fd'}
  else if(h){bg='rgba(255,255,255,.07)';color='#9ca3af'}
  return (
    <button onClick={onClick} title={title} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:36,height:36,borderRadius:11,border:'none',background:bg,color,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.38:1,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s',position:'relative',flexShrink:0}}>
      {dot&&<span style={{position:'absolute',top:7,right:7,width:6,height:6,borderRadius:'50%',background:'#ef4444',animation:'pulseDot 1s ease-in-out infinite'}}/>}
      <i className={icon} style={{fontSize:18}} />
    </button>
  )
}

// ── Suggestion Chip ──
const Chip = ({ icon, text, onClick, small }) => {
  const [h,setH] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{display:'flex',alignItems:'center',gap:small?5:7,padding:small?'5px 12px':'8px 15px',borderRadius:small?14:20,background:h?'rgba(255,255,255,.08)':'rgba(255,255,255,.04)',border:`1px solid ${h?'rgba(255,255,255,.13)':'rgba(255,255,255,.07)'}`,color:h?'#e8e8e8':'#9ca3af',fontSize:small?12:13,cursor:'pointer',whiteSpace:'nowrap',transition:'all .18s',flexShrink:0,backdropFilter:'blur(10px)'}}>
      <i className={icon} style={{fontSize:small?12:14}} />
      {text}
    </button>
  )
}

// ── Action Button (modals) ──
const ActionBtn = ({ onClick, variant='ghost', children, disabled }) => {
  const [h,setH] = useState(false)
  const s = {
    ghost: {bg:h?'rgba(255,255,255,.06)':'transparent',bd:'rgba(255,255,255,0.07)',clr:'#9ca3af'},
    primary:{bg:h?'rgba(59,130,246,.26)':'rgba(59,130,246,.15)',bd:'rgba(59,130,246,.3)',clr:'#93c5fd'},
    danger: {bg:h?'rgba(239,68,68,.22)':'rgba(239,68,68,.12)',bd:'rgba(239,68,68,.3)',clr:'#ef4444'},
  }[variant]
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{padding:'9px 18px',borderRadius:12,background:s.bg,border:`1px solid ${s.bd}`,color:s.clr,fontSize:13,fontWeight:500,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.5:1,transition:'all .2s'}}>
      {children}
    </button>
  )
}

// ── Confirm Modal ──
const ConfirmModal = ({ open, title, message, confirmText='Confirm', onConfirm, onCancel, danger }) => {
  if(!open) return null
  return (
    <div style={{position:'fixed',inset:0,zIndex:300,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.75)',backdropFilter:'blur(8px)'}} onClick={onCancel}/>
      <div style={{position:'relative',background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,padding:24,width:'100%',maxWidth:360,margin:'0 20px',boxShadow:'0 30px 80px rgba(0,0,0,.6)',animation:'fadeIn .2s ease'}}>
        <h3 style={{color:'#e8e8e8',fontSize:17,fontWeight:600,marginBottom:8}}>{title}</h3>
        <p style={{color:'#9ca3af',fontSize:14,lineHeight:1.55,marginBottom:24}}>{message}</p>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <ActionBtn onClick={onCancel} variant="ghost">Cancel</ActionBtn>
          <ActionBtn onClick={onConfirm} variant={danger?'danger':'primary'}>{confirmText}</ActionBtn>
        </div>
      </div>
    </div>
  )
}

// ── Settings Row ──
const SettingsRow = ({ icon, label, onClick, danger }) => {
  const [h,setH] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderRadius:14,marginBottom:8,border:danger?'1px solid rgba(239,68,68,.18)':`1px solid rgba(255,255,255,0.07)`,background:h?(danger?'rgba(239,68,68,.06)':'rgba(255,255,255,.04)'):'transparent',cursor:'pointer',transition:'all .2s',textAlign:'left'}}>
      <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:danger?'rgba(239,68,68,.1)':'#1f1f1f',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <i className={icon} style={{fontSize:16,color:danger?'#ef4444':'#9ca3af'}} />
      </div>
      <span style={{color:danger?'#ef4444':'#9ca3af',fontSize:14,fontWeight:500,flex:1}}>{label}</span>
      <i className="ri-arrow-right-s-line" style={{color:danger?'rgba(239,68,68,.4)':'#6b7280',fontSize:17}} />
    </button>
  )
}

// ── Settings Modal ──
const SettingsModal = ({ open, onClose, user }) => {
  const [showLogout,setShowLogout] = useState(false)
  const [showDelete,setShowDelete] = useState(false)
  if(!open) return null
  const initial = (user?.username||'Z').charAt(0).toUpperCase()
  return (
    <>
      <div style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.65)',backdropFilter:'blur(8px)'}} onClick={onClose}/>
        <div style={{position:'relative',width:'100%',maxWidth:440,background:'#111111',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'24px 24px 0 0',boxShadow:'0 -20px 60px rgba(0,0,0,.5)',overflow:'hidden',animation:'slideUp .3s ease'}}>
          <div style={{display:'flex',justifyContent:'center',padding:'12px 0 0'}}>
            <div style={{width:40,height:4,borderRadius:4,background:'rgba(255,255,255,.15)'}}/>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
            <span style={{color:'#e8e8e8',fontWeight:600,fontSize:16}}>Settings</span>
            <IconBtn onClick={onClose} icon="ri-close-line"/>
          </div>
          <div style={{padding:'16px 20px 36px'}}>
            <div style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,marginBottom:14}}>
              <div style={{width:52,height:52,borderRadius:14,flexShrink:0,background:'linear-gradient(135deg,rgba(59,130,246,.3),rgba(147,51,234,.3))',border:'1px solid rgba(59,130,246,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#93c5fd'}}>
                {initial}
              </div>
              <div style={{minWidth:0}}>
                <div style={{color:'#e8e8e8',fontWeight:500,fontSize:15,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.username||'User'}</div>
                <div style={{color:'#6b7280',fontSize:12,marginTop:2}}>@{(user?.username||'user').toLowerCase()}</div>
                <div style={{color:'#6b7280',fontSize:12,marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email||'•••@zerio.ai'}</div>
              </div>
            </div>
            <SettingsRow icon="ri-logout-box-r-line" label="Logout" onClick={()=>setShowLogout(true)}/>
            <SettingsRow icon="ri-delete-bin-6-line" label="Delete Account" onClick={()=>setShowDelete(true)} danger/>
            <p style={{color:'#6b7280',fontSize:11,textAlign:'center',marginTop:20}}>Zerio AI • v1.0.0</p>
          </div>
        </div>
      </div>
      <ConfirmModal open={showLogout} title="Logout from Zerio?" message="You'll be signed out and redirected to login." confirmText="Logout" onConfirm={()=>setShowLogout(false)} onCancel={()=>setShowLogout(false)}/>
      <ConfirmModal open={showDelete} title="Delete Account?" message="This is permanent. All your chats and data will be erased forever." confirmText="Delete Account" danger onConfirm={()=>setShowDelete(false)} onCancel={()=>setShowDelete(false)}/>
    </>
  )
}

// ── About Modal ──
const AboutModal = ({ open, onClose }) => {
  if(!open) return null
  return (
    <div style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.7)',backdropFilter:'blur(8px)'}} onClick={onClose}/>
      <div style={{position:'relative',width:'100%',maxWidth:360,margin:'0 20px',background:'#111111',border:'1px solid rgba(255,255,255,0.07)',borderRadius:24,boxShadow:'0 30px 80px rgba(0,0,0,.7)',overflow:'hidden',animation:'fadeIn .22s ease'}}>
        <div style={{padding:'28px 24px 24px',textAlign:'center'}}>
          <div style={{width:66,height:66,margin:'0 auto 16px',borderRadius:20,background:'linear-gradient(135deg,rgba(59,130,246,.18),rgba(147,51,234,.18))',border:'1px solid rgba(59,130,246,.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <LogoIcon size={32}/>
          </div>
          <h2 style={{color:'#e8e8e8',fontWeight:700,fontSize:22,marginBottom:4}}>Zerio AI</h2>
          <p style={{color:'#6b7280',fontSize:12,marginBottom:14}}>v1.0.0 — Smart answers, instantly</p>
          <p style={{color:'#9ca3af',fontSize:13,lineHeight:1.65,marginBottom:20}}>Zerio combines powerful LLMs with real-time internet access to deliver accurate, up-to-date answers on anything you ask.</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:20}}>
            {['React','Node.js','MongoDB','Socket.io','Gemini AI'].map(t=>(
              <span key={t} style={{fontSize:11,padding:'4px 10px',borderRadius:8,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,0.07)',color:'#9ca3af'}}>{t}</span>
            ))}
          </div>
          <div style={{padding:'12px 16px',borderRadius:14,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,0.07)',textAlign:'left',marginBottom:20}}>
            <p style={{color:'#6b7280',fontSize:10,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8}}>Developer</p>
            <p style={{color:'#e8e8e8',fontWeight:500,fontSize:14,marginBottom:10}}>Your Name Here</p>
            <div style={{display:'flex',gap:18}}>
              <a href="https://github.com/yourhandle" target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:6,color:'#9ca3af',fontSize:13,textDecoration:'none'}}>
                <i className="ri-github-fill" style={{fontSize:16}}/> GitHub
              </a>
              <a href="https://linkedin.com/in/yourhandle" target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:6,color:'#9ca3af',fontSize:13,textDecoration:'none'}}>
                <i className="ri-linkedin-box-fill" style={{fontSize:16}}/> LinkedIn
              </a>
            </div>
          </div>
          <button onClick={onClose} style={{width:'100%',padding:12,borderRadius:14,border:'1px solid rgba(255,255,255,0.07)',background:'transparent',color:'#9ca3af',fontSize:14,cursor:'pointer',transition:'all .2s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.05)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sidebar ──
const Sidebar = ({ chats, selectedChatId, onSelectChat, onDeleteChat, onNewChat, onClose, user }) => {
  const [search,setSearch]       = useState('')
  const [settingsOpen,setSettings] = useState(false)
  const [aboutOpen,setAbout]     = useState(false)

  const grouped = (() => {
    const arr  = Object.values(chats)
    const filt = search ? arr.filter(c=>c.title.toLowerCase().includes(search.toLowerCase())) : arr
    const today = new Date(); today.setHours(0,0,0,0)
    const g = {today:[],yesterday:[],week:[],month:[]}
    filt.forEach(c=>{
      const d = new Date(c.lastUpdated||Date.now()); d.setHours(0,0,0,0)
      const diff = Math.round((today-d)/86400000)
      if(diff===0) g.today.push(c)
      else if(diff===1) g.yesterday.push(c)
      else if(diff<=7) g.week.push(c)
      else if(diff<=30) g.month.push(c)
    })
    return g
  })()

  const ChatItem = ({ chat }) => {
    const [menu,setMenu] = useState(false)
    const [h,setH]       = useState(false)
    const selected       = selectedChatId === chat.id
    return (
      <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setMenu(false)}} onClick={()=>{onSelectChat(chat.id);onClose?.()}}
        style={{padding:'9px 10px',borderRadius:10,marginBottom:2,cursor:'pointer',transition:'all .14s',display:'flex',alignItems:'center',gap:8,position:'relative',background:selected?'rgba(255,255,255,.08)':h?'rgba(255,255,255,.04)':'transparent',border:selected?'1px solid rgba(255,255,255,.09)':'1px solid transparent'}}>
        <i className="ri-chat-3-line" style={{fontSize:13,color:'#6b7280',flexShrink:0}}/>
        <span style={{flex:1,fontSize:13,color:selected?'#e8e8e8':'#9ca3af',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{chat.title}</span>
        {(h||menu)&&(
          <div style={{position:'relative',flexShrink:0}}>
            <button onClick={e=>{e.stopPropagation();setMenu(p=>!p)}} style={{width:24,height:24,borderRadius:6,border:'none',background:'transparent',color:'#6b7280',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}>
              <i className="ri-more-2-fill"/>
            </button>
            {menu&&(
              <div style={{position:'absolute',right:0,top:28,background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:4,zIndex:80,minWidth:110,boxShadow:'0 8px 24px rgba(0,0,0,.5)'}}>
                <button onClick={e=>{e.stopPropagation();onDeleteChat(chat.id);setMenu(false)}} style={{width:'100%',textAlign:'left',padding:'8px 10px',background:'transparent',border:'none',color:'#ef4444',fontSize:13,cursor:'pointer',borderRadius:7,display:'flex',alignItems:'center',gap:6}} onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,.1)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <i className="ri-delete-bin-6-line" style={{fontSize:14}}/> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const Section = ({ label, items }) => {
    if(!items.length) return null
    return (
      <div style={{marginBottom:18}}>
        <p style={{color:'#6b7280',fontSize:10,textTransform:'uppercase',letterSpacing:'.08em',padding:'0 10px',marginBottom:4}}>{label}</p>
        {items.map(c=><ChatItem key={c.id} chat={c}/>)}
      </div>
    )
  }

  return (
    <div style={{width:240,background:'#111111',borderRight:'1px solid rgba(255,255,255,0.07)',height:'100dvh',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'14px 14px 10px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
          <LogoIcon size={20}/>
          <span style={{color:'#e8e8e8',fontWeight:700,fontSize:15,letterSpacing:'-.01em'}}>ZErio AI</span>
        </div>
        <div style={{position:'relative',marginBottom:8}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chats…"
            style={{width:'100%',padding:'8px 30px 8px 10px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:9,color:'#e8e8e8',fontSize:12,outline:'none',transition:'border-color .2s'}}
            onFocus={e=>e.target.style.borderColor='rgba(255,255,255,.15)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'}/>
          <i className="ri-search-line" style={{position:'absolute',right:9,top:'50%',transform:'translateY(-50%)',fontSize:13,color:'#6b7280'}}/>
        </div>
        <button onClick={onNewChat} style={{width:'100%',padding:8,borderRadius:9,background:'rgba(59,130,246,.1)',border:'1px solid rgba(59,130,246,.22)',color:'#93c5fd',fontSize:13,fontWeight:500,cursor:'pointer',transition:'all .2s',display:'flex',alignItems:'center',justifyContent:'center',gap:5}} onMouseEnter={e=>e.currentTarget.style.background='rgba(59,130,246,.17)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(59,130,246,.1)'}>
          <i className="ri-add-line" style={{fontSize:15}}/> New Chat
        </button>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'10px 10px'}}>
        <Section label="Today"        items={grouped.today}/>
        <Section label="Yesterday"    items={grouped.yesterday}/>
        <Section label="This Week"    items={grouped.week}/>
        <Section label="Last 30 Days" items={grouped.month}/>
        {Object.keys(chats).length===0&&(
          <div style={{textAlign:'center',paddingTop:48}}>
            <i className="ri-chat-off-line" style={{fontSize:26,color:'#6b7280',display:'block',marginBottom:8}}/>
            <p style={{color:'#6b7280',fontSize:12}}>No chats yet</p>
          </div>
        )}
      </div>

      <div style={{padding:'12px 14px',borderTop:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:32,height:32,borderRadius:9,flexShrink:0,background:'linear-gradient(135deg,rgba(59,130,246,.3),rgba(147,51,234,.3))',border:'1px solid rgba(59,130,246,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#93c5fd'}}>
          {(user?.username||'Z').charAt(0).toUpperCase()}
        </div>
        <span style={{flex:1,fontSize:13,color:'#9ca3af',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.username||'User'}</span>
        <IconBtn onClick={()=>setSettings(true)} icon="ri-settings-3-line" title="Settings"/>
        <IconBtn onClick={()=>setAbout(true)}    icon="ri-information-line" title="About Zerio"/>
      </div>

      <SettingsModal open={settingsOpen} onClose={()=>setSettings(false)} user={user}/>
      <AboutModal    open={aboutOpen}    onClose={()=>setAbout(false)}/>
    </div>
  )
}

// ── Typewriter Hook ──
const useTypewriter = (text, active) => {
  const [displayed,setDisplayed] = useState(()=>active?'':text)
  useEffect(()=>{
    if(!active){setDisplayed(text);return}
    setDisplayed('')
    let i=0
    const id=setInterval(()=>{i++;setDisplayed(text.slice(0,i));if(i>=text.length)clearInterval(id)},11)
    return()=>clearInterval(id)
  },[active])
  return displayed
}

// ── Message ──
const Message = ({ msg, isLatestAI }) => {
  const isUser = msg.role==='user'
  const [hovered,setHovered] = useState(false)
  const [copied,setCopied]   = useState(false)
  const content = useTypewriter(msg.content, isLatestAI&&!isUser)

  const copy = ()=>{navigator.clipboard.writeText(msg.content);setCopied(true);setTimeout(()=>setCopied(false),2200)}

  if(isUser) return (
    <div style={{display:'flex',justifyContent:'flex-end',marginBottom:18}}>
      <div style={{maxWidth:'72%',background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.09)',borderRadius:'18px 18px 4px 18px',padding:'11px 16px',color:'#e8e8e8',fontSize:14,lineHeight:1.62,boxShadow:'0 2px 10px rgba(0,0,0,.2)'}}>
        {msg.content}
      </div>
    </div>
  )

  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} style={{display:'flex',justifyContent:'flex-start',marginBottom:24,gap:12,alignItems:'flex-start'}}>
      <div style={{width:28,height:28,borderRadius:8,flexShrink:0,background:'linear-gradient(135deg,rgba(59,130,246,.2),rgba(147,51,234,.2))',border:'1px solid rgba(59,130,246,.15)',display:'flex',alignItems:'center',justifyContent:'center',marginTop:2}}>
        <i className="ri-ancient-gate-line" style={{fontSize:13,color:'#93c5fd'}}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div className="ai-msg" style={{color:'#9ca3af',fontSize:14,lineHeight:1.72}}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        <div style={{display:'flex',gap:3,marginTop:8,opacity:hovered?1:0,transition:'opacity .2s'}}>
          {[
            {icon:copied?'ri-check-line':'ri-clipboard-line',label:'Copy',fn:copy},
            {icon:'ri-refresh-line',label:'Regenerate',fn:()=>{}},
            {icon:'ri-share-line',label:'Share',fn:()=>{}},
            {icon:'ri-thumb-up-line',label:'Good',fn:()=>{}},
            {icon:'ri-thumb-down-line',label:'Bad',fn:()=>{}},
          ].map((a,i)=><IconBtn key={i} icon={a.icon} onClick={a.fn} title={a.label}/>)}
        </div>
      </div>
    </div>
  )
}

// ── Shared Input Bar ──
const InputBar = ({ value, onChange, onSubmit, onKeyDown, onAudio, isRecording, textareaRef, disabled, large }) => {
  const [focused,setFocused] = useState(false)
  const autoH = e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,148)+'px'}
  return (
    <div style={{display:'flex',alignItems:'flex-end',gap:0,background:'rgba(255,255,255,.04)',border:`1px solid ${focused?'rgba(255,255,255,.18)':'rgba(255,255,255,.09)'}`,borderRadius:18,padding:'10px 10px 10px 16px',boxShadow:focused?'0 0 0 3px rgba(59,130,246,.07)':'none',transition:'all .2s'}}>
      <textarea ref={textareaRef} value={value} disabled={disabled}
        onChange={e=>{onChange(e.target.value);autoH(e)}}
        onKeyDown={onKeyDown}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        placeholder="Ask anything… (Shift+Enter for new line)"
        rows={1}
        style={{flex:1,background:'transparent',border:'none',outline:'none',color:disabled?'#6b7280':'#e8e8e8',fontSize:large?15:14,resize:'none',lineHeight:1.55,padding:'4px 0',fontFamily:'inherit',maxHeight:148,overflowY:'auto'}}/>
      <div style={{display:'flex',alignItems:'center',gap:3,paddingBottom:2}}>
        <SmallBtn icon="ri-image-add-line" title="Attach image (coming soon)" onClick={()=>{}}/>
        <SmallBtn icon={isRecording?'ri-stop-circle-line':'ri-mic-line'} onClick={onAudio} active={isRecording} danger={isRecording} dot={isRecording} title={isRecording?'Stop':'Voice input'}/>
        <SmallBtn icon="ri-arrow-up-line" onClick={onSubmit} disabled={!value.trim()||disabled} accent={!!value.trim()&&!disabled} title="Send"/>
      </div>
    </div>
  )
}

// ── Welcome Screen ──
const SUGGESTIONS = [
  {icon:'ri-graduation-cap-line',text:'Learn MERN Stack'},
  {icon:'ri-global-line',text:'Search on Web'},
  {icon:'ri-robot-line',text:'About Zerio AI'},
  {icon:'ri-brain-line',text:'Can AI take jobs?'},
]

const WelcomeScreen = ({ onSendMessage }) => {
  const [value,setValue]       = useState('')
  const [isRec,setRec]         = useState(false)
  const recognitionRef = useRef(null)
  const textareaRef    = useRef(null)

  const submit = ()=>{if(!value.trim())return;onSendMessage(value.trim());setValue('')}
  const handleKey = e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit()}}
  const handleAudio = ()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR)return
    if(isRec){recognitionRef.current?.stop();return}
    const r=new SR(); r.lang='en-US'; r.continuous=false; r.interimResults=false
    r.onresult=e=>setValue(p=>p+e.results[0][0].transcript)
    r.onend=()=>setRec(false); r.onerror=()=>setRec(false)
    recognitionRef.current=r; r.start(); setRec(true)
  }

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px 20px',background:'#0d0d0d',minHeight:'100dvh'}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:38}}>
        <div style={{width:80,height:80,borderRadius:24,marginBottom:18,background:'linear-gradient(135deg,rgba(59,130,246,.12),rgba(147,51,234,.12))',border:'1px solid rgba(59,130,246,.12)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 50px rgba(59,130,246,.06)'}}>
          <LogoIcon size={38}/>
        </div>
        <h1 style={{fontSize:34,fontWeight:800,letterSpacing:'-.03em',background:'linear-gradient(135deg,#e8e8e8 0%,#9ca3af 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:6}}>ZErio AI</h1>
        <p style={{color:'#6b7280',fontSize:15}}>Ask anything, get smart answers.</p>
      </div>
      <div style={{width:'100%',maxWidth:660}}>
        <InputBar value={value} onChange={setValue} onSubmit={submit} onKeyDown={handleKey} onAudio={handleAudio} isRecording={isRec} textareaRef={textareaRef} large/>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginTop:18}}>
          {SUGGESTIONS.map((s,i)=><Chip key={i} icon={s.icon} text={s.text} onClick={()=>onSendMessage(s.text)}/>)}
        </div>
      </div>
    </div>
  )
}

// ── Chat Input Area ──
const CHAT_CHIPS = [
  {icon:'ri-code-s-slash-line',text:'Explain code'},
  {icon:'ri-translate-2',text:'Translate'},
  {icon:'ri-file-text-line',text:'Summarize'},
  {icon:'ri-lightbulb-line',text:'Give ideas'},
]

const ChatInputArea = ({ onSend, disabled }) => {
  const [value,setValue]   = useState('')
  const [isRec,setRec]     = useState(false)
  const recognitionRef = useRef(null)
  const textareaRef    = useRef(null)

  const submit = ()=>{
    if(!value.trim()||disabled)return
    onSend(value.trim()); setValue('')
    if(textareaRef.current) textareaRef.current.style.height='auto'
  }
  const handleKey = e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit()}}
  const handleAudio = ()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR)return
    if(isRec){recognitionRef.current?.stop();return}
    const r=new SR(); r.lang='en-US'; r.continuous=false; r.interimResults=false
    r.onresult=e=>setValue(p=>p+e.results[0][0].transcript)
    r.onend=()=>setRec(false); r.onerror=()=>setRec(false)
    recognitionRef.current=r; r.start(); setRec(true)
  }

  return (
    <div style={{padding:'10px 16px 18px',borderTop:'1px solid rgba(255,255,255,0.07)',background:'#0d0d0d',flexShrink:0}}>
      <div style={{display:'flex',gap:6,marginBottom:10,overflowX:'auto'}}>
        {CHAT_CHIPS.map((c,i)=><Chip key={i} icon={c.icon} text={c.text} onClick={()=>setValue(c.text+' ')} small/>)}
      </div>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <InputBar value={value} onChange={setValue} onSubmit={submit} onKeyDown={handleKey} onAudio={handleAudio} isRecording={isRec} textareaRef={textareaRef} disabled={disabled}/>
      </div>
    </div>
  )
}

// ── Chat View ──
const ChatView = ({ currentchatId, chats, onSend }) => {
  const { loading } = useSelector(s=>s.chat)
  const chat        = chats[currentchatId]
  const messages    = chat?.messages||[]
  const endRef      = useRef(null)

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[messages.length,loading])
  if(!chat) return null

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',height:'100dvh',overflow:'hidden',background:'#0d0d0d'}}>
      {/* Header */}
      <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
        <div style={{flex:1,minWidth:0}}>
          {loading?(
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              {[0,.15,.3].map((d,i)=>(
                <span key={i} style={{width:6,height:6,borderRadius:'50%',background:'#93c5fd',animation:`bounce .88s ${d}s ease-in-out infinite`}}/>
              ))}
              <span style={{color:'#6b7280',fontSize:13,marginLeft:4}}>Zerio is thinking…</span>
            </div>
          ):(
            <h2 style={{color:'#e8e8e8',fontSize:14,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{chat.title}</h2>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:'auto',padding:'22px 20px 0'}}>
        <div style={{maxWidth:780,margin:'0 auto'}}>
          {messages.map((msg,i)=>(
            <Message key={i} msg={msg} isLatestAI={msg.role==='assistant'&&i===messages.length-1}/>
          ))}
          {loading&&(
            <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:20}}>
              <div style={{width:28,height:28,borderRadius:8,flexShrink:0,background:'linear-gradient(135deg,rgba(59,130,246,.2),rgba(147,51,234,.2))',border:'1px solid rgba(59,130,246,.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <i className="ri-ancient-gate-line" style={{fontSize:13,color:'#93c5fd'}}/>
              </div>
              <div style={{display:'flex',gap:5,alignItems:'center',paddingTop:7}}>
                {[0,.18,.36].map((d,i)=>(
                  <span key={i} style={{width:7,height:7,borderRadius:'50%',background:'rgba(147,197,253,.5)',animation:`bounce .88s ${d}s ease-in-out infinite`}}/>
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} style={{height:20}}/>
        </div>
      </div>

      <ChatInputArea onSend={onSend} disabled={loading}/>
    </div>
  )
}

// ── Dashboard (root) ──
function Dashboard() {
  const dispatch      = useDispatch()
  const { user }      = useSelector(s=>s.auth)
  const currentchatid = useSelector(s=>s.chat.currentchatid)
  const chats         = useSelector(s=>s.chat.chats)
  const [mobileOpen,setMobileOpen] = useState(false)

  const { intializesocketconnection, handlegenraterespons, handleloadchats, handleloadmessages, handledeletechat } = usechat()

  useEffect(()=>{intializesocketconnection();handleloadchats()},[])

  const onSelectChat = chatId=>{
    dispatch(setcurrentchatid(chatId))
    if(chats[chatId]?.messages?.length===0) handleloadmessages({chatid:chatId})
    setMobileOpen(false)
  }
  const onNewChat = ()=>{dispatch(setcurrentchatid(null));setMobileOpen(false)}
  const onSend    = content=>handlegenraterespons({message:content,chatid:currentchatid||null})
  const onDelete  = async chatId=>{
    try{
      await handledeletechat({chatid:chatId})
      const updated={...chats}; delete updated[chatId]
      dispatch(setchats(updated))
      if(currentchatid===chatId) dispatch(setcurrentchatid(null))
    }catch(e){console.error(e)}
  }

  const sidebarProps = {chats,selectedChatId:currentchatid,onSelectChat,onDeleteChat:onDelete,onNewChat,user}

  return (
    <>
      <GlobalStyles/>
      <div style={{display:'flex',height:'100dvh',background:'#0d0d0d',overflow:'hidden'}}>

        {/* Desktop Sidebar */}
        <div className="desktop-sidebar" style={{flexShrink:0}}>
          <Sidebar {...sidebarProps}/>
        </div>

        {/* Mobile Overlay */}
        {mobileOpen&&(
          <div style={{position:'fixed',inset:0,zIndex:70}}>
            <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.65)',backdropFilter:'blur(5px)'}} onClick={()=>setMobileOpen(false)}/>
            <div style={{position:'relative',zIndex:1,animation:'slideRight .24s ease'}}>
              <Sidebar {...sidebarProps} onClose={()=>setMobileOpen(false)}/>
            </div>
          </div>
        )}

        {/* Main */}
        <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,overflow:'hidden'}}>
          {/* Mobile TopBar */}
          <div className="mobile-topbar" style={{display:'none',alignItems:'center',gap:12,padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)',background:'#0d0d0d',flexShrink:0}}>
            <button onClick={()=>setMobileOpen(true)} style={{width:36,height:36,borderRadius:10,flexShrink:0,border:'1px solid rgba(255,255,255,0.07)',background:'rgba(255,255,255,.04)',color:'#9ca3af',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <i className="ri-menu-line" style={{fontSize:18}}/>
            </button>
            <LogoIcon size={18}/>
            <span style={{color:'#e8e8e8',fontWeight:700,fontSize:15}}>ZErio AI</span>
          </div>

          {currentchatid===null
            ? <WelcomeScreen onSendMessage={onSend}/>
            : <ChatView currentchatId={currentchatid} chats={chats} onSend={onSend}/>
          }
        </div>
      </div>
    </>
  )
}

export default Dashboard