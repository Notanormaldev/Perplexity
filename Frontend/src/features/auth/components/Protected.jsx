import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import Loader from '../../../components/Loader'

function Protected({children}) {

   const {user,loading} = useSelector(state=>state.auth)

  if(loading){
    return <Loader />
  }

  if(!user){
    return <Navigate to='/login'/>
  }

  return   children
  
}

export default Protected
