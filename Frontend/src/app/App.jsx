import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useEffect } from 'react'
import { useauth } from '../features/auth/hook/useauth'

function App() {
  const auth = useauth()

  useEffect(()=>{
auth.handlegetme()
  },[])
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
