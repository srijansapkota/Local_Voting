import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      await queryClient.invalidateQueries({queryKey:['auth']})
      toast.success("Logged in successfully!", { position: "top-center" });
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-lg border border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-1">
          Login to your account
        </h2>
        <p className="text-zinc-400 mb-6">
          Enter your email below to login to your account
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-200 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-zinc-800 border-zinc-700 p-4 text-black placeholder-zinc-500 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 px-4 py-3 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-200"
              >
                Password
              </label>
              <Link to="#" className="text-xs text-zinc-400 hover:underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              className="bg-zinc-800 border-zinc-700 text-black placeholder-zinc-500 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 px-4 py-3 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-700 text-white font-semibold py-2 rounded-lg shadow-sm hover:bg-purple-800 transition-all border-none"
          >
            Login
          </Button>
        </form>
        <div className="text-center text-sm mt-6 text-zinc-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-400 underline hover:text-purple-200 font-semibold"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
