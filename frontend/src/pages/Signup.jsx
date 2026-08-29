import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("Account created!", { position: "top-center" });
        navigate("/login");
      } else {
        toast.error(res.data.error || "Signup failed", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Network error", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-lg border border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-1">Sign Up</h2>
        <p className="text-zinc-400 mb-6">Create your account to get started</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-200 mb-1"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 px-4 py-3 rounded-md"
              disabled={loading}
            />
          </div>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 px-4 py-3 rounded-md"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-200 mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 px-4 py-3 rounded-md"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-zinc-200 mb-1"
            >
              Confirm Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 px-4 py-3 rounded-md"
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-700 text-white font-semibold py-2 rounded-lg shadow-sm hover:bg-purple-800 transition-all border-none"
            isDisabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <div className="text-center text-sm mt-6 text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 underline hover:text-purple-200 font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
