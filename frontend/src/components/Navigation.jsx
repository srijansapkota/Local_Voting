import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "/api";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authRes = await axios.get(`${API_BASE_URL}/home`, { withCredentials: true });
        if (authRes.status === 200 && authRes.data.authenticated) {
          setIsAuthenticated(true);
          console.log('User is authenticated');
        } else {
          setIsAuthenticated(false);
          console.log('User is not authenticated');
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.log('Auth check failed', error);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { path: "/", label: "Home", description: "College Representatives" },
    { path: "/integrations", label: "Integrations", description: "College Buildings" },
    { path: "/feedback", label: "Feedback", description: "College Events" },
  ];

  const isActive = (path) => location.pathname === path;

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <nav className="bg-zinc-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-purple-600">Acme</h1>
            </Link>
          </div>

         
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-purple-600 text-white"
                    : "text-purple-400 hover:text-white hover:bg-purple-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

 
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-purple-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

       
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-purple-400 hover:text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

 
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-purple-600 text-white"
                    : "text-purple-400 hover:text-white hover:bg-purple-700"
                }`}
              >
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-sm opacity-75">{item.description}</div>
                </div>
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-700">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white bg-red-600 hover:bg-red-700 text-base font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-purple-400 hover:text-white text-base font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-purple-400 hover:text-white text-base font-medium transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 