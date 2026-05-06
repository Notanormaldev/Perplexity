import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { usechat } from '../hook/usechat'
import { setcurrentchatid, setchats } from '../chat.slice'
import { deletechat } from '../services/chat.api'
import 'remixicon/fonts/remixicon.css'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
// Logo with fade effect
const LogoIcon = ({ size = 24, withFade = false }) => {
  return (
    <div
      style={withFade ? {
        maskImage: 'linear-gradient(to bottom, white 30%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, white 30%, transparent 100%)'
      } : {}}
    >
      <i className={`ri-ancient-gate-line`} style={{ fontSize: `${size}px` }}></i>
    </div>
  )
}

// Sidebar Component
const Sidebar = ({ chats, selectedChatId, onSelectChat, onDeleteChat, onNewChat }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  
  const groupChatsByDate = (chatsObj, searchTerm) => {
    // Convert chats object to array
    const chatsArray = Object.values(chatsObj)
    
    let filtered = chatsArray
    if (searchTerm) {
      filtered = chatsArray.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const groups = {
      today: [],
      yesterday: [],
      '3daysAgo': [],
      '7daysAgo': [],
      '30daysAgo': []
    }

    filtered.forEach(chat => {
      // Get the date from lastUpdated or use current date
      const chatDateStr = chat.lastUpdated
      const chatDate = chatDateStr ? new Date(chatDateStr) : new Date()
      const chatDateOnly = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate())
      const diff = Math.floor((today - chatDateOnly) / (1000 * 60 * 60 * 24))
      
      if (diff === 0) groups.today.push(chat)
      else if (diff === 1) groups.yesterday.push(chat)
      else if (diff <= 3) groups['3daysAgo'].push(chat)
      else if (diff <= 7) groups['7daysAgo'].push(chat)
      else if (diff <= 30) groups['30daysAgo'].push(chat)
    })

    return groups
  }

  const groups = groupChatsByDate(chats, searchTerm)

  const ChatRow = ({ chat }) => {
    const [showMenu, setShowMenu] = useState(false)
    const isSelected = selectedChatId === chat.id

    return (
      <div
        onClick={() => onSelectChat(chat.id)}
        className={`px-3 py-2 rounded mb-2 cursor-pointer transition-colors group relative ${
          isSelected ? 'bg-zinc-800' : 'hover:bg-zinc-900'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 text-lg">•</span>
          <span className="text-sm text-zinc-300 truncate flex-1">{chat.title}</span>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition"
            >
              <i className="ri-more-2-fill"></i>
            </button>
            
            {showMenu && (
              <div
                className="absolute right-0 top-6 bg-zinc-900 border border-zinc-800 rounded py-1 z-50"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(chat.id)
                    setShowMenu(false)
                  }}
                  className="block w-full text-left px-3 py-1 text-sm text-red-400 hover:bg-zinc-800"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const GroupSection = ({ label, chats: groupChats }) => {
    if (groupChats.length === 0) return null
    return (
      <div className="mb-6">
        <h3 className="text-xs uppercase text-zinc-600 px-3 mb-2 tracking-wider">{label}</h3>
        <div>
          {groupChats.map(chat => (
            <ChatRow key={chat.id} chat={chat} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-60 bg-black border-r border-zinc-900 h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Header */}
      <div className="border-b border-zinc-900 p-4">
        <div className="flex items-center gap-2 mb-4">
          <LogoIcon size={24} withFade={true} />
          <span className="text-sm font-semibold text-zinc-200">ZErio Ai</span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-300 text-sm rounded px-3 py-2 border border-zinc-800 focus:outline-none focus:border-zinc-700 placeholder-zinc-600"
          />
          <i className="ri-search-line absolute right-3 top-2.5 text-zinc-600 text-sm"></i>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-sm rounded py-2 transition"
        >
          + New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <GroupSection label="Today" chats={groups.today} />
        <GroupSection label="Yesterday" chats={groups.yesterday} />
        <GroupSection label="3 days ago" chats={groups['3daysAgo']} />
        <GroupSection label="7 days ago" chats={groups['7daysAgo']} />
        <GroupSection label="Last 30 days" chats={groups['30daysAgo']} />

        {Object.keys(chats).length === 0 && (
          <div className="text-center text-zinc-600 py-8">
            <i className="ri-chat-off-line text-2xl block mb-2"></i>
            <p className="text-sm">No chats yet</p>
          </div>
        )}
      </div>

      {/* User Profile Bottom */}
      <div className="border-t border-zinc-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <i className="ri-user-line text-zinc-400 text-sm"></i>
            </div>
            <span className="text-sm text-zinc-300">{user?.username || 'User'}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <button className="hover:text-zinc-300 transition">
              <i className="ri-settings-3-line text-sm"></i>
            </button>
            <button className="hover:text-zinc-300 transition">
              <i className="ri-information-line text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Welcome Screen Component
const WelcomeScreen = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  return (
    <div className="fixed inset-0 left-60 bg-black flex items-center justify-center z-10">
      <div className="text-center">
        {/* Logo with glow effect */}
        <div className="mb-8 flex justify-center">
          <div
            style={{
              maskImage: 'linear-gradient(to bottom, white 30%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, white 30%, transparent 100%)'
            }}
            className="text-8xl text-zinc-400"
          >
            <i className="ri-ancient-gate-line"></i>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-semibold text-zinc-400 mb-12">ZErio Ai</h1>

        {/* Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your message? what u want?"
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-full pl-4 pr-4 py-3 text-sm focus:outline-none focus:border-zinc-700 placeholder-zinc-600"
              />
            </div>
            <button
              type="submit"
              className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 transition"
            >
              <i className="ri-send-plane-fill text-lg"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Message Component
const Message = ({ msg }) => {
  const isUser = msg.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-sm rounded-lg px-4 py-2 text-sm ${
          isUser
            ? 'bg-zinc-800 text-zinc-100'
            : 'bg-zinc-900 text-zinc-200'
        }`}
      >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
  {msg.content}
</ReactMarkdown>
      </div>
    </div>
  )
}

// Chat View Component
const ChatView = ({ currentchatId, chats }) => {
  const dispatch = useDispatch()
  const { handlegenraterespons } = usechat()
  const { loading } = useSelector(state => state.chat)
  
  const currentChat = chats[currentchatId]
  const messages = currentChat?.messages || []
  
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      handlegenraterespons({ message: inputValue, chatid: currentchatId })
      setInputValue('')
    }
  }

  if (!currentChat) {
    return (
      <div className="ml-60 h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-600">Select a chat to view messages</p>
      </div>
    )
  }

  return (
    <div className="ml-60 h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-900 px-6 py-4">
        <h2 className="text-lg text-zinc-200 font-semibold">{currentChat.title}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-600">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <Message key={idx} msg={msg} />
          ))
        )}

        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-zinc-900 rounded-lg px-4 py-2">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-zinc-900 bg-black p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 items-center">
            <i className="ri-lock-line text-zinc-600"></i>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your message? what u want?"
              className="flex-1 bg-transparent text-zinc-300 text-sm focus:outline-none placeholder-zinc-600"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 flex items-center justify-center text-zinc-400 hover:text-zinc-300 transition"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main Dashboard
