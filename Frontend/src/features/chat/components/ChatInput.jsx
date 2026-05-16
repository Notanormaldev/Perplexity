import React, { useState, useRef, useEffect } from 'react'

const MODELS = [
  {id:'gemini',label:'Gemini',provider:'Google',icon:'ri-google-line'},
  {id:'openai',label:'OpenAI GPT-3.5',provider:'OpenAI',icon:'ri-openai-line'},
  {id:'cohere',label:'Cohere',provider:'Cohere',icon:'ri-robot-2-line'},
  {id:'mistral',label:'Mistral',provider:'Mistral',icon:'ri-wind-line'},
  {id:'deepseek',label:'DeepSeek',provider:'DeepSeek',icon:'ri-search-line'},
]

const ModelDropdownPortal = ({ refEl, children }) => {
  const [pos, setPos] = useState({ bottom: 0, left: 0 })
  useEffect(() => {
    if (refEl?.current) {
      const rect = refEl.current.getBoundingClientRect()
      setPos({
        bottom: window.innerHeight - rect.top + 6,
        left: rect.left,
      })
    }
  }, [refEl])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: pos.bottom,
        left: pos.left,
        background: '#1e1e1e',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: '4px',
        boxShadow: '0 16px 40px rgba(0,0,0,.7)',
        zIndex: 9999,
        minWidth: 220,
        animation: 'dropDown .16s ease',
      }}
    >
      {children}
    </div>
  )
}

const ModelSelector = ({ selectedModel, onSelect }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const [h, setH] = useState(false)

  useEffect(() => {
    const fn = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const current = MODELS.find(m => m.id === selectedModel) || MODELS[0]
  const byProvider = MODELS.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = []
    acc[m.provider].push(m)
    return acc
  }, {})

  return (
    <div ref={ref} style={{position:'relative'}}>
      <button onClick={() => setOpen(p => !p)}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{display:'flex',alignItems:'center',gap:5,padding:'5px 10px',borderRadius:8,border:'1px solid rgba(255,255,255,0.07)',background:open||h?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.03)',color:'#a1a1aa',cursor:'pointer',fontSize:12.5,fontWeight:500,transition:'all .14s',flexShrink:0}}>
        <i className={current.icon} style={{fontSize:13,color:'#71717a'}}/>
        <span>{current.label}</span>
        <i className={`ri-arrow-${open?'up':'down'}-s-line`} style={{fontSize:13,color:'#52525b'}}/>
      </button>
      {open && (
        <ModelDropdownPortal refEl={ref}>
          {Object.entries(byProvider).map(([provider, models]) => (
            <div key={provider}>
              <p style={{color:'#3f3f46',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em',padding:'7px 10px 4px'}}>{provider}</p>
              {models.map(m => (
                <button key={m.id} onClick={() => { onSelect(m.id); setOpen(false) }}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:8,border:'none',background:selectedModel===m.id?'rgba(255,255,255,0.08)':'transparent',color:selectedModel===m.id?'#ececec':'#a1a1aa',fontSize:13,cursor:'pointer',textAlign:'left',transition:'all .12s'}}
                  onMouseEnter={e=>{if(selectedModel!==m.id)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
                  onMouseLeave={e=>{if(selectedModel!==m.id)e.currentTarget.style.background='transparent'}}>
                  <i className={m.icon} style={{fontSize:13,color:'#52525b',flexShrink:0}}/>
                  <span style={{flex:1}}>{m.label}</span>
                  {selectedModel===m.id && <i className="ri-check-line" style={{fontSize:13,color:'#9ca3af'}}/>}
                </button>
              ))}
            </div>
          ))}
        </ModelDropdownPortal>
      )}
    </div>
  )
}

const AttachDropdownPortal = ({ refEl, children }) => {
  const [pos, setPos] = useState({ bottom: 0, left: 0 })
  useEffect(() => {
    if (refEl?.current) {
      const rect = refEl.current.getBoundingClientRect()
      setPos({
        bottom: window.innerHeight - rect.top + 6,
        left: rect.left,
      })
    }
  }, [refEl])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: pos.bottom,
        left: pos.left,
        background: '#1e1e1e',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 11,
        padding: '4px',
        boxShadow: '0 10px 32px rgba(0,0,0,.65)',
        zIndex: 9999,
        minWidth: 175,
        animation: 'dropDown .16s ease',
      }}
    >
      {children}
    </div>
  )
}

