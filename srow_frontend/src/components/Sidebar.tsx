import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function Sidebar({
  role,
  open,
  setOpen,
}: {
  role: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-green-600 text-white shadow-lg z-50 transform transition-transform duration-300 
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:block`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 text-xl font-bold border-b border-green-600 ">
          {role === "user" && "User Panel"}
          {role === "employee" && "Employee Panel"}
          {role === "admin" && "Admin Panel"}
          <button
            className="lg:hidden p-2 rounded hover:bg-green-600"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="p-4 space-y-3">
          {role === "user" && (
            <>
              <Link to="/user" className="block px-3 py-2 rounded hover:bg-white hover:text-green-600">
                Dashboard
              </Link>
              <Link to="/user/routes" className="block px-3 py-2 rounded hover:bg-white hover:text-green-600">
                My Route
              </Link>
              <Link to="/user/binMonitor" className="block px-3 py-2 rounded hover:bg-white hover:text-green-600">
                Bin Status
              </Link>
          
              
            </>
          )}

          {role === "employee" && (
            <>
              <Link to="/employee" className="block px-3 py-2 rounded hover:bg-white hover:text-green-600">
                Dashboard
              </Link>
              <Link to="/employee/routes" className="block px-3 py-2 rounded hover:bg-white hover:text-green-600">
                My Route
              </Link>
              <Link to="/employee/problems" className="block px-3 py-2 rounded hover:bg-white hover:text-green-600">
                Report Problem
              </Link>
              <Link to="/employee/binMonitor" className="block px-3 py-2 rounded hover:bg-white hover:text-green-600">
                Bin Status
              </Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link to="/admin" className="block px-3 py-2 rounded hover:bg-white hover:text-green-600">
                Dashboard
              </Link>
              <Link to="/admin/routes" className="block px-3 py-2 rounded hover:bg-white hover:text-green-600">
                Manage Route
              </Link>
              <Link to="/admin/issues" className="block px-3 py-2 rounded hover:bg-white hover:text-green-600">
                Employee Issues
              </Link>
              <Link to="/admin/binMonitor" className="block px-3 py-2 rounded hover:bg-white hover:text-green-600">
                Bin Status
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
