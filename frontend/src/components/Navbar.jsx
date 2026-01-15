import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-slate-800">TaskManager</Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-slate-600">Hi, {user.username || user.name || user.email}</span>
              <button onClick={handleLogout} className="px-3 py-1 rounded border hover:bg-slate-50">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 rounded border">Login</Link>
              <Link to="/register" className="px-3 py-1 rounded bg-slate-800 text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
