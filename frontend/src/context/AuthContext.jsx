import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/auth/status', { withCredentials: true })
      .then(res => {
        if(res.data.authenticated) setUser(res.data.user)
      })
      .catch(()=>setUser(null))
      .finally(()=>setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)