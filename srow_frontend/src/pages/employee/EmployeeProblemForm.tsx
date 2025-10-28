import { useState, useEffect } from "react";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
interface Issue {
  _id: string;
  name: string;
  vehicleNumber: string;
  problem: string;
  status: string;
  adminMsg?: string;
}

export default function EmployeeProblemForm() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [name, setName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [problem, setProblem] = useState("");

  const fetchIssues = async () => {
    try {
      const res = await api.get("/employee-issues/my-issues");
      setIssues(res.data);
    } catch (err) {
      console.error("Failed to fetch issues", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/employee-issues/create", { name, vehicleNumber, problem });
      setName("");
      setVehicleNumber("");
      setProblem("");
      setOpenForm(false);
      fetchIssues();
    } catch (err) {
      console.error("Failed to create issue", err);
    }
  };
   const [searchQuery,setSearchQuery] = useState("");
   const [currentPage,setCurrentPage] = useState(1);
   const issuesEmpPerPage = 2;

  useEffect(() => {
    fetchIssues();
  }, []);

  const filteredIssuesEmp = issues.filter(
    (i) => 
      i.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredIssuesEmp.length/issuesEmpPerPage);

  const currentIssuesEmp = filteredIssuesEmp.slice(
    (currentPage-1)* issuesEmpPerPage,
    currentPage * issuesEmpPerPage
  );
  return (
    <DashboardLayout role="employee">
      <div className="md:flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 md:text-center m-2">Employee Issues</h1>
      
          <div className="flex items-center gap-4 ">
            {/* Search bar */}
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search ..."
            />
          <button
          onClick={() => setOpenForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow "
        >
          
        <span className="block sm:hidden">+</span>
        <span className="hidden sm:block">Report Issue</span>
        </button>
           
          </div>
      </div>

      {/* Issues Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Vehicle No</th>
              <th className="py-3 px-4 text-left">Problem</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Admin Message</th>
            </tr>
          </thead>
          <tbody>
            {currentIssuesEmp.length > 0 ? (
              currentIssuesEmp.map((i) => (
                <tr key={i._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{i.name}</td>
                  <td className="py-3 px-4">{i.vehicleNumber}</td>
                  <td className="py-3 px-4">{i.problem}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        i.status === "open"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {i.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-green-700">
                    {i.adminMsg || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No issues reported yet.
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
      {/* Modal Form */}
      {openForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setOpenForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-green-700 mb-4">
              Report a Problem
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="border p-2 w-full rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
              <input
                className="border p-2 w-full rounded"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="Vehicle Number"
                required
              />
              <textarea
                className="border p-2 w-full rounded"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe the problem"
                rows={4}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
