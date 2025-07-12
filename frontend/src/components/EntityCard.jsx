import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const API_BASE_URL =
  import.meta.env.PROD
    ? "https://normal-app2.onrender.com/api"
    : "/api";

const EntityCard = ({ image, name, shortName, id }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entityData, setEntityData] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteType, setVoteType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      setIsLoading(true);
      let loggedIn = false;
      try {
        // Check authentication
        try {
          const authRes = await axios.get(`${API_BASE_URL}/home`, { withCredentials: true });
          if (authRes.status === 200 && authRes.data.authenticated) {
            setIsAuthenticated(true);
            loggedIn = true;
          } else {
            setIsAuthenticated(false);
            loggedIn = false;
          }
        } catch (authErr) {
          setIsAuthenticated(false);
          loggedIn = false;
        }
        // Fetch entity data (this should work even without auth)
        try {
          const response = await axios.get(`${API_BASE_URL}/entities/${String(id)}`, { withCredentials: true });
          setEntityData(response.data);
          setHasVoted(response.data.hasVoted || false);
          setVoteType(response.data.voteType || null);
        } catch (err) {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            if (!loggedIn) {
              navigate("/login", { state: { message: "Please login to view this card." } });
              return;
            }
          } else if (err.response && err.response.status === 404) {
            setError("Entity data not found");
          } else {
            setError(err.response?.data?.error || "Failed to load data");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthAndFetchData();
  }, [id, navigate]);

  const handleVote = async (type) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { message: "Please login to vote." } });
      return;
    }
    if (hasVoted) return;
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/entities/${String(id)}/vote`,
        { type },
        { withCredentials: true }
      );
      setEntityData(response.data);
      setHasVoted(response.data.hasVoted);
      setVoteType(response.data.voteType);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false);
        navigate("/login", { state: { message: "Please login to vote." } });
        return;
      }
      setError(err.response?.data?.error || "Failed to submit vote");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!entityData)
    return <div className="text-center p-4">Entity data not found</div>;

  const totalVotes = (entityData.upvotes || 0) + (entityData.downvotes || 0);
  const upvotePercentage = totalVotes > 0
    ? Math.round((entityData.upvotes / totalVotes) * 100)
    : 0;
  const downvotePercentage = totalVotes > 0
    ? Math.round((entityData.downvotes / totalVotes) * 100)
    : 0;

  return (
    <div className="w-full max-w-sm h-[420px] flex flex-col mx-auto rounded-lg overflow-hidden shadow-md border border-gray-200 bg-zinc-900 mt-4">
      {image ? (
        <img
          src={image}
          alt={`Logo of ${shortName}`}
          width={320}
          className="w-full h-56 object-cover rounded-t-lg border-b border-gray-200 shadow-sm"
        />
      ) : (
        <div className="w-full h-56 bg-gray-700 flex items-center justify-center">
          <span className="text-white">No Image Available</span>
        </div>
      )}
      <div className="flex-1 flex flex-col px-4 py-3 bg-black">
        <div className="font-bold text-purple-600 text-lg mb-1 text-center">
          {shortName}
        </div>
        <div className="text-purple-400 text-sm text-center mb-2">{name}</div>
        <div className="flex justify-center gap-3 mt-2 mb-2">
          {!hasVoted ? (
            <>
              <button
                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 mt-2 rounded-xl text-white"
                onClick={() => handleVote("up")}
                disabled={hasVoted || isLoading}
              >
                <ThumbsUp className="w-4 h-4" /> Thumbs Up
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 hover:bg-red-900 mt-2 rounded-xl text-white"
                onClick={() => handleVote("down")}
                disabled={hasVoted || isLoading}
              >
                <ThumbsDown className="w-4 h-4" /> Thumbs Down
              </button>
            </>
          ) : (
            <div
              className={`text-center font-bold ${
                voteType === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {voteType === "up" ? "You've Upvoted!" : "You've Downvoted!"}
            </div>
          )}
        </div>
        <div className="mt-auto">
          <div className="mb-1 flex h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="bg-green-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${upvotePercentage}%` }}
            ></div>
            <div
              className="bg-red-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${downvotePercentage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="text-green-600 font-medium">
              {upvotePercentage}% ({entityData.upvotes || 0})
            </div>
            <div className="text-red-600 font-medium">
              {downvotePercentage}% ({entityData.downvotes || 0})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;
