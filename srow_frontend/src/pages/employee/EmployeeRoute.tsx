import { useState, useEffect } from "react";
import api from "../../services/api";
import DashboardLayout from "@/layouts/DashboardLayout";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

interface Stop {
  _id: string;
  location: string;
  time: string;
  status: string;
  employeeMsg?: string;
}

interface Route {
  _id: string;
  routeName: string;   // ✅ match backend model field
  stops: Stop[];
}

export default function Employeeroots() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔎 Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/employeeroot/my-routes");
      setRoutes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch routes", err);
    } finally {
      setLoading(false);
    }
  };

  const markCollected = async (routeId: string, stopId: string) => {
    try {
      await api.put(`/employeeroot/collect/${routeId}/${stopId}`);
      fetchRoutes(); // refresh list after update
    } catch (err) {
      console.error("Failed to update stop", err);
    }
  };

  // 🔎 Filter routes safely
  const filteredRoutes = routes.filter((r) =>
    r.routeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);

  const currentRoutes = filteredRoutes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout role="employee">
      <div className="p-6">
        {/* Header */}
        <div className="md:flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700 md:text-center">My Routes</h1>
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search..."
          />
        </div>

        {loading ? (
          <p className="text-gray-600">Loading your routes...</p>
        ) : filteredRoutes.length === 0 ? (
          <p className="text-gray-600">No routes found.</p>
        ) : (
          <>
            {/* Routes Table */}
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="p-3">Route Name</th>
                  <th className="p-3">Total Stops</th>
                  <th className="p-3">Collected</th>
                  <th className="p-3">Pending</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRoutes.map((route) => {
                  const collected = route.stops.filter(
                    (s) => s.status === "collected"
                  ).length;
                  const pending = route.stops.length - collected;

                  return (
                    <tr key={route._id} className="border-t">
                      <td className="p-3">{route.routeName}</td>
                      <td className="p-3">{route.stops.length}</td>
                      <td className="p-3 text-green-600">{collected}</td>
                      <td className="p-3 text-red-600">{pending}</td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedRoute(route)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          View Stops
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Stops Dialog */}
        {selectedRoute && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedRoute(null)}
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-4 text-green-700">
                Stops for {selectedRoute.routeName}
              </h2>

              <table className="min-w-full bg-gray-50 rounded shadow">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">Location</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRoute.stops.map((stop) => (
                    <tr key={stop._id} className="border-t">
                      <td className="p-2">{stop.location}</td>
                      <td className="p-2">{stop.time}</td>
                      <td
                        className={`p-2 font-medium ${
                          stop.status === "collected"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stop.status}
                      </td>
                      <td className="p-2">
                        {stop.status !== "collected" && (
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                            onClick={() =>
                              markCollected(selectedRoute._id, stop._id)
                            }
                          >
                            Mark Collected
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
