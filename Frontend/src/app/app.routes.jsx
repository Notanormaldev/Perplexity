import { createBrowserRouter } from "react-router-dom"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/login"

export const router = createBrowserRouter([
  {
    path: "/",
    element:<
    // element: <h1 className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center text-3xl font-semibold">Home page</h1>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
])