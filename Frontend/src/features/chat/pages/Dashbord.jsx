import React from 'react'
import { useSelector } from 'react-redux'

import { useEffect } from 'react'
import { usechat } from '../hook/usechat'







function Dashbord() {

  const {user} = useSelector(state=>state.auth)
  const {intializesocketconnection} = usechat()
  
  

  useEffect(()=>{
    intializesocketconnection()
  },[])
  console.log(user)
  return (
    <div>
      dashbord
    </div>
  )
}

export default Dashbord
