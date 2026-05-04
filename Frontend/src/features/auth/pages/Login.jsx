import React, { useState } from 'react'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useauth } from '../hook/useauth'
import { useSelector } from 'react-redux'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const {user,loading} = useSelector(state=>state.auth)

 
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const navigate=useNavigate()

  const {handlelogin}=useauth()
  async function handleSubmit(event) {
    event.preventDefault()
  await handlelogin(formData)
  navigate('/')

    
    // console.log('Login data:', formData.email)
    
   
  
  }
  if(user && !loading ){
  return  <Navigate to='/'/>
 }


  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
              <p className="mt-2 text-sm text-slate-400">Use your account email and password.</p>
            </div>
            <nav className="flex gap-2">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`
                }
              >
                Register
              </NavLink>
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-medium text-slate-200">
              Email address
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-600"
                placeholder="you@example.com"
              />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-600"
                placeholder="Enter your password"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{' '}
            <NavLink to="/register" className="font-medium text-slate-100 underline decoration-slate-600 hover:text-white">
              Create an account
            </NavLink>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Login
