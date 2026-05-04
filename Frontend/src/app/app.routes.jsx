import { createBrowserRouter } from "react-router-dom"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/login"
import Dashbord from "../features/chat/pages/dashbord"
import Protected from "../features/auth/components/Protected"

export const router = createBrowserRouter([
  {
    path: "/",
    element:<Protected><Dashbord/></Protected>
    // element: <h1 className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center text-3xl font-semibold">Home page</h1>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />
  },
])