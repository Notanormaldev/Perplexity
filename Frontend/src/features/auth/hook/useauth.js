import { useDispatch } from "react-redux";
import { getme, login, register, logout, deleteAccount } from "../services/auth.api";
import { seterror, setloading, setuser } from "../auth.slice";

export function useauth() {
  const dispatch = useDispatch()

  async function handleregister({ email, username, password }) {
    try {
      dispatch(setloading(true))
      await register({ email, username, password })
      return { success: true }
    } catch (error) {
      const errMsg = error.response?.data?.err || error.response?.data?.msg || "Register failed";
      alert("Registration Error: " + JSON.stringify(errMsg));
      dispatch(seterror(errMsg));
      return { success: false }
    } finally {
      dispatch(setloading(false))
    }
  }

  async function handlelogin({ email, password }) {
    try {
      dispatch(setloading(true))
      const data = await login({ email, password })
      dispatch(setuser(data.user))
    } catch (error) {
      dispatch(seterror(error.response?.data?.message || "Login failed"))
    } finally {
      dispatch(setloading(false))
    }
  }

  async function handlegetme() {
    try {
      dispatch(setloading(true))
       console.log("getme data:", data)  
      const data = await getme()
      dispatch(setuser(data.user))
    } catch (error) {
      dispatch(seterror(error.response?.data?.message || "get-me failed"))
    } finally {
      dispatch(setloading(false))
    }
  }

  async function handleLogout() {
    try {
      dispatch(setloading(true))
      await logout()
      dispatch(setuser(null))
    } catch (error) {
      dispatch(seterror(error.response?.data?.message || "Logout failed"))
    } finally {
      dispatch(setloading(false))
    }
  }

  async function handleDeleteAccount() {
    try {
      dispatch(setloading(true))
      await deleteAccount()
      dispatch(setuser(null))
    } catch (error) {
      dispatch(seterror(error.response?.data?.message || "Delete account failed"))
    } finally {
      dispatch(setloading(false))
    }
  }

  return { handlegetme, handlelogin, handleregister, handleLogout, handleDeleteAccount }
}
