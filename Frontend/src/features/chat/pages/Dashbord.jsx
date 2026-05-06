import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { usechat } from '../hook/usechat'
import { getChats, getMsgs, genMsg, deleteChat } from '../services/chat.api'
import 'remixicon/fonts/remixicon.css'
import '../chat.css'
import '../../../app/index.css'

// Chat History Sidebar Component
const ChatSidebar = ({ chats, selectedChat, onSelectChat, onDeleteChat, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const groupChatsByDate = (chats) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const grouped = {
      today: [],
      yesterday: [],
      threeDaysAgo: [],
      sevenDaysAgo: [],
      last30Days: []
    }
    
    chats.forEach(chat => {
      const chatDate = new Date(chat.createdAt)
      const chatDateOnly = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate())
      const daysAgo = Math.floor((today - chatDateOnly) / (1000 * 60 * 60 * 24))
      
      if (daysAgo === 0) grouped.today.push(chat)
      else if (daysAgo === 1) grouped.yesterday.push(chat)
      else if (daysAgo <= 3) grouped.threeDaysAgo.push(chat)
      else if (daysAgo <= 7) grouped.sevenDaysAgo.push(chat)
      else if (daysAgo <= 30) grouped.last30Days.push(chat)
    })
    
    return grouped
  }
  
  const groupedChats = groupChatsByDate(chats)
  
  const ChatItem = ({ chat, isSelected, onSelect, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false)
    
    return (
      <div
        onClick={onSelect}
        className={`p-3 rounded-lg mb-2 cursor-pointer transition-all group ${
          isSelected
            ? 'bg-cyan-500 bg-opacity-20 border border-cyan-400'
            : 'bg-neutral-800 hover:bg-neutral-700'
        }`}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm text-neutral-300 truncate flex-1">
            {chat.title || 'Untitled Chat'}
          </p>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-neutral-600 rounded"
            >
              <i className="ri-more-2-fill text-neutral-400"></i>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-neutral-700 rounded-lg shadow-lg z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(chat._id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-600 rounded-lg"
                >
                  <i className="ri-delete-bin-line mr-2"></i>Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  const renderChatGroup = (title, chats) => {
    if (chats.length === 0) return null
    
    return (
      <div key={title} className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3 px-2">
          {title}
        </h3>
        <div>
          {chats.map(chat => (
            <ChatItem
              key={chat._id}
              chat={chat}
              isSelected={selectedChat?._id === chat._id}
              onSelect={() => onSelectChat(chat)}
              onDelete={onDeleteChat}
            />
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="w-56 bg-neutral-950 border-r border-neutral-800 h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-4">
          <i className="ri-ancient-gate-line text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"></i>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            ZErio Ai
          </span>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              onSearch(e.target.value)
            }}
            className="w-full bg-neutral-800 text-neutral-300 text-sm rounded-lg pl-3 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 placeholder-neutral-600"
          />
          <i className="ri-search-line absolute right-3 top-2.5 text-neutral-500"></i>
        </div>
      </div>
      
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {renderChatGroup('Today', groupedChats.today)}
        {renderChatGroup('Yesterday', groupedChats.yesterday)}
        {renderChatGroup('3 days ago', groupedChats.threeDaysAgo)}
        {renderChatGroup('7 days ago', groupedChats.sevenDaysAgo)}
        {renderChatGroup('Last 30 days', groupedChats.last30Days)}
        
        {chats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500">
            <i className="ri-chat-bubble-line text-3xl mb-2 opacity-50"></i>
            <p className="text-sm">No chats yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Welcome Screen Component
const WelcomeScreen = ({ username, onStartChat }) => {
  const inputRef = useRef(null)
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-950 pointer-events-auto">
      <div className="text-center">
        {/* Glowing Orb Animation */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-32 h-32">
            {/* Animated rings */}
            <div className="absolute inset-0 border-2 border-cyan-400 border-opacity-30 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 border border-blue-500 border-opacity-20 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
            
            {/* Glowing icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="ri-ancient-gate-line text-6xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl animate-pulse"></i>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 animate-pulse"></div>
          </div>
        </div>
        
        {/* Heading */}
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome back, {username}!
        </h1>
        
        {/* Subtext */}
        <p className="text-xl text-neutral-400 mb-12">
          What do you want to do today?
        </p>
        
        {/* Input Bar */}
        <div className="w-full max-w-2xl">
          <form onSubmit={(e) => {
            e.preventDefault()
            if (inputRef.current?.value.trim()) {
              onStartChat(inputRef.current.value)
            }
          }} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask me anything..."
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-full pl-6 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 placeholder-neutral-500"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <i className="ri-lightbulb-flash-line"></i>
              </div>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-neutral-900 rounded-full px-8 py-4 font-semibold transition-all hover:shadow-lg hover:shadow-cyan-400/50 flex items-center gap-2"
            >
              <span>Send</span>
              <i className="ri-send-plane-fill"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// Message Bubble Component
const MessageBubble = ({ message, isUser }) => {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-md px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-br-none'
            : 'bg-neutral-800 text-neutral-100 rounded-bl-none'
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-cyan-100 opacity-70' : 'text-neutral-500'}`}>
          {formattedTime}
        </p>
      </div>
    </div>
  )
}

// Chat View Component
const ChatView = ({ selectedChat, messages, onSendMessage, isLoading, user }) => {
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const [inputValue, setInputValue] = useState('')
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }
  
  return (
    <div className="flex flex-col h-screen ml-56 bg-neutral-950">
      {/* Chat Header */}
      <div className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">
          {selectedChat.title || 'Chat'}
        </h2>
        <div className="text-sm text-neutral-400">
          {user?.username}
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500">
            <i className="ri-chat-bubble-line text-4xl mb-2 opacity-30"></i>
            <p className="text-sm">Start the conversation</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              message={msg}
              isUser={msg.role === 'user'}
            />
          ))
        )}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-neutral-800 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t border-neutral-800 px-6 py-4">
        <div className="flex gap-3">
          <div className="flex-1 relative bg-neutral-800 rounded-full flex items-center px-4">
            <div className="flex items-center gap-2 mr-2 text-cyan-400 text-sm font-medium">
              <i className="ri-robot-2-line"></i>
              <span>ZErio Ai</span>
            </div>
            <div className="w-px h-6 bg-neutral-700 mx-2"></div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-white placeholder-neutral-500 focus:outline-none py-3"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-3 transition-all hover:shadow-lg hover:shadow-cyan-400/50"
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component

// Main Dashboard Component
function Dashboard() {
  const { user } = useSelector(state => state.auth)
  const { intializesocketconnection } = usechat()
  
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [filteredChats, setFilteredChats] = useState([])
  
  // Initialize socket connection
  useEffect(() => {
    intializesocketconnection()
  }, [])
  
  // Fetch chats on component mount
  useEffect(() => {
    if (user) {
      fetchChats()
    }
  }, [user])
  
  const fetchChats = async () => {
    try {
      // Mock API call - replace with actual API
      const response = await getChats()
      setChats(response.chats || [])
      setFilteredChats(response.chats || [])
    } catch (error) {
      console.error('Failed to fetch chats:', error)
    }
  }
  
  const handleStartChat = async (message) => {
    try {
      setIsLoading(true)
      // Create new chat with first message
      const response = await genMsg(null, message)
      
      // Create new chat entry
      const newChat = {
        _id: response.chatId,
        title: message.substring(0, 50),
        createdAt: new Date()
      }
      
      setSelectedChat(newChat)
      setMessages([
        { role: 'user', content: message, timestamp: new Date() },
        { role: 'assistant', content: response.reply, timestamp: new Date() }
      ])
      setChats([newChat, ...chats])
      setFilteredChats([newChat, ...chats])
      setShowWelcome(false)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSelectChat = async (chat) => {
    try {
      setIsLoading(true)
      setSelectedChat(chat)
      
      // Fetch messages for selected chat
      const response = await getMsgs(chat._id)
      setMessages(response.messages || [])
      setShowWelcome(false)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSendMessage = async (message) => {
    if (!selectedChat) return
    
    try {
      setIsLoading(true)
      
      // Add user message immediately
      const userMessage = { role: 'user', content: message, timestamp: new Date() }
      setMessages(prev => [...prev, userMessage])
      
      // Send message and get AI response
      const response = await genMsg(selectedChat._id, message)
      
      const aiMessage = { role: 'assistant', content: response.reply, timestamp: new Date() }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId)
      setChats(chats.filter(chat => chat._id !== chatId))
      setFilteredChats(filteredChats.filter(chat => chat._id !== chatId))
      
      if (selectedChat?._id === chatId) {
        setSelectedChat(null)
        setMessages([])
        setShowWelcome(true)
      }
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }
  
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredChats(chats)
    } else {
      const filtered = chats.filter(chat =>
        chat.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredChats(filtered)
    }
  }
  
  return (
    <div className="h-screen w-full bg-neutral-950 text-white overflow-hidden">
      {/* Background grid/noise texture */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 207, 255, 0.1) 0px,
            rgba(0, 207, 255, 0.1) 1px,
            transparent 1px,
            transparent 2px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(0, 207, 255, 0.1) 0px,
            rgba(0, 207, 255, 0.1) 1px,
            transparent 1px,
            transparent 2px
          )`
        }}
      ></div>
      
      {/* Sidebar */}
      <ChatSidebar
        chats={filteredChats}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onSearch={handleSearch}
      />
      
      {/* Main Content */}
      {showWelcome ? (
        <WelcomeScreen
          username={user?.username || 'Guest'}
          onStartChat={handleStartChat}
        />
      ) : (
        <ChatView
          selectedChat={selectedChat}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          user={user}
        />
      )}
    </div>
  )
}

export default Dashboard