function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
const currentchatid = useSelector(state => state.chat.currentchatid)
const chats = useSelector(state => state.chat.chats)

const currentChat = chats[currentchatid]
  const { intializesocketconnection, handlegenraterespons } = usechat()

  useEffect(() => {
    intializesocketconnection()
  }, [])

  const handleSelectChat = (chatId) => {
    dispatch(setcurrentchatid(chatId))
  }

  const handleNewChat = () => {
    dispatch(setcurrentchatid(null))
  }

  const handleSendMessage = async (content) => {
    if (!currentchatid) {
      // Create new chat - the title will come from backend response
      const chatTitle = content.substring(0, 50)
      handlegenraterespons({ message: content, chatid: null })
    } else {
      // Send message to existing chat
      handlegenraterespons({ message: content, chatid: currentchatid })
    }
  }

  const handleDeleteChat = async (chatId) => {
    try {
      await deletechat({ chatid: chatId })
      // Update Redux state by removing the chat
      const updatedChats = { ...chats }
      delete updatedChats[chatId]
      dispatch(setchats(updatedChats))
      
      // If the deleted chat was the current one, show welcome screen
      if (currentchatid === chatId) {
        dispatch(setcurrentchatid(null))
      }
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }

  return (
    <div className="h-screen w-full bg-black text-zinc-200 overflow-hidden">
      <Sidebar
        chats={chats}
        selectedChatId={currentchatid}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
      />

      {currentchatid === null ? (
        <WelcomeScreen onSendMessage={handleSendMessage} />
      ) : (
        <ChatView
          currentchatId={currentchatid}
          chats={chats}
        />
      )}
    </div>
  )
}

export default Dashboard
