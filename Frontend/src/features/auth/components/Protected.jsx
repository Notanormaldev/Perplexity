import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

function Protected({children}) {

   const {user,loading} = useSelector(state=>state.auth)

  if(loading){
    return <h1 className='text-4xl '>Loading..</h1>
  }

  if(!user){
    return <Navigate to='/login'/>
  }

  return   children
  
}

export default Protected
