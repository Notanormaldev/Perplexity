import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatInputArea } from './ChatInput'

const useTypewriter = (text, active) => {
  const [displayText, setDisplayText] = useState(() => active ? '' : text)
  useEffect(() => {
    if (!active) { setDisplayText(text); return }
    setDisplayText('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayText(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 11)
    return () => clearInterval(id)
  }, [text, active])
  return displayText
}

const IconBtn = ({ onClick, icon, title }) => {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{width:30,height:30,borderRadius:7,border:'none',background:h?'rgba(255,255,255,0.08)':'transparent',color:h?'#ececec':'#71717a',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .14s',flexShrink:0}}>
      <i className={icon} style={{fontSize:15}}/>
    </button>
  )
}

const Message = ({ msg, isLatestAI }) => {
  const isUser = msg.role === 'user'
  const [h, setH] = useState(false)
  const [copied, setCopied] = useState(false)
  const content = useTypewriter(msg.content, isLatestAI && !isUser)
  const copy = () => { navigator.clipboard.writeText(msg.content); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  if (isUser) return (
    <div style={{display:'flex',justifyContent:'flex-end',marginBottom:10}}>
      <div style={{maxWidth:'80%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px 14px 3px 14px',padding:'9px 14px',color:'#ececec',fontSize:14,lineHeight:1.6}}>
        {msg.content.split('\n').filter(line => !line.startsWith('[')).join('\n') || msg.content}
        {msg.fileType && msg.file && (
          <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',gap:6}}>
            <i className={msg.fileType === 'image' ? 'ri-image-line' : msg.fileType === 'pdf' ? 'ri-file-pdf-line' : msg.file?.endsWith('.json') ? 'ri-braces-line' : (msg.file?.endsWith('.docx') || msg.file?.endsWith('.doc')) ? 'ri-file-word-line' : 'ri-file-text-line'} style={{fontSize:12,color:'#9ca3af'}}/>
            <span style={{fontSize:12,color:'#9ca3af'}}>
              {msg.fileType === 'image' ? '📷 Image' : msg.fileType === 'pdf' ? '📄 PDF' : msg.file?.endsWith('.json') ? '📋 JSON' : (msg.file?.endsWith('.docx') || msg.file?.endsWith('.doc')) ? '📄 DOCX' : '📎 Document'} sent
            </span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{marginBottom:14}}>
      <div className="ai-msg" style={{color:'#9ca3af',fontSize:14,lineHeight:1.72}}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
      <div style={{display:'flex',gap:1,marginTop:5,opacity:h?1:0,transition:'opacity .15s'}}>
        {[
          {icon:copied?'ri-check-line':'ri-file-copy-line',fn:copy,label:'Copy'},
          {icon:'ri-loop-left-line',fn:()=>{},label:'Retry'},
          {icon:'ri-share-forward-line',fn:()=>{},label:'Share'},
          {icon:'ri-thumb-up-line',fn:()=>{},label:'Good'},
          {icon:'ri-thumb-down-line',fn:()=>{},label:'Bad'},
        ].map((action, i) => <IconBtn key={i} icon={action.icon} onClick={action.fn} title={action.label}/> )}
      </div>
    </div>
  )
}

export const ChatView = ({ currentchatId, chats, onSend, incognito, selectedModel, onModelChange, onOpenSidebar }) => {
  const { loading } = useSelector(s => s.chat)
  const chat = chats[currentchatId]
  const messages = chat?.messages || []
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({behavior:'smooth'}) }, [messages.length, loading])
  if (!chat) return null

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',height:'100dvh',overflow:'hidden',background:'#0d0d0d'}}>
      {/* Header */}
      <div style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',flexShrink:0,gap:8}}>
        {/* Hamburger — mobile only */}
        <button
          className="mobile-menu-btn"
          onClick={onOpenSidebar}
          title="Open sidebar"
          style={{width:32,height:32,borderRadius:8,border:'none',background:'transparent',color:'#71717a',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .14s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='#ececec'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#71717a'}}
        >
          <i className="ri-menu-line" style={{fontSize:18}}/>
        </button>

        {incognito && (
          <div style={{width:20,height:20,borderRadius:6,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <i className="ri-spy-line" style={{fontSize:11,color:'#3f3f46'}}/>
          </div>
        )}
        <div style={{flex:1,minWidth:0}}>
          {loading ? (
            <div style={{display:'flex',alignItems:'center',gap:5}}>
              {[0,.15,.3].map((d,i)=><span key={i} style={{width:4,height:4,borderRadius:'50%',background:'#3f3f46',animation:`bounce .88s ${d}s ease-in-out infinite`}}/>) }
              <span style={{color:'#3f3f46',fontSize:12,marginLeft:4}}>Thinking…</span>
            </div>
          ) : (
            <h2 className="chat-header-title" style={{color:'#ececec',fontSize:13.5,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{chat.title}</h2>
          )}
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'16px 16px 0'}}>
        <div style={{maxWidth:740,margin:'0 auto'}}>
          {messages.map((msg,i) => <Message key={i} msg={msg} isLatestAI={(msg.role==='ai'||msg.role==='assistant') && i===messages.length-1}/> )}
          {loading && (
            <div style={{display:'flex',gap:4,marginBottom:14,paddingTop:2}}>
              {[0,.18,.36].map((d,i)=>(
                <span key={i} style={{width:5,height:5,borderRadius:'50%',background:'rgba(255,255,255,0.15)',animation:`bounce .88s ${d}s ease-in-out infinite`}}/>
              ))}
            </div>
          )}
          <div ref={endRef} style={{height:12}}/>
        </div>
      </div>
      <ChatInputArea onSend={onSend} disabled={loading} selectedModel={selectedModel} onModelChange={onModelChange}/>
    </div>
  )
}

