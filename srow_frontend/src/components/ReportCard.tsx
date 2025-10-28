export default function ReportCard({ report }: { report: any }) {
  // Status colors
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 flex items-center justify-between gap-4 border border-gray-100">
      {/* Left: Text info */}
      <div className="flex-1">
        <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">
          {report.description}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          📍 <span className="font-medium">{report.location}</span>
        </p>
        <span
          className={`inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full ${
            statusColors[report.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
        </span>
      </div>

      {/* Right: Image */}
      {report.image && (
        <div className="flex-shrink-0">
          <img
            src={`http://localhost:5000/${report.image}`}
            alt="proof"
            className="h-16 w-16 object-cover rounded-xl border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}
