import React from 'react'
import { useSelector } from 'react-redux'






function dashbord() {

  const user = useSelector(state=>state.auth.user)

  console.log(user)
  return (
    <div>
      dashbord
    </div>
  )
}

export default dashbord
