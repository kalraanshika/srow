import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password, role });
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form
  onSubmit={handleRegister}
  className="bg-white shadow-2xl p-8 rounded-2xl w-96 space-y-6 transform transition duration-500 hover:scale-105"
>
  <h1 className="text-3xl font-extrabold text-green-700 text-center mb-4">
    Create Account
  </h1>

  <div className="space-y-4">
    <input
      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
      placeholder="Full Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <input
      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <select
      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
      value={role}
      onChange={(e) => setRole(e.target.value)}
    >
      <option value="user">User</option>
      <option value="employee">Employee</option>
      <option value="admin">Admin</option>
    </select>
  </div>

  <button
    type="submit"
    className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold p-3 rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-lg"
  >
    Register
  </button>

  <p className="text-sm text-center text-gray-600">
    Already have an account?{" "}
    <a
      href="/login"
      className="text-green-600 font-semibold hover:underline"
    >
      Login
    </a>
  </p>
</form>

    </div>
  );
}
