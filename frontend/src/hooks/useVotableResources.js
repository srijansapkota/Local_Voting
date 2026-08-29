import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = "/api";
import axios from "axios";
import {useAuth } from './useAuth'

export const useVotableResource = (category, id) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteType, setVoteType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${API_BASE_URL}/${category}/${String(id)}`, { withCredentials: true })
        setData(response.data);
        setHasVoted(response.data.hasVoted || false);
        setVoteType(response.data.voteType || null);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          if (!isAuthenticated) {
            navigate("/login", { state: { message: "Please login to view this card." } });
            return;
          }
        } else if (err.response?.status === 404) {
          setError("Data not found");
        } else {
          setError(err.response?.data?.error || "Failed to load data");
        } }finally {
          setIsLoading(false);
        }
    };
    fetchData();
    },[category, id, navigate, isAuthenticated]);


    const handleVote = useCallback(async (type)=> {
      if(!isAuthenticated){
        navigate("/login", {state:{message: "Please login to vote"}})
        return
      }
      if(hasVoted){
        return
      }
      try {
        setIsLoading(true)
        const response = await axios.post(
          `${API_BASE_URL}/${category}/${String(id)}/vote`,
          {type},
          {withCredentials: true}
        );
        setData(response.data);
      setHasVoted(response.data.hasVoted);
      setVoteType(response.data.voteType);
      } catch (err) {
         if (err.response?.status === 401) {
        navigate("/login", { state: { message: "Please login to vote." } });
        return;
      }
      setError(err.response?.data?.error || "Failed to submit vote");
      } finally{
        setIsLoading(false);
      }
    },[category, id, isAuthenticated, hasVoted, navigate]);
    return {data, hasVoted, voteType, isLoading, error, handleVote}
}
