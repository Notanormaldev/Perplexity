import { io } from "socket.io-client";


export const intializesocketconnection=()=>{
    const socket =io('https://zerio-ai-backend.onrender.com',{

        withCredentials:true
    }
    )


    socket.on('connect',()=>{
        

    })
}