import React from 'react'
import { useSelector } from 'react-redux'






function Dashbord() {

  const {user} = useSelector(state=>state.auth)

  console.log(user)
  return (
    <div>
      dashbord
    </div>
  )
}

export default Dashbord
