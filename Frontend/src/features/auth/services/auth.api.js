import axios from 'axios'


const api = axios.create({
    baseURL:'http://localhost:3000/',
    withCredentials:true
})



export async function login({email,password}){
    
    const res = await api.post('api/auth/login',{email,password})
    return res.data 
}

export async function register({email,username,password}){
    const res = await api.post('api/auth/register',{
        email,username,password
    })
    return res.data
}
export async function getme(){
   const res= await api.get('api/auth/get-me')
   return res.data
}

export async function logout(){
   const res = await api.post('api/auth/logout')
   return res.data
}

export async function deleteAccount(){
   const res = await api.delete('api/auth/delete')
   return res.data
}
