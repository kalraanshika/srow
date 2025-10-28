import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../app/store";
import api from "../../services/api";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
interface Task {
  _id: string;
  description: string;
  status: string;
  user: { name: string };
  employeeMsg?: string;
  employeeImage?: string;
}

export default function EmployeeDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // ✅ Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/employee/my-reports");
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleMsgChange = (taskId: string, msg: string) =>
    setMessages((prev) => ({ ...prev, [taskId]: msg }));

  const handleFileChange = (taskId: string, file: File | null) =>
    setFiles((prev) => ({ ...prev, [taskId]: file }));

  const handleUpdate = async (taskId: string) => {
    try {
      const formData = new FormData();
      if (messages[taskId]) formData.append("message", messages[taskId]);
      if (files[taskId]) formData.append("employeeImage", files[taskId]!);
      formData.append("status", "done");

      await api.put(`/employee/update-report/${taskId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) => ({ ...prev, [taskId]: "" }));
      setFiles((prev) => ({ ...prev, [taskId]: null }));
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Failed to update report:", error);
    }
  };

  // ✅ Apply search filter
  const filteredTasks = tasks.filter(
    (t) =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout role="employee">
      {/* Header with Search */}
      <div className="md:flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 md:text-center">
          Employee Dashboard
        </h1>
         <div className="flex items-center gap-4 mt-2">
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.length > 0 ? (
              currentTasks.map((t) => (
                <tr key={t._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{t.description}</td>
                  <td className="py-3 px-4">{t.status}</td>
                  <td className="py-3 px-4">{t.user.name}</td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      onClick={() => setSelectedTask(t)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 py-6 italic"
                >
                  No tasks found
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

      {/* Modal Dialog */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[500px] h-[600px] p-6 rounded-2xl shadow-2xl relative overflow-y-auto">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors"
              onClick={() => setSelectedTask(null)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-green-700 border-b pb-2">
              Task Details
            </h2>

            {/* Task Info */}
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-800">
                {selectedTask.description}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Status:</span>{" "}
                {selectedTask.status}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">User:</span>{" "}
                {selectedTask.user.name}
              </p>

              {selectedTask.employeeMsg && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
                  <p className="font-medium mb-1 text-green-800">
                    Your message:
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedTask.employeeMsg}
                  </p>
                </div>
              )}

              {selectedTask.employeeImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Uploaded Image:
                  </p>
                  <div className="w-[300px] h-[200px] border rounded overflow-hidden">
                    <img
                      src={`http://localhost:5000/uploads/${selectedTask.employeeImage}`}
                      alt="Employee Upload"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Input Fields */}
            {selectedTask.status !== "done" && (
              <div className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Add a message..."
                  className="border border-gray-300 focus:ring-2 focus:ring-green-400 p-2 rounded-md w-full"
                  value={messages[selectedTask._id] || ""}
                  onChange={(e) =>
                    handleMsgChange(selectedTask._id, e.target.value)
                  }
                />

                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100 transition"
                  onChange={(e) =>
                    handleFileChange(
                      selectedTask._id,
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />

                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md"
                  onClick={() => handleUpdate(selectedTask._id)}
                >
                  ✅ Mark as Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
