import React, { useState } from 'react'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'

import { useauth } from '../hook/useauth.js'
import Bg from '../components/Bg.jsx'
import { useSelector } from 'react-redux'

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [showToast, setShowToast] = useState(false)

  const { user, loading, error } = useSelector(state => state.auth)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const navigate = useNavigate()
  const { handleregister } = useauth()
  
  async function handleSubmit(event) {
    event.preventDefault()
    const res = await handleregister({ email: formData.email, username: formData.username, password: formData.password })
    
    // Only show toast and navigate if successful
    if (res) {
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        navigate('/login')
      }, 3000)
    }
  }

  if (user && !loading) {
    return <Navigate to='/' />
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {showToast && (
        <div 
          className="fixed top-8 right-8 z-50 bg-[#0f0f0f] border border-slate-800 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          style={{ animation: "slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        >
          <div className="bg-green-500/10 p-2.5 rounded-full flex items-center justify-center">
            <i className="ri-mail-send-line text-green-500 text-xl"></i>
          </div>
          <div className="pr-4">
            <h4 className="font-semibold text-slate-200 text-sm tracking-wide">Verification Sent</h4>
            <p className="text-xs text-slate-400 mt-0.5">Please check your inbox</p>
          </div>
          <style>
            {`
              @keyframes slideIn {
                from { transform: translateX(120%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
            `}
          </style>
        </div>
      )}
      <Bg />
      <h1 className='text-white absolute left-1 top-1 font-light font-stretch-50% text-3xl mask-b-from-neutral-50 font-family:'><i class="ri-ancient-gate-line"></i>  ZErio Ai</h1>
      <div className="w-full max-w-md relative z-10">
        <div className="rounded-[32px] border border-slate-800 bg-black-900/95 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className='font-extrabold mb-5 font-stretch-50% text-4xl  mask-b-from-neutral-50 w-[10%] m-auto'>
            <i class="ri-ancient-gate-line "></i>
          </div>
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
              <p className="mt-2 text-sm text-slate-400">Register with username, email, and password.</p>
            </div>
            <nav className="flex gap-2">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`
                }
              >
                Register
              </NavLink>
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-medium text-slate-200">
              Username
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-600"
                placeholder="Your username"
              />
            </label>

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
                placeholder="Choose a secure password"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <NavLink to="/login" className="font-medium text-slate-100 underline decoration-slate-600 hover:text-white">
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Register
