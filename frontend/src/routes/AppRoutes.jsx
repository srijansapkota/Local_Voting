import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import EntitiesList from "../pages/EntitiesList";
import CardList from "../pages/CardList";
import FeedbackList from "../pages/FeedbackList";
export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<CardList />} />
        <Route path="/entities" element={<EntitiesList />} />
        <Route path="feedback" element={<FeedbackList />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
