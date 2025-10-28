import { useState, useEffect } from "react";
import api from "../../services/api";
import DashboardLayout from "@/layouts/DashboardLayout";

interface Stop {
  _id: string;
  location: string;
  time: string;
  status: string;
}

interface Root {
  _id: string;
  routeName: string;
  employee: { name: string };
  date: string;
  stops: Stop[];
}

export default function Userroots() {
  const [roots, setRoots] = useState<Root[]>([]);
  const [filteredRoots, setFilteredRoots] = useState<Root[]>([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expandedRoot, setExpandedRoot] = useState<string | null>(null);

  useEffect(() => {
    fetchRoots();
  }, []);

  const fetchRoots = async () => {
    try {
      const res = await api.get("/userroot/all-routes");
      setRoots(res.data);
      console.log(res);
      setFilteredRoots(res.data);
    } catch (err) {
      console.error("Failed to fetch roots", err);
    }
  };

  const applyFilters = () => {
    let result = roots;

    if (search) {
      result = result.filter(
        (root) =>
          root.rootName.toLowerCase().includes(search.toLowerCase()) ||
          root.employee?.name.toLowerCase().includes(search.toLowerCase()) ||
          root.stops.some((stop) =>
            stop.location.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    if (fromDate) {
      result = result.filter((root) => new Date(root.date) >= new Date(fromDate));
    }
    if (toDate) {
      result = result.filter((root) => new Date(root.date) <= new Date(toDate));
    }

    setFilteredRoots(result);
  };

  return (
    <DashboardLayout role="user">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Today’s routes</h1>

       

        {/* Routes List */}
        {filteredRoots.length === 0 ? (
          <p className="text-gray-600">No route found.</p>
        ) : (
          <div className="space-y-4">
            {filteredRoots.map((root) => (
              <div
                key={root._id}
                className="border rounded shadow p-4 bg-white"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandedRoot(expandedRoot === root._id ? null : root._id)
                  }
                >
                  <h2 className="text-lg font-semibold text-green-700">
                    {root.routeName}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {expandedRoot === root._id ? "▲ Hide Stops" : "▼ Show Stops"}
                  </span>
                </div>

                {expandedRoot === root._id && (
                  <table className="min-w-full mt-3 border">
                    <thead>
                      <tr className="bg-gray-200 text-left">
                        <th className="p-2">Location</th>
                        <th className="p-2">Time</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {root.stops.map((stop) => (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
