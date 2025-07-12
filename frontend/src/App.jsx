import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import CardList from "./components/CardList";
import FeedbackList from "./components/FeedbackList";
import EntitiesList from "./components/EntitiesList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <CardList />
            </>
          }
        />
        <Route
          path="/integrations"
          element={<EntitiesList />}
        />
        <Route
          path="/feedback"
          element={<FeedbackList />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
