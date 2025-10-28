import DashboardLayout from '@/layouts/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Pagination from '@/components/Pagination';
import { useAppSelector } from "@/app/store";
const BinMonitoringUser = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
   const { user } = useAppSelector((state) => state.auth);
  


  

  useEffect(() => {
    const getdata = async () => {
      const { data: bin_level, error } = await supabase
        .from('bin_level')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error("Error fetching bin_level:", error);
      } else {
        setData(bin_level);
      }
      setLoading(false);
    };

    getdata();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout role={user?.role}>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Bin Monitoring</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto  bg-white shadow-md rounded-lg">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="border p-2 text-left">ID</th>
                    <th className="border p-2 text-left">Location</th>
                    <th className="border p-2 text-left">Status</th>
                    <th className="border p-2 text-left">Fill Level</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 border-t">
                      <td className="p-2">{item.id}</td>
                      <td className="p-2">{item.location}</td>
                      <td className="p-2">{item.status}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded h-4 relative overflow-hidden">
                            <div
                              className={`h-full ${
                                item.fill_level >= 75
                                  ? 'bg-red-500'
                                  : item.fill_level >= 50
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${item.fill_level}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{item.fill_level}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BinMonitoringUser;
