import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,         
      staleTime: 5 * 60 * 1000,  
    },
  },
});



createRoot(document.getElementById("root")).render(
  <StrictMode>
        <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <BrowserRouter>
      <App />
      </BrowserRouter>
      </AuthProvider>
        </QueryClientProvider>
  </StrictMode>
);
