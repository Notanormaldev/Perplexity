import { useDispatch, useSelector } from 'react-redux'
import { genrateresponse, getchats, getmessages ,deletechat} from '../services/chat.api'
import { intializesocketconnection } from '../services/chat.socket'
import { setchats ,setloading,seterr,setcurrentchatid, createNewChat, addNewmessage } from '../chat.slice'

export  const usechat=()=> {

  const  chats  = useSelector(state=>state.chat.chats)
   const dispatch = useDispatch()
   async function handlegenraterespons({message,chatid}){
     try {
      dispatch(setloading(true))
      const data = await genrateresponse({message,chatid})
      
      if (!data) {
        throw new Error('No response from server')
      }
  
      const {aimessage,usermessage,chat}=data
          if (!chat || !chat._id) {
  console.error("Invalid chat:", data)
  return
}
      // Create new chat if it doesn't exist
     if (!chats[chat._id]) {
          dispatch(createNewChat({
        chatid:chat._id,
        title:chat.title
      }))}
      
    
      // Add user message
      dispatch(addNewmessage({
        chatid:chat._id,
        content:message,
        role:"user"
      }))
      
      // Add AI message
      dispatch(addNewmessage({
        chatid:chat._id,
        content:aimessage.content,
        role:"ai"
      }))

      dispatch(setcurrentchatid(chat._id))
      dispatch(setloading(false))
     } catch (error) {
      console.error('Error in handlegenraterespons:', error)
      dispatch(seterr(error.message || 'Failed to send message'))
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
       // Assuming data.messages is an array of {content, role}
       const messages = data.messages.map(msg => ({
         content: msg.content,
         role: msg.role
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
       console.error('Error loading messages:', error)
     }
   }


  return {
     intializesocketconnection,
     handlegenraterespons,
     handleloadchats,
     handleloadmessages,
     handledeletechat
}
}
