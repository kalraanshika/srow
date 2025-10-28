// pages/Login.tsx
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/store";
import { login } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Zod schema for validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, status, error } = useAppSelector((state) => state.auth);
 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate input
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setFormError(result.error.errors[0].message);
      return;
    }

    // Dispatch login
    dispatch(login({ email, password }));
  };
 

  // Navigate after login
  useEffect(() => {
    if (user && token) {
      if (user.role === "user") navigate("/user");
      else if (user.role === "employee") navigate("/employee");
      else if (user.role === "admin") navigate("/admin");
    }
  }, [user, token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-green-400">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl p-8 rounded-2xl w-96 space-y-6 transform transition duration-500 hover:scale-105"
      >
        <h2 className="text-3xl font-extrabold text-green-700 text-center mb-4">Login</h2>

        {formError && <p className="text-red-600 text-sm">{formError}</p>}
        {status === "failed" && <p className="text-red-600 text-sm">{error}</p>}

        <input
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-4">
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-lg shadow-md transition transform hover:scale-105"
          type="submit"
          disabled={status === "loading"}
        >
          Login
        </button>
        <button
          className="w-full text-green-600 border-2 border-green-600 font-semibold p-3 rounded-lg shadow-md transition transform hover:scale-105"
          type="button"
          onClick={() => navigate("/register")}
          disabled={status === "loading"}
        >
          Register
        </button>
        
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
