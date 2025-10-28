import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, rootState } from "../../app/store";
import { fetchReports, addReport } from "../../features/reportSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import ReportCard from "../../components/ReportCard";


export default function UserDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { reports, loading } = useSelector((state: rootState) => state.reports);

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", location);
    if (file) formData.append("image", file);
    dispatch(addReport(formData));
    setDescription("");
    setLocation("");
    setFile(null);
    setShowForm(false); // hide form after submit
  };

  return (
    <DashboardLayout role="user">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-700">User Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Report Issue
        </button>
      </div>

      {/* Report Form in a dialog/modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              Report an Issue
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="border p-2 w-full rounded"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                className="border p-2 w-full rounded"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
              >
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reports List */}
      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <ReportCard key={r._id} report={r} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