const AttachMenu = ({ onAttach }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const [h, setH] = useState(false)

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const opts = [
    {icon:'ri-image-line',label:'Image',accept:'image/png,image/jpeg,image/gif,image/webp'},
    {icon:'ri-file-pdf-line',label:'PDF Document',accept:'application/pdf'},
    {icon:'ri-file-word-line',label:'Word / DOCX',accept:'.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'},
    {icon:'ri-braces-line',label:'JSON / Text',accept:'.json,.txt,.csv,application/json,text/plain,text/csv'},
  ]

  return (
    <div ref={ref} style={{position:'relative',flexShrink:0}}>
      <button onClick={() => setOpen(p => !p)} title="Attach file"
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{width:32,height:32,borderRadius:8,border:'none',background:open||h?'rgba(255,255,255,0.08)':'transparent',color:open||h?'#a1a1aa':'#52525b',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .14s'}}>
        <i className="ri-add-line" style={{fontSize:17}}/>
      </button>
      {open && (
        <AttachDropdownPortal refEl={ref}>
          {opts.map(opt => (
            <label key={opt.label}
              style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',cursor:'pointer',borderRadius:8,color:'#a1a1aa',fontSize:13,transition:'all .12s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='#ececec'}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#a1a1aa'}}>
              <i className={opt.icon} style={{fontSize:15,flexShrink:0}}/>
              {opt.label}
              <input type="file" accept={opt.accept} style={{display:'none'}}
                onChange={e=>{if(e.target.files[0]){onAttach(e.target.files[0]);setOpen(false);e.target.value=''}}}/>
            </label>
          ))}
        </AttachDropdownPortal>
      )}
    </div>
  )
}

const SBtn = ({ onClick, icon, title, canSend, isRec }) => {
  const [h, setH] = useState(false)
  let bg='transparent', color='#52525b'
  if (isRec) { bg='rgba(239,68,68,0.12)'; color='#f87171' }
  else if (canSend) { bg=h?'rgba(255,255,255,0.14)':'rgba(255,255,255,0.09)'; color='#ececec' }
  else if (h) { bg='rgba(255,255,255,0.06)'; color='#71717a' }

  return (
    <button onClick={onClick} title={title}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:32,height:32,borderRadius:9,border:'none',background:bg,color,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .13s',flexShrink:0}}>
      <i className={icon} style={{fontSize:16}}/>
    </button>
  )
}

const SuggestionRow = ({ text, onClick }) => {
  const [h, setH] = useState(false)
  return (
    <div onClick={() => onClick(text)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 4px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.05)',transition:'all .13s'}}>
      <span style={{color:h?'#ececec':'#9ca3af',fontSize:13.5,lineHeight:1.4,flex:1,transition:'color .13s'}}>{text}</span>
      <i className="ri-arrow-right-up-line" style={{fontSize:13,color:h?'#71717a':'#3f3f46',flexShrink:0,marginLeft:14,transition:'color .13s'}}/>
    </div>
  )
}

const ChipButton = ({ icon, text, onClick }) => {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:20,background:h?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.04)',border:`1px solid ${h?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.06)'}`,color:h?'#ececec':'#9ca3af',fontSize:12.5,cursor:'pointer',whiteSpace:'nowrap',transition:'all .16s',flexShrink:0}}>
      <i className={icon} style={{fontSize:13}}/>{text}
    </button>
  )
}

const CHIPS = [
  {icon:'ri-code-s-slash-line',text:'Explain code'},
  {icon:'ri-translate-2',text:'Translate'},
  {icon:'ri-file-text-line',text:'Summarize'},
  {icon:'ri-lightbulb-line',text:'Give ideas'},
]

const SUGGESTIONS = [
  'How does machine learning actually work?',
  'Build a full stack app with React and Node.js',
  'Explain REST API vs GraphQL with examples',
  'What is RAG and how to implement it in Node?',
  'Best practices for MongoDB schema design',
  'How to deploy a MERN app to production?',
]

const InputBar = ({ value, onChange, onSubmit, onKeyDown, onAudio, isRecording, textareaRef, disabled, large, attachedFile, onAttach, onRemoveFile, selectedModel, onModelChange, showModel }) => {
  const [focused, setFocused] = useState(false)
  const autoH = e => { e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,144)+'px' }

  return (
    <div style={{
      background:'rgba(255,255,255,0.05)',
      border:`1px solid ${focused?'rgba(255,255,255,0.13)':'rgba(255,255,255,0.08)'}`,
      borderRadius:14,
      transition:'border-color .18s',
      overflow:'visible',
      position:'relative',
    }}>
      {attachedFile && (
        <div style={{padding:'7px 12px 0',display:'flex'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:8,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.09)'}}>
            <i className={attachedFile.name.endsWith('.pdf') ? 'ri-file-pdf-line' : attachedFile.name.endsWith('.docx')||attachedFile.name.endsWith('.doc') ? 'ri-file-word-line' : attachedFile.name.endsWith('.json') ? 'ri-braces-line' : attachedFile.type.startsWith('image/') ? 'ri-image-line' : 'ri-file-text-line'} style={{fontSize:12,color:'#9ca3af'}}/>
            <span style={{color:'#9ca3af',fontSize:12,maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{attachedFile.name}</span>
            <button onClick={onRemoveFile} style={{border:'none',background:'transparent',color:'#52525b',cursor:'pointer',padding:0,display:'flex',lineHeight:1}}>
              <i className="ri-close-line" style={{fontSize:13}}/>
            </button>
          </div>
        </div>
      )}
      <div style={{display:'flex',alignItems:'flex-end',padding:'8px 8px 8px 6px',gap:4}}>
        <AttachMenu onAttach={onAttach}/>
        <textarea ref={textareaRef} value={value} disabled={disabled}
          onChange={e=>{onChange(e.target.value);autoH(e)}} onKeyDown={onKeyDown}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          placeholder="Ask anything…" rows={1}
          style={{flex:1,background:'transparent',border:'none',outline:'none',color:disabled?'#52525b':'#ececec',fontSize:large?15:14,resize:'none',lineHeight:1.55,padding:'5px 6px',fontFamily:'inherit',maxHeight:144,overflowY:'auto',alignSelf:'center'}}/>
        {isRecording && <span style={{color:'#f87171',fontSize:11,display:'flex',alignItems:'center',gap:3,marginBottom:6,flexShrink:0}}>
          <span style={{width:5,height:5,borderRadius:'50%',background:'#f87171',animation:'pulseDot 1s ease-in-out infinite',display:'inline-block'}}/>
          Rec
        </span>}
        <SBtn icon={isRecording?'ri-stop-circle-line':'ri-mic-line'} onClick={onAudio} isRec={isRecording} title={isRecording?'Stop':'Voice'}/>
        <SBtn icon="ri-arrow-up-line" onClick={onSubmit} canSend={(!!value.trim()||!!attachedFile)&&!disabled} title="Send"/>
      </div>
      {showModel && (
        <div style={{padding:'0 10px 8px',display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
          <ModelSelector selectedModel={selectedModel} onSelect={onModelChange}/>
        </div>
      )}
    </div>
  )
}

const useSpeechRecognition = (onTranscript) => {
  const [isRec, setRec] = useState(false)
  const recognitionRef = useRef(null)
  const keepRecordingRef = useRef(false)

  const startStop = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      alert('Voice input is not supported in this browser. Use Chrome or Edge with microphone access.')
      return
    }
    if (isRec) {
      keepRecordingRef.current = false
      recognitionRef.current?.stop()
      return
    }
    keepRecordingRef.current = true
    const r = new SR()
    r.lang = 'en-US'
    r.continuous = true
    r.interimResults = true
    r.maxAlternatives = 1
    r.onstart = () => setRec(true)
    r.onresult = e => {
      let newTranscript = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          newTranscript += e.results[i][0]?.transcript || ''
        }
      }
      if (newTranscript) onTranscript(newTranscript)
    }
    r.onend = () => {
      if (keepRecordingRef.current) {
        setTimeout(() => {
          if (keepRecordingRef.current) {
            try { r.start() } catch (error) { console.error('Restart recognition failed:', error); setRec(false); recognitionRef.current = null }
          }
        }, 200)
        return
      }
      setRec(false)
      recognitionRef.current = null
    }
    r.onerror = event => {
      const errorType = event?.error || event?.message || 'unknown'
      console.error('Speech recognition error:', event)
      keepRecordingRef.current = false
      setRec(false)
      recognitionRef.current = null
      if (errorType === 'not-allowed' || errorType === 'service-not-allowed') {
        alert('Microphone access denied. Please allow microphone permission and try again.')
      }
      if (errorType === 'no-speech' || errorType === 'audio-capture') {
        alert('No speech detected. Please speak clearly or check your microphone.')
      }
    }
    recognitionRef.current = r
    r.start()
  }

  return { isRec, startStop, stop: () => { keepRecordingRef.current = false; recognitionRef.current?.stop() } }
}

const UploadConfirmation = ({ message }) => {
  if (!message) return null
  return (
    <div style={{margin:'10px auto 0',maxWidth:600,padding:'10px 14px',borderRadius:12,background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.25)',color:'#d9f99d',fontSize:13,textAlign:'center'}}>
      {message}
    </div>
  )
}

const WelcomeScreen = ({ onSendMessage, incognito, onToggleIncognito, selectedModel, onModelChange }) => {
  const [value, setValue] = useState('')
  const [attachedFile, setAttachedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const textareaRef = useRef(null)
  const { isRec, startStop } = useSpeechRecognition(newTranscript => {
    setValue(prev => prev + newTranscript)
  })

  const submit = async () => {
    const trimmed = value.trim()
    if (!trimmed && !attachedFile) return
    const message = trimmed || (attachedFile?.type.startsWith('image/') ? 'Describe this image' : 'Upload document')
    const fileToSend = attachedFile
    setValue('')
    setAttachedFile(null)
    try {
      await onSendMessage({ message, file: fileToSend, model: selectedModel })
      if (fileToSend?.type === 'application/json' || fileToSend?.name?.endsWith('.json')) {
        setUploadStatus('JSON file ingested successfully.')
      } else if (fileToSend) {
        setUploadStatus('File uploaded successfully.')
      }
    } catch (err) {
      setUploadStatus('Upload failed. Please try again.')
    }
    window.setTimeout(() => setUploadStatus(''), 3600)
  }

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }
  const handleAudio = () => startStop()

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 24px 32px',background:incognito?'#090909':'#0d0d0d',minHeight:'100dvh',transition:'background .3s',position:'relative',overflowY:'auto'}}>
      <button onClick={onToggleIncognito}
        title={incognito?'Incognito ON':'Enable Incognito'}
        style={{position:'absolute',top:14,right:14,width:34,height:34,borderRadius:9,border:incognito?'1px solid rgba(255,255,255,0.14)':'1px solid rgba(255,255,255,0.06)',background:incognito?'rgba(255,255,255,0.08)':'transparent',color:incognito?'#d4d4d8':'#3f3f46',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s',zIndex:10}}
        onMouseEnter={e=>{if(!incognito){e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='#71717a'}}}
        onMouseLeave={e=>{if(!incognito){e.currentTarget.style.background='transparent';e.currentTarget.style.color='#3f3f46'}}}>
        <i className="ri-spy-line" style={{fontSize:15}}/>
      </button>

      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:20,textAlign:'center',marginTop:'13rem'}}>
        <h1 style={{fontSize:70,fontWeight:200,color:'#ececec',letterSpacing:'-.02em',marginTop:10,marginBottom:2}}>ZErio AI</h1>
        <p style={{color:'#3f3f46',fontSize:13}}>Smart answers, instantly</p>
        {incognito && (
          <div style={{display:'flex',alignItems:'center',gap:5,marginTop:8,padding:'4px 10px',borderRadius:20,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)'}}>
            <i className="ri-spy-line" style={{fontSize:11,color:'#52525b'}}/>
            <span style={{color:'#52525b',fontSize:11}}>Incognito — chats won't be saved</span>
          </div>
        )}
      </div>

      <div style={{width:'100%',maxWidth:600,marginBottom:12}}>
        <InputBar value={value} onChange={setValue} onSubmit={submit} onKeyDown={handleKey}
          onAudio={handleAudio} isRecording={isRec} textareaRef={textareaRef} large
          attachedFile={attachedFile} onAttach={setAttachedFile} onRemoveFile={()=>setAttachedFile(null)}
          selectedModel={selectedModel} onModelChange={onModelChange} showModel/>
        <UploadConfirmation message={uploadStatus} />
      </div>

      <div style={{display:'flex',flexWrap:'wrap',gap:7,justifyContent:'center',marginBottom:18,maxWidth:600,width:'100%'}}>
        {CHIPS.map((c,i)=><ChipButton key={i} icon={c.icon} text={c.text} onClick={()=>onSendMessage({message: c.text, file: null, model: selectedModel})}/>) }
      </div>

      <div style={{width:'100%',maxWidth:600}}>
        {SUGGESTIONS.map((s,i)=><SuggestionRow key={i} text={s} onClick={(text)=>onSendMessage({message: text, file: null, model: selectedModel})}/>)}
      </div>
    </div>
  )
}

export const ChatInputArea = ({ onSend, disabled, selectedModel, onModelChange }) => {
  const [value, setValue] = useState('')
  const [attachedFile, setAttachedFile] = useState(null)
  const textareaRef = useRef(null)
  const { isRec, startStop } = useSpeechRecognition(transcript => setValue(prev => prev + transcript))

  const [uploadStatus, setUploadStatus] = useState('')

  const submit = async () => {
    const trimmed = value.trim()
    if ((!trimmed && !attachedFile) || disabled) return
    const message = trimmed || (attachedFile?.type.startsWith('image/') ? 'Describe this image' : 'Upload document')
    const fileToSend = attachedFile
    setValue('')
    setAttachedFile(null)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    try {
      await onSend({ message, file: fileToSend, model: selectedModel })
      if (fileToSend?.type === 'application/json' || fileToSend?.name?.endsWith('.json')) {
        setUploadStatus('JSON file ingested successfully.')
      } else if (fileToSend) {
        setUploadStatus('File uploaded successfully.')
      }
    } catch (err) {
      setUploadStatus('Upload failed. Please try again.')
    }
    window.setTimeout(() => setUploadStatus(''), 3600)
  }

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }
  const handleAudio = () => startStop()

  return (
    <div style={{padding:'0 14px 14px',borderTop:'1px solid rgba(255,255,255,0.06)',background:'#0d0d0d',flexShrink:0}}>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <div style={{paddingTop:10,marginBottom:8}}>
          <InputBar value={value} onChange={setValue} onSubmit={submit} onKeyDown={handleKey}
            onAudio={handleAudio} isRecording={isRec} textareaRef={textareaRef} disabled={disabled}
            attachedFile={attachedFile} onAttach={setAttachedFile} onRemoveFile={()=>setAttachedFile(null)}
            selectedModel={selectedModel} onModelChange={onModelChange} showModel/>
        </div>
        <div style={{display:'flex',gap:6,overflowX:'auto'}}>
          {CHATS.map((c,i)=><ChipButton key={i} icon={c.icon} text={c.text} onClick={()=>setValue(c.text+' ')}/>)}
        </div>
      </div>
    </div>
  )
}

const CHATS = [
  {icon:'ri-code-s-slash-line',text:'Explain code'},
  {icon:'ri-translate-2',text:'Translate'},
  {icon:'ri-file-text-line',text:'Summarize'},
  {icon:'ri-lightbulb-line',text:'Give ideas'},
]

export { WelcomeScreen }
