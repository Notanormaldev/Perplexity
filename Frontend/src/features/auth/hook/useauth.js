import { useDispatch } from "react-redux";
import { getme, login, register } from "../services/auth.api";
import { seterror, setloading, setuser } from "../auth.slice";




export  function useauth(){

    const dispatch = useDispatch()

    async function handleregister({email,username,password}){
        try {
            dispatch(setloading(true))
            const data =await register({email,username,password})
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "Register failed"))
        }finally{
           dispatch(setloading(false))
        }
        
   }
    async function handlelogin({email,password}){
     
        console.log(email,password);
        
        try {
            dispatch(setloading(true))
            const data =await login({email,password})
            dispatch(setuser(data.user))
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "Login failed"))
        }finally{
           dispatch(setloading(false))
        }
        
   }
    async function handlegetme(){
        try {
            dispatch(setloading(true))
            const data =await getme()
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "get-me failed"))
        }finally{
           dispatch(setloading(false))
        }
        
   }

   return {handlegetme,handlelogin,handleregister}


}