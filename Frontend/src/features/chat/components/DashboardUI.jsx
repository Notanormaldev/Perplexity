import React, { useState } from 'react'

export const GlobalStyles = () => (
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
    @keyframes scaleIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
    @keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
    @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes dropDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
    .ai-msg p{margin-bottom:8px;line-height:1.7}
    .ai-msg p:last-child{margin-bottom:0}
    .ai-msg code{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.09);padding:2px 6px;border-radius:5px;font-size:.86em;color:#e4e4e7;font-family:'JetBrains Mono',monospace}
    .ai-msg pre{background:#080808;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px 16px;margin:10px 0;overflow-x:auto}
    .ai-msg pre code{background:none;border:none;padding:0;color:#d4d4d4;font-size:13px;line-height:1.6}
    .ai-msg h1,.ai-msg h2,.ai-msg h3{color:#ececec;font-weight:600;margin:14px 0 6px}
    .ai-msg ul,.ai-msg ol{padding-left:20px;margin:6px 0}
    .ai-msg li{margin-bottom:3px}
    .ai-msg strong{color:#ececec;font-weight:600}
    .ai-msg a{color:#a1a1aa;text-decoration:underline;text-underline-offset:2px}
    .ai-msg blockquote{border-left:2px solid rgba(255,255,255,0.12);padding-left:12px;margin:8px 0;color:#71717a;font-style:italic}
    .ai-msg table{width:100%;border-collapse:collapse;margin:10px 0;font-size:13px}
    .ai-msg th,.ai-msg td{padding:7px 12px;border:1px solid rgba(255,255,255,0.07);text-align:left}
    .ai-msg th{background:rgba(255,255,255,0.04);color:#ececec;font-weight:500}
    .ai-msg hr{border:none;border-top:1px solid rgba(255,255,255,0.07);margin:14px 0}
    @media(max-width:768px){
      .desktop-sidebar{display:none!important}
      .mobile-topbar{display:flex!important}
      .welcome-suggestions{display:none!important}
      .welcome-chips{flex-wrap:wrap;gap:6px!important;justify-content:center!important}
      .welcome-title{font-size:42px!important;margin-top:5rem!important}
      .welcome-subtitle{font-size:12px!important}
      .welcome-center{margin-top:0!important;margin-bottom:14px!important}
      .chat-header-title{font-size:12.5px!important}
      .chat-input-area{padding:0 10px 12px!important}
    }
    @media(min-width:769px){
      .mobile-topbar{display:none!important}
      .mobile-menu-btn{display:none!important}
    }
  `}</style>
)

export const LogoIcon = ({ size = 22 }) => (
  <div style={{maskImage:'linear-gradient(to bottom,white 40%,transparent 100%)',WebkitMaskImage:'linear-gradient(to bottom,white 40%,transparent 100%)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
    <i className="ri-ancient-gate-line" style={{fontSize:size,color:'#9ca3af'}}/>
  </div>
)

export const IconBtn = ({ onClick, icon, title }) => {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{width:30,height:30,borderRadius:7,border:'none',background:h?'rgba(255,255,255,0.08)':'transparent',color:h?'#ececec':'#71717a',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .14s',flexShrink:0}}>
      <i className={icon} style={{fontSize:15}}/>
    </button>
  )
}

export const ConfirmModal = ({ open, title, message, confirmText='Confirm', onConfirm, onCancel, danger }) => {
  if (!open) return null
  return (
    <div style={{position:'fixed',inset:0,zIndex:350,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.8)',backdropFilter:'blur(6px)'}} onClick={onCancel}/>
      <div style={{position:'relative',background:'#1c1c1c',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:'22px',width:'calc(100% - 40px)',maxWidth:340,margin:'0 20px',boxShadow:'0 25px 60px rgba(0,0,0,.7)',animation:'scaleIn .18s ease'}}>
        <h3 style={{color:'#ececec',fontSize:16,fontWeight:600,marginBottom:8}}>{title}</h3>
        <p style={{color:'#a1a1aa',fontSize:13,lineHeight:1.55,marginBottom:22}}>{message}</p>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button onClick={onCancel} style={{padding:'8px 16px',borderRadius:8,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'#a1a1aa',fontSize:13,cursor:'pointer'}}>Cancel</button>
          <button onClick={onConfirm} style={{padding:'8px 16px',borderRadius:8,border:danger?'1px solid rgba(239,68,68,0.35)':'1px solid rgba(255,255,255,0.18)',background:danger?'rgba(239,68,68,0.14)':'rgba(255,255,255,0.08)',color:danger?'#f87171':'#ececec',fontSize:13,fontWeight:500,cursor:'pointer'}}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}

export const IncognitoLeaveModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null
  return (
    <div style={{position:'fixed',inset:0,zIndex:400,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.88)',backdropFilter:'blur(10px)'}} onClick={onCancel}/>
      <div style={{position:'relative',background:'#161616',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:'28px 24px',width:'calc(100% - 40px)',maxWidth:360,margin:'0 20px',boxShadow:'0 30px 80px rgba(0,0,0,.9)',animation:'scaleIn .2s ease',textAlign:'center'}}>
        <div style={{width:52,height:52,borderRadius:14,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
          <i className="ri-spy-line" style={{fontSize:20,color:'#52525b'}}/>
        </div>
        <h3 style={{color:'#ececec',fontSize:16,fontWeight:600,marginBottom:8}}>Leave Incognito?</h3>
        <p style={{color:'#71717a',fontSize:13,lineHeight:1.65,marginBottom:6}}>Your incognito conversation will be <strong style={{color:'#a1a1aa'}}>permanently deleted</strong>.</p>
        <p style={{color:'#3f3f46',fontSize:12,marginBottom:24}}>This action cannot be undone.</p>
        <div style={{display:'flex',gap:8}}>
          <button onClick={onCancel} style={{flex:1,padding:'10px',borderRadius:10,border:'1px solid rgba(255,255,255,0.08)',background:'transparent',color:'#a1a1aa',fontSize:13,cursor:'pointer'}}>Stay</button>
          <button onClick={onConfirm} style={{flex:1,padding:'10px',borderRadius:10,border:'1px solid rgba(239,68,68,0.25)',background:'rgba(239,68,68,0.1)',color:'#f87171',fontSize:13,fontWeight:500,cursor:'pointer'}}>Delete & Leave</button>
        </div>
      </div>
    </div>
  )
}

export const RateLimitModal = ({ open, onClose, title, message }) => {
  if (!open) return null
  return (
    <div style={{position:'fixed',inset:0,zIndex:350,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.8)',backdropFilter:'blur(6px)'}} onClick={onClose}/>
      <div style={{position:'relative',background:'#1c1c1c',border:'1px solid rgba(239,68,68,0.25)',borderRadius:16,padding:'24px',width:'calc(100% - 40px)',maxWidth:360,margin:'0 20px',boxShadow:'0 25px 60px rgba(0,0,0,.7)',animation:'scaleIn .18s ease'}}>
        <div style={{width:48,height:48,borderRadius:12,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
          <i className="ri-alert-line" style={{fontSize:24,color:'#f87171'}}/>
        </div>
        <h3 style={{color:'#ececec',fontSize:16,fontWeight:600,marginBottom:8,textAlign:'center'}}>{title}</h3>
        <p style={{color:'#a1a1aa',fontSize:13,lineHeight:1.55,marginBottom:20,textAlign:'center'}}>{message}</p>
        <button onClick={onClose} style={{width:'100%',padding:'10px 16px',borderRadius:10,border:'1px solid rgba(239,68,68,0.35)',background:'rgba(239,68,68,0.14)',color:'#f87171',fontSize:13,fontWeight:500,cursor:'pointer'}}>Understood</button>
      </div>
    </div>
  )
}
