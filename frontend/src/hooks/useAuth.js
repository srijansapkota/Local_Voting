import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const fetchAuthStatus = async () => {
  const res = await axios.get("/api/auth/status", { withCredentials: true })
  return res.data
}

export const useAuth = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: fetchAuthStatus
  })

  return {
    user: data?.authenticated ? data.user : null,
    isAuthenticated: !!data?.authenticated,
    loading: isLoading
  }
}