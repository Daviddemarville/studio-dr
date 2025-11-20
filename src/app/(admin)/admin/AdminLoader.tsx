export default function AdminLoader() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 animate-pulse p-6">
      <div className="h-6 w-1/4 bg-gray-700 rounded mb-6"></div>

      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );
}
