import { io } from "socket.io-client";


export const intializesocketconnection=()=>{
    const socket =io('http://localhost:3000',{

        withCredentials:true
    }
    )


    socket.on('connect',()=>{
        console.log("connected sucessfully on client side");
        
    })
}