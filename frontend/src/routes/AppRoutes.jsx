import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const EntitiesList = lazy(() => import("../pages/EntitiesList"));
const CardList = lazy(() => import("../pages/CardList"));
const FeedbackList = lazy(() => import("../pages/FeedbackList"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
};