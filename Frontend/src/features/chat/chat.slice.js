import { createSlice } from "@reduxjs/toolkit";


const  chatSlice  = createSlice({
    name:"chat",
    initialState:{
       chats:{},
       currentchatid:null,
       err:null,
       loading:false
    },


    reducers:{
        setchats:(state,action)=>{
            state.chats = action.payload
        },
        setloading:(state,action)=>{
            state.loading = action.payload
        },
        setcurrentchatid:(state,action)=>{
            state.currentchatid = action.payload
        },
        seterr:(state,action)=>{
            state.err = action.payload
        }
    }

})
export const {setchats,seterr,setcurrentchatid,setloading} = chatSlice.actions
export default chatSlice.reducer


