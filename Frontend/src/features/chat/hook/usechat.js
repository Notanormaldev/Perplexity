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


  return {
     intializesocketconnection,
     handlegenraterespons
}
}
