import { Outlet } from "react-router"
import Navbar from "~/components/Navbar"
import { useAuthStore } from "~/stores/auth"
import { useEffect } from "react"
import { Navigate } from "react-router";

const AppLayout = () => {
  const { token, hydrate, hydrated } = useAuthStore()

    useEffect(() => {
        hydrate()
    }, [hydrate])

        // 🔴 まだ認証状態が確定していない
    if (!hydrated) {
        return <div>Loading...</div>
    }

        // 🔴 確定後に初めて判定
    if (!token) {
        return <Navigate to="/login" replace />
    }
  return (
    <>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 my-8">
        <Outlet />
      </section>
    </>
  )
}

export default AppLayout
