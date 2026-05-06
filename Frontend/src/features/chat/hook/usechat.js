import { useDispatch } from 'react-redux'
import { genrateresponse, getchats, getmessages ,deletechat} from '../services/chat.api'
import { intializesocketconnection } from '../services/chat.socket'
import { setchats ,setloading,seterr,setcurrentchatid, createNewChat, addNewmessage } from '../chat.slice'

export  const usechat=()=> {
   const dispatch = useDispatch()
   async function handlegenraterespons({message,chatid}){
     try {
      dispatch(setloading(true))
      const data = await genrateresponse({message,chatid})
      const {aimessage,usermessage,title,chat}=data
      dispatch(createNewChat({
        chatid:chat._id,
        title:chat.title
      }))
      dispatch(addNewmessage({
        chatid:chat._id,
        content:message,
        role:"user"
      }))
      dispatch(addNewmessage({
        chatid:chat._id,
        content:aimessage.content,
        role:"ai"
      }))

      dispatch(setcurrentchatid(chat._id))

     } catch (error) {
      dispatch(seterr(error))
     }finally{
      dispatch(setloading(false))
     }
   }


  return {
     intializesocketconnection
}
}
