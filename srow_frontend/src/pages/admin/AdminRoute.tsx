import { useState, useEffect } from "react";
import api from "../../services/api";
import DashboardLayout from "@/layouts/DashboardLayout";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

interface Employee {
  _id: string;
  name: string;
}

interface Stop {
  location: string;
  time: string;
  status?: string; // ✅ added to show pending/collected
}

interface Root {
  _id: string;
  routeName: string; // ✅ fixed (was rootName)
  employee?: Employee;
  stops: Stop[];
}

export default function Adminroots() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [routes, setRoutes] = useState<Root[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [routeName, setRouteName] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Root | null>(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const routesPerPage = 5;

  useEffect(() => {
    fetchEmployees();
    fetchRoutes();
  }, []);

  const fetchEmployees = async () => {
    const res = await api.get("/admin/employees");
    setEmployees(res.data);
  };

  const fetchRoutes = async () => {
    const res = await api.get("/adminroot/routes");
    setRoutes(res.data);
  };

  const addStop = () => {
    setStops([...stops, { location: "", time: "" }]);
  };

  const handleStopChange = (index: number, field: keyof Stop, value: string) => {
    const newStops = [...stops];
    newStops[index][field] = value;
    setStops(newStops);
  };

  const handleSubmit = async () => {
    try {
      await api.post("/adminroot", { routeName, employeeId, stops });
      alert("Route created");
      setRouteName("");
      setEmployeeId("");
      setStops([]);
      setShowForm(false);
      fetchRoutes();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter + Pagination
  const filteredRoutes = routes.filter(
    (r) =>
      r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoutes.length / routesPerPage);

  const currentRoutes = filteredRoutes.slice(
    (currentPage - 1) * routesPerPage,
    currentPage * routesPerPage
  );

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        {/* Header */}
        <div className="md:flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Manage Routes</h1>

          <div className="md:flex items-center gap-4 ">
            {/* Search bar */}
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search ..."
            />

            {/* Create button */}
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow mt-2 md:mt-0"
            >
              + Create Route
              
            </button>
          </div>
        </div>

        {/* Routes Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-green-600 text-white text-left">
                <th className="p-3">Route Name</th>
                <th className="p-3">Employee</th>
                <th className="p-3">Stops</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRoutes.length > 0 ? (
                currentRoutes.map((r) => (
                  <tr key={r._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{r.routeName}</td>
                    <td className="p-3">{r.employee?.name || "Unassigned"}</td>
                    <td className="p-3">{r.stops.length}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedRoute(r)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-6 italic">
                    No routes available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Create Route Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold text-green-700 mb-4">Create New Route</h2>

              <input
                type="text"
                placeholder="Route Name"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />

              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>

              <h3 className="font-semibold mb-2">Stops</h3>
              {stops.map((stop, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    placeholder="Location"
                    value={stop.location}
                    onChange={(e) => handleStopChange(i, "location", e.target.value)}
                    className="border p-2 rounded flex-1"
                  />
                  <input
                    type="time"
                    value={stop.time}
                    onChange={(e) => handleStopChange(i, "time", e.target.value)}
                    className="border p-2 rounded"
                  />
                </div>
              ))}

              <button
                onClick={addStop}
                className="bg-green-500 text-white px-3 py-1 rounded mb-3"
              >
                + Add Stop
              </button>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                >
                  Create Route
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Route Modal */}
        {selectedRoute && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => setSelectedRoute(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold text-green-700 mb-4">Route Details</h2>

              <p>
                <strong>Name:</strong> {selectedRoute.routeName}
              </p>
              <p>
                <strong>Employee:</strong> {selectedRoute.employee?.name || "Unassigned"}
              </p>
              <p>
                <strong>Total Stops:</strong> {selectedRoute.stops.length}
              </p>

              <h3 className="font-semibold mt-4 mb-2">Stops</h3>
              <ul className="list-disc pl-5 space-y-1">
                {selectedRoute.stops.map((stop, i) => (
                  <li key={i}>
                    {stop.location} - <span className="text-gray-500">{stop.time}</span>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded ${
                        stop.status === "collected"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {stop.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
