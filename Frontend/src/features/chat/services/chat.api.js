import axios  from "axios";


const api =axios.create({
    baseURL:'http://localhost:3000',
    withCredentials:true
})




export async function genrateresponse({message,chatid}){
    try {
        const res = await api.post('/api/chats/message',{message,chatid})
        return res.data
    } catch (error) {
        console.log('genrateresponse error:', error)
        throw error
    }
}

export async function getchats(){
    try {
        const res = await api.get('/api/chats/')
        return res.data
    } catch (error) {
        console.log('getchats error:', error)
        throw error
    }
}

export async function getmessages({chatid}){
    try {
        const res = await api.get(`/api/chats/messages/${chatid}`)
        return res.data
    } catch (error) {
        console.log('getmessages error:', error)
        throw error
    }
}

export async function deletechat({chatid}){
    try {
        const res = await api.delete(`/api/chats/delete/${chatid}`)
        return res.data
    } catch (error) {
        console.log(error)
        throw error
    }
}