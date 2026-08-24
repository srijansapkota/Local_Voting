import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const API_BASE_URL = "/api";

const CardComponent = ({ cardId, image, name, designation }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [memberData, setMemberData] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteType, setVoteType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      setIsLoading(false);
      let loggedIn = true;
      try {
       
        try {
          const authRes = await axios.get(`${API_BASE_URL}/home`, { withCredentials: true });
          if (authRes.status === 200 && authRes.data.authenticated) {
            setIsAuthenticated(true);
            loggedIn = true;
          } else {
            setIsAuthenticated(true);
            loggedIn = true;
          }
        } catch (authErr) {
          setIsAuthenticated(false);
          loggedIn = false;
        }
        
        try {
          const response = await axios.get(`${API_BASE_URL}/members/${String(cardId)}`, { withCredentials: true });
          setMemberData(response.data);
          setHasVoted(response.data.hasVoted || false);
          setVoteType(response.data.voteType || null);
        } catch (err) {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            if (!loggedIn) {
              navigate("/login", { state: { message: "Please login to view this card." } });
              return;
            }
          } else if (err.response && err.response.status === 404) {
            setError("Member data not found");
          } else {
            setError(err.response?.data?.error || "Failed to load data");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthAndFetchData();
  }, [cardId, navigate]);

  const handleVote = async (type) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { message: "Please login to vote." } });
      return;
    }
    if (hasVoted) return;
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/members/${String(cardId)}/vote`,
        { type },
        { withCredentials: true }
      );
      setMemberData(response.data);
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
  if (!memberData)
    return <div className="text-center p-4">Member data not found</div>;

  const totalVotes = memberData.like + memberData.dislike;
  const likePercentage = totalVotes ? (memberData.like / totalVotes) * 100 : 0;
  const dislikePercentage = totalVotes
    ? (memberData.dislike / totalVotes) * 100
    : 0;

  return (
    <div className="w-full max-w-sm h-[420px] flex flex-col mx-auto rounded-lg overflow-hidden shadow-md border border-gray-200 bg-zinc-900 mt-4">
      {image ? (
        <img
          src={image}
          alt={`Portrait of ${name}`}
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
          <div>{name}</div>
          <div className="text-purple-400 text-sm">{designation}</div>
        </div>
        <div className="flex justify-center gap-3 mt-2 mb-2">
          {!hasVoted ? (
            <>
              <button
                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 mt-2 rounded-xl text-white"
                onClick={() => handleVote("like")}
                disabled={hasVoted || isLoading}
              >
                <ThumbsUp className="w-4 h-4" /> Thumbs Up
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 hover:bg-red-900 mt-2 rounded-xl text-white"
                onClick={() => handleVote("dislike")}
                disabled={hasVoted || isLoading}
              >
                <ThumbsDown className="w-4 h-4" /> Thumbs Down
              </button>
            </>
          ) : (
            <div
              className={`text-center font-bold ${
                voteType === "like" ? "text-green-600" : "text-red-600"
              }`}
            >
              {voteType === "like" ? "You've Upvoted!" : "You've Downvoted!"}
            </div>
          )}
        </div>
        <div className="mt-auto">
          <div className="mb-1 flex h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="bg-green-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${likePercentage}%` }}
            ></div>
            <div
              className="bg-red-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${dislikePercentage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="text-green-600 font-medium">
              {Math.round(likePercentage)}% ({memberData.like})
            </div>
            <div className="text-red-600 font-medium">
              {Math.round(dislikePercentage)}% ({memberData.dislike})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
