import axios  from "axios";


const api =axios.create({
    baseURL:'http://localhost:3000',
    withCredentials:true
})

// ✅ Get available models
export async function getAvailableModels(){
    try {
        const res = await api.get('/api/chats/models')
        return res.data
    } catch (error) {
        console.log('getAvailableModels error:', error)
        throw error
    }
}

export async function genrateresponse({message, chatid, model = "gemini", file = null}){
    try {
        const formData = new FormData()
        formData.append('message', message)
        if(chatid) formData.append('chatid', chatid)
        formData.append('model', model)
        if(file) formData.append('file', file)

        const res = await api.post('/api/chats/message', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
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

export async function sendFileMessage({file, chatid, message}){
    try {
        const data = new FormData()
        data.append('file', file)
        if (message) data.append('message', message)
        if (chatid) data.append('chatid', chatid)

        const res = await api.post('/api/chats/message', data)
        return res.data
    } catch (error) {
        console.log('sendFileMessage error:', error)
        throw error
    }
}

export async function uploadDocument({file, chatid}){
    try {
        const data = new FormData()
        data.append('file', file)

        const res = await api.post(`/api/chats/upload/${chatid}`, data)
        return res.data
    } catch (error) {
        console.log('uploadDocument error:', error)
        throw error
    }
}

export async function describeImage({file, chatid, message}){
    try {
        const data = new FormData()
        data.append('file', file)
        if (message) data.append('message', message)

        const res = await api.post(`/api/chats/image/describe/${chatid}`, data)
        return res.data
    } catch (error) {
        console.log('describeImage error:', error)
        throw error
    }
}

export async function describeImageStream({file, chatid, message, onChunk}) {
    try {
        const data = new FormData()
        data.append('file', file)
        if (message) data.append('message', message)

        const res = await fetch(`http://localhost:3000/api/chats/image/describe/stream/${chatid}`, {
            method: 'POST',
            body: data,
            credentials: 'include'
        })

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() // Keep incomplete line in buffer

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6))
                        if (data.text) {
                            onChunk(data.text)
                        }
                        if (data.done) {
                            return
                        }
                        if (data.error) {
                            throw new Error(data.error)
                        }
                    } catch (e) {
                        console.error('Error parsing SSE data:', e)
                    }
                }
            }
        }
    } catch (error) {
        console.log('describeImageStream error:', error)
        throw error
    }
}