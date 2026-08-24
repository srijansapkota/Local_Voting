import { Route } from "lucide-react"
import { Routes } from "react-router-dom"
import CardList from "../components/CardList"
import FeedbackList from "../components/FeedbackList"
import Login from "../pages/Login"
import Signup from "../pages/Signup"

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<CardList />} />
        <Route path='/entities' element={<EntitiesList />} />
        <Route path="feedback" element={<FeedbackList />} />
      </Route>
      <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>} />
        </Route>
        <Route path="*" element = {<Navigate to ="/" replace />} />
      </Routes>
  )
}