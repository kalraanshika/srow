import { useState, useEffect } from "react";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
export default function AdminEmployeeIssues() {
  const [issues, setIssues] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<{ [key: string]: string }>({});
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);

  // ✅ Search & Pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const fetchIssues = async () => {
    const res = await api.get("/employee-issues/all");
    setIssues(res.data);
  };

  const handleUpdate = async (id: string, status: string) => {
    await api.put(`/employee-issues/update/${id}`, {
      adminMsg: solutions[id],
      status,
    });
    setSolutions((prev) => ({ ...prev, [id]: "" }));
    setSelectedIssue(null);
    fetchIssues();
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // ✅ Apply search filter
  const filteredIssues = issues.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.problem.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const totalPages = Math.ceil(filteredIssues.length/itemsPerPage);
  const currentIssues = filteredIssues.slice(
    (currentPage-1)*itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <DashboardLayout role="admin">
      {/* Header with search */}
      <div className="md:flex  justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 md:text-center ">Employee Issues</h1>

        <div className="flex items-center gap-4 mt-2">
               
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

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-green-600 text-white text-left">
              <th className="p-3">Employee</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Problem</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentIssues.length > 0 ? (
              currentIssues.map((i) => (
                <tr key={i._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{i.name}</td>
                  <td className="p-3">{i.vehicleNumber}</td>
                  <td className="p-3">{i.problem}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        i.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {i.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedIssue(i);
                        setSolutions((prev) => ({
                          ...prev,
                          [i._id]: i.adminMsg || "",
                        }));
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
                <td colSpan={5} className="text-center text-gray-500 py-6 italic">
                  No issues found
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
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSelectedIssue(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-green-700 mb-4">
              Issue Details
            </h2>

            <div className="space-y-3">
              <p>
                <strong>Employee:</strong> {selectedIssue.name}
              </p>
              <p>
                <strong>Vehicle:</strong> {selectedIssue.vehicleNumber}
              </p>
              <p>
                <strong>Problem:</strong> {selectedIssue.problem}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    selectedIssue.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {selectedIssue.status}
                </span>
              </p>
              {selectedIssue.adminMsg && (
                <p className="text-green-700">
                  <strong>Previous Reply:</strong> {selectedIssue.adminMsg}
                </p>
              )}

              <textarea
                className="border p-2 w-full mt-2 rounded"
                rows={3}
                value={solutions[selectedIssue._id] || ""}
                onChange={(e) =>
                  setSolutions((prev) => ({
                    ...prev,
                    [selectedIssue._id]: e.target.value,
                  }))
                }
                placeholder="Write your solution..."
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleUpdate(selectedIssue._id, "done")}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
              >
                Mark Done
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
