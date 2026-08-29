
import Navigation from "./components/Navigation";
import { ToastContainer } from "react-toastify";
import { AppRoutes } from "./routes/AppRoutes";

const App = () => {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Navigation />
      <AppRoutes />
      <ToastContainer />
    </div>
  );
};

export default App;
