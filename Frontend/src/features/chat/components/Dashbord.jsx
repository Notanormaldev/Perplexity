import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { usechat } from '../hook/usechat'
import { useauth } from '../../auth/hook/useauth'
import { setcurrentchatid, setchats } from '../chat.slice'
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

  const { intializesocketconnection, handlegenraterespons, handleloadchats, handleloadmessages, handledeletechat } = usechat()
  const { handleLogout, handleDeleteAccount } = useauth()
  const navigate = useNavigate()

  useEffect(() => {
    intializesocketconnection()
    handleloadchats()
  }, [])

  const onSelectChat = (chatId) => {
    dispatch(setcurrentchatid(chatId))
    if (chats[chatId]?.messages?.length === 0) {
      handleloadmessages({ chatid: chatId })
    }
    setMobileOpen(false)
  }

  const onNewChat = () => {
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
    const updated = { ...chats }
    delete updated[chatId]
    dispatch(setchats(updated))
  }

  const sidebarProps = {
    chats,
    selectedChatId: currentchatid,
    onSelectChat,
    onDeleteChat: onDelete,
    onNewChat,
    onHistoryOpen: () => setHistoryOpen(true),
    onSearchOpen: () => setSearchOpen(true),
    user,
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

        {/* Desktop Sidebar */}
        <div style={{ height: '100vh', overflowY: 'auto' }}>
          <Sidebar
            {...sidebarProps}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          />
        </div>

        {/* Mobile Sidebar */}
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
              width: 260,
              height: '100%',
              background: '#131313',
              transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.25s ease',
              overflowY: 'auto'
            }}
          >
            <Sidebar {...sidebarProps} onClose={() => setMobileOpen(false)} />
          </div>
        </div>

        {/* Modals */}
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} chats={chats} onSelectChat={onSelectChat} onNewChat={onNewChat} />
        <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} chats={chats} onSelectChat={onSelectChat} onDeleteChat={onDelete} />
        <RateLimitModal open={!!rateLimitError} onClose={() => setRateLimitError(null)} />

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {currentchatid === null ? (
            <WelcomeScreen onSendMessage={onSend} />
          ) : (
            <ChatView
              currentchatId={currentchatid}
              chats={chats}
              onSend={onSend}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard