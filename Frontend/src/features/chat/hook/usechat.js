import { useDispatch, useSelector } from 'react-redux'
import { genrateresponse, getchats, getmessages, deletechat, sendFileMessage, uploadDocument, describeImage, describeImageStream } from '../services/chat.api'
import { intializesocketconnection } from '../services/chat.socket'
import { setchats ,setloading,seterr,setcurrentchatid, createNewChat, addNewmessage } from '../chat.slice'

export  const usechat=()=> {

  const  chats  = useSelector(state=>state.chat.chats)
  const currentchatid = useSelector(state=>state.chat.currentchatid)
  const dispatch = useDispatch()

  // ✅ Handle rate limit errors
  const handleRateLimitError = (error) => {
    if (error.response?.status === 429) {
      return {
        title: "Rate Limit Exceeded",
        message: "Too many requests. You need to upgrade your plan or contact support.",
        status: 429
      }
    }
    return null
  }

  async function handlegenraterespons({message, chatid, model = "gemini", file = null, onRateLimit = null}){
     try {
      dispatch(setloading(true))
      const data = await genrateresponse({message, chatid, model, file})
      
      if (!data) {
        throw new Error('No response from server')
      }
  
      const {aimessage, usermessage, chat} = data
      if (!chat || !chat._id) {
        console.error("Invalid chat:", data)
        return
      }

      // Create new chat if it doesn't exist
      if (!chats[chat._id]) {
        dispatch(createNewChat({
          chatid: chat._id,
          title: chat.title
        }))
      }
      
      // Add user message with file metadata if file exists
      const isImage = file?.type.startsWith('image/')
      const isPdf = file?.type === 'application/pdf'
      const fileType = file ? (isImage ? 'image' : isPdf ? 'pdf' : 'document') : undefined
      const userContent = file 
        ? `${message}\n[${isImage ? 'Image' : isPdf ? 'PDF' : 'Document'} sent: ${file.name}]`
        : message
      
      dispatch(addNewmessage({
        chatid: chat._id,
        content: userContent,
        role: "user",
        fileType,
        file: file?.name
      }))
      
      // Add AI message
      dispatch(addNewmessage({
        chatid: chat._id,
        content: aimessage.content,
        role: "ai"
      }))

      dispatch(setcurrentchatid(chat._id))
      dispatch(setloading(false))
     } catch (error) {
      console.error('Error in handlegenraterespons:', error)
      
      // Check for rate limit error
      const rateLimitError = handleRateLimitError(error)
      if (rateLimitError) {
        onRateLimit?.(rateLimitError)
        dispatch(setloading(false))
        return
      }

      let errorMessage = 'Failed to send message'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      dispatch(seterr(errorMessage))
      dispatch(setloading(false))
     }
   }

   async function handleloadchats(){
     try {
       dispatch(setloading(true))
       const data = await getchats()
       const chatsObj = {}
       data.chats.forEach(chat => {
         chatsObj[chat._id] = {
           id: chat._id,
           title: chat.title,
           messages: [], // messages will be loaded when selected
           lastUpdated: chat.updatedAt || chat.createdAt
         }
       })
       dispatch(setchats(chatsObj))
     } catch (error) {
       console.error('Error loading chats:', error)
       dispatch(seterr(error.message || 'Failed to load chats'))
     } finally {
       dispatch(setloading(false))
     }
   }

   async function handleloadmessages({chatid}){
     try {
       const data = await getmessages({chatid})
       // data.messages is an array of {content, role, fileType, file}
       const messages = data.messages.map(msg => ({
         content: msg.content,
         role: msg.role,
         fileType: msg.fileType,
         file: msg.file
       }))
       // Update the chat with messages
       dispatch(setchats({
         ...chats,
         [chatid]: {
           ...chats[chatid],
           messages
         }
       }))
     } catch (error) {
       console.error('Error loading messages:', error)
     }
   }

   async function handledeletechat({chatid}){
        try {
       const data = await deletechat({chatid})
       return data
     } catch (error) {
       console.error('Error deleting chat:', error)
     }
   }

   async function handleUploadFile(file, onClearAttachedFile, model = "gemini", onRateLimit = null){
     if(!file) return
     try {
       dispatch(setloading(true))
       const isImage = file.type.startsWith('image/')
       const isPdf = file.type === 'application/pdf'
       const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
       let activeChatId = currentchatid

       if(!activeChatId){
         // Create new chat with file
         const message = isImage ? 'Describe this image' : 'Upload document'
         const data = await genrateresponse({message, chatid: null, model, file})
         
         if(data?.chat){
           if(!chats[data.chat._id]){
             dispatch(createNewChat({chatid: data.chat._id, title: data.chat.title}))
           }
           
           // Show file metadata in user message
           const fileLabel = isImage ? 'Image' : isPdf ? 'PDF' : 'Document'
           const fileType = isImage ? 'image' : isPdf ? 'pdf' : 'document'
           const userContent = `${message}\n[${fileLabel} sent: ${file.name}]`
           
           dispatch(addNewmessage({chatid: data.chat._id, content: userContent, role: 'user', fileType, file: file.name}))
           dispatch(addNewmessage({chatid: data.chat._id, content: data.aimessage?.content||'', role: 'ai'}))
           dispatch(setcurrentchatid(data.chat._id))
         }
         onClearAttachedFile?.()
         return
       }

       // Send with existing chat
       const message = isImage ? 'Describe this image' : 'Upload document'
       const data = await genrateresponse({message, chatid: activeChatId, model, file})
       
       if(data?.aimessage){
         const fileLabel = isImage ? 'Image' : isPdf ? 'PDF' : 'Document'
         const fileType = isImage ? 'image' : isPdf ? 'pdf' : 'document'
         const userContent = `${message}\n[${fileLabel} sent: ${file.name}]`
         
         dispatch(addNewmessage({chatid: activeChatId, content: userContent, role: 'user', fileType, file: file.name}))
         dispatch(addNewmessage({chatid: activeChatId, content: data.aimessage.content||'', role: 'ai'}))
       }
       
       onClearAttachedFile?.()
     } catch (error) {
       console.error('Error uploading file:', error)
       
       // Check for rate limit error
       const rateLimitError = handleRateLimitError(error)
       if (rateLimitError) {
         onRateLimit?.(rateLimitError)
       } else {
         dispatch(seterr(error.message || 'Failed to upload file'))
       }
     } finally {
       dispatch(setloading(false))
     }
   }

  return {
     intializesocketconnection,
     handlegenraterespons,
     handleloadchats,
     handleloadmessages,
     handledeletechat,
     handleUploadFile
}
}
