import { Server } from "socket.io";




let io;


export  function initsocket(httpserver){
    io = new Server(httpserver,{
        cors:{
            origin:'http://localhost:5173',
            credentials:true
        }
    })
  
   console.log("socket io server is running");
   

    io.on("connection",(socket)=>{
        console.log("connected sucessfully , socket-id:"+socket.id);
        
    })
}

export function getIO(){
    if(!io){
        throw new Error("io is not created");
        
    }
    return io;
}