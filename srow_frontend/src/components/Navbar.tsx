import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/store";
import { logout } from "../features/authSlice";
import { Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center shadow">
      {/* Left: Hamburger (only mobile) + Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded hover:bg-green-700 transition"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-xl tracking-wide">♻️ SROW</h1>
      </div>

      {/* Right: Logout */}
      <button
        onClick={handleLogout}
        className="bg-green-800 hover:bg-green-700 px-4 py-2 rounded-md font-medium transition"
      >
        Logout
      </button>
    </nav>
  );
}
