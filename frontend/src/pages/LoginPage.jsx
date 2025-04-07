import { useState } from "react";
import api from "@/config/api";
import URLS from "@/utils/urls";
import loginpic from "../assets/login.svg";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous message
    try {
      const username = email;
      const res = await api.post(URLS.authLogin, { username, password });
      localStorage.setItem("access_token", res.data.accesstoken);
      localStorage.setItem("refresh_token", res.data.refreshtoken);
      // Optionally redirect the user after successful login
      console.log("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response?.status === 401 &&
        error.response.data.error === "Invalid username or password"
      ) {
        setMessage("Invalid username or password");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row w-full max-w-screen-xl shadow-2xl rounded-lg overflow-hidden bg-base-100">
        {/* Image Section (Expanded) */}
        <div className="lg:w-1/2 flex items-center justify-center p-8">
          <img
            src={loginpic}
            alt="Login Illustration"
            className="rounded-lg shadow-xl w-full h-auto object-cover max-h-[600px]"
          />
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-6 text-primary">
            Login
          </h2>
          {message && (
            <div
              role="alert"
              className={`alert ${
                message.includes("Invalid") ? "alert-error" : "alert-info"
              } mb-4`}
            >
              <span>{message}</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label justify-between">
                <span className="label-text">Password</span>
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="cursor-pointer label">
                <input type="checkbox" className="checkbox" />
                <span className="label-text ml-2">Remember me</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
