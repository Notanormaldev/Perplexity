import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { usechat } from '../hook/usechat'
import { useauth } from '../../auth/hook/useauth'
import { setcurrentchatid, setchats, removeChat } from '../chat.slice'
import { Sidebar, SearchModal, HistoryModal } from './ChatSidebar'
import { ChatView } from './ChatView'
import { WelcomeScreen } from './ChatInput'
import { GlobalStyles, RateLimitModal, IncognitoLeaveModal } from './DashboardUI'

function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const currentchatid = useSelector(s => s.chat.currentchatid)
  const chats = useSelector(s => s.chat.chats)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [incognito, setIncognito] = useState(false)
  const [rateLimitError, setRateLimitError] = useState(null)
  const [selectedModel, setSelectedModel] = useState('gemini')
  const [showIncognitoLeave, setShowIncognitoLeave] = useState(false)

  const pendingActionRef = useRef(null)
  const currentChatIdRef = useRef(currentchatid)
  currentChatIdRef.current = currentchatid

  const { intializesocketconnection, handlegenraterespons, handleloadchats, handleloadmessages, handledeletechat } = usechat()
  const { handleLogout, handleDeleteAccount } = useauth()
  const navigate = useNavigate()

  const shouldInterceptNavigation = () => {
    return incognito && currentchatid !== null
  }

  const interceptWithIncognitoPopup = (action) => {
    pendingActionRef.current = action
    setShowIncognitoLeave(true)
  }

  const handleIncognitoLeaveConfirm = () => {
    setShowIncognitoLeave(false)
    const chatToDelete = currentChatIdRef.current

    if (chatToDelete) {
      dispatch(removeChat(chatToDelete))
      dispatch(setcurrentchatid(null))
      handledeletechat({ chatid: chatToDelete })
        .then(() => handleloadchats())
        .catch(err => console.error('Failed to delete incognito chat:', err))
    }

    setIncognito(false)

    if (pendingActionRef.current) {
      pendingActionRef.current()
      pendingActionRef.current = null
    }
  }

  const handleIncognitoLeaveCancel = () => {
    setShowIncognitoLeave(false)
    pendingActionRef.current = null
  }

  const handleToggleIncognito = () => {
    if (incognito) {
      if (currentchatid) {
        interceptWithIncognitoPopup(null)
      } else {
        setIncognito(false)
      }
    } else {
      setIncognito(true)
    }
  }

  useEffect(() => {
    intializesocketconnection()
    handleloadchats()
  }, [])

  const onSelectChat = (chatId) => {
    if (shouldInterceptNavigation()) {
      interceptWithIncognitoPopup(() => {
        dispatch(setcurrentchatid(chatId))
        if (chats[chatId]?.messages?.length === 0) {
          handleloadmessages({ chatid: chatId })
        }
      })
      return
    }
    dispatch(setcurrentchatid(chatId))
    if (chats[chatId]?.messages?.length === 0) {
      handleloadmessages({ chatid: chatId })
    }
    setMobileOpen(false)
  }

  const onNewChat = () => {
    if (shouldInterceptNavigation()) {
      interceptWithIncognitoPopup(null)
      return
    }
    dispatch(setcurrentchatid(null))
    setMobileOpen(false)
  }

  const onSend = (data) => {
    const { message, file, model } =
      typeof data === 'string'
        ? { message: data, file: null }
        : data

    return handlegenraterespons({
      message,
      chatid: currentchatid,
      file,
      model,
      onRateLimit: setRateLimitError,
    })
  }

  const onDelete = async (chatId) => {
    await handledeletechat({ chatid: chatId })
    dispatch(removeChat(chatId))
  }

  const onHistoryOpen = () => {
    if (shouldInterceptNavigation()) {
      interceptWithIncognitoPopup(() => setHistoryOpen(true))
      return
    }
    setHistoryOpen(true)
  }

  const onSearchOpen = () => {
    if (shouldInterceptNavigation()) {
      interceptWithIncognitoPopup(() => setSearchOpen(true))
      return
    }
    setSearchOpen(true)
  }

  const sidebarProps = {
    chats,
    selectedChatId: currentchatid,
    onSelectChat,
    onDeleteChat: onDelete,
    onNewChat,
    onHistoryOpen,
    onSearchOpen,
    user,
    hideChatId: incognito ? currentchatid : undefined,
    onLogout: async () => {
      await handleLogout()
      navigate('/login')
    },
    onDeleteAccount: async () => {
      await handleDeleteAccount()
      navigate('/login')
    },
  }

  return (
    <>
      <GlobalStyles />

      <div style={{ display: 'flex', height: '100vh' }}>

        {/* Desktop Sidebar — hidden via CSS on mobile */}
        <div className="desktop-sidebar" style={{ height: '100vh', overflowY: 'auto' }}>
          <Sidebar
            {...sidebarProps}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            pointerEvents: mobileOpen ? 'auto' : 'none'
          }}
        >
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,.6)',
              opacity: mobileOpen ? 1 : 0,
              transition: '0.2s'
            }}
          />

          <div
            style={{
              width: 272,
              height: '100%',
              background: '#131313',
              transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.28s cubic-bezier(.4,0,.2,1)',
              overflowY: 'auto',
              boxShadow: mobileOpen ? '4px 0 40px rgba(0,0,0,.7)' : 'none',
            }}
          >
            <Sidebar {...sidebarProps} onClose={() => setMobileOpen(false)} />
          </div>
        </div>

        {/* Modals */}
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} chats={chats} onSelectChat={onSelectChat} onNewChat={onNewChat} />
        <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} chats={chats} onSelectChat={onSelectChat} onDeleteChat={onDelete} />
        <RateLimitModal open={!!rateLimitError} onClose={() => setRateLimitError(null)} title={rateLimitError?.title || 'Too Many Requests'} message={rateLimitError?.message || 'You are sending too many requests. Please try again later.'} />
        <IncognitoLeaveModal open={showIncognitoLeave} onConfirm={handleIncognitoLeaveConfirm} onCancel={handleIncognitoLeaveCancel} />

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {currentchatid === null || !chats[currentchatid] ? (
            <WelcomeScreen
              onSendMessage={onSend}
              incognito={incognito}
              onToggleIncognito={handleToggleIncognito}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              onOpenSidebar={() => setMobileOpen(true)}
            />
          ) : (
            <ChatView
              currentchatId={currentchatid}
              chats={chats}
              onSend={onSend}
              incognito={incognito}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              onOpenSidebar={() => setMobileOpen(true)}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard