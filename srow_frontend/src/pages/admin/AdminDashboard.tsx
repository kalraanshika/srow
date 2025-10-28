import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import api from "../../services/api";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
export default function AdminDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");


  const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 4;
  useEffect(() => {
    fetchReports();
    fetchEmployees();
  }, []);

  const fetchReports = async () => {
    const res = await api.get("/admin/reports");
    setReports(res.data);
  };

  const fetchEmployees = async () => {
    const res = await api.get("/admin/employees");
    setEmployees(res.data);
  };

  const assignEmployee = async () => {
    if (!selectedReport || !selectedEmployee) return;
    await api.put(`/admin/reports/${selectedReport._id}/assign`, {
      employeeId: selectedEmployee,
    });
    setSelectedReport(null);
    setSelectedEmployee("");
    fetchReports();
  };

    const filteredReports = reports.filter(
    (r) =>
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const currentReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  return (
    <DashboardLayout role="admin">
      <div className="md:flex  justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-green-700  md:text-center">
        Admin Dashboard
      </h1>
        <div className="flex  items-center gap-4 mt-2">
          {/* Search bar */}
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search..."
          />
      
        </div>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-green-600 text-white text-left">
              <th className="p-3">Description</th>
              <th className="p-3">User</th>
              <th className="p-3">Status</th>
              <th className="p-3">Employee</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{r.description}</td>
                  <td className="p-3">{r.user?.name || "—"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        r.status === "open"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {r.assignedEmployee?.name || (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedReport(r);
                        setSelectedEmployee(r.assignedEmployee?._id || "");
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-6 italic"
                >
                  No reports available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-green-700 mb-4">
              Report Details
            </h2>

            <div className="space-y-3">
              <p>
                <strong>Description:</strong> {selectedReport.description}
              </p>
              <p>
                <strong>User:</strong> {selectedReport.user?.name || "—"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    selectedReport.status === "open"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {selectedReport.status}
                </span>
              </p>
              <div>
                <strong>Assign Employee:</strong>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="border p-2 rounded w-full mt-2"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={assignEmployee}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
