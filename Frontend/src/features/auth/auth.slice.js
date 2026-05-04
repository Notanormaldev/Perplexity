import { createSlice } from "@reduxjs/toolkit";



const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:false,
        error:null,

    },
    reducers:{
        setuser:(state,action)=>{
            state.user = action.payload
        },
        setloading : (state , action)=>{
            state.loading = action.payload
        },
        seterror:(state,action)=>{
            state.error = action.payload
        }
    }
})

export const {setuser,seterror,setloading } = authSlice.actions
export default authSlice.reducer