import React, { useState, useEffect } from "react";
import axios from "axios";
import { PencilLine, Trash } from "lucide-react";
import { Footer } from "@/layouts/footer";

const Busses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("all"); // 'all' or 'today'

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/buses/allBuses");
        setBuses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch buses");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  const todayDate = new Date().toISOString().split("T")[0];

  const todayBuses = buses.filter((bus) => {
    const departureDate = new Date(bus.busDepartureDate).toISOString().split("T")[0];
    return departureDate === todayDate;
  });

  const busesToDisplay = viewMode === "today" ? todayBuses : buses;

  if (loading) return <div>Loading buses...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col px-4 pb-10 gap-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Buses Management</h1>

      {/* Clickable Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div
          onClick={() => setViewMode("all")}
          className={`cursor-pointer p-6 rounded-xl shadow transition ${
            viewMode === "all"
              ? "bg-red-600 text-white"
              : "bg-red-100 border-l-4 border-red-500 text-red-900"
          }`}
        >
          <h2 className="text-xl font-semibold">All Buses</h2>
          <p className="mt-2 text-3xl font-bold">{buses.length}</p>
        </div>
        <div
          onClick={() => setViewMode("today")}
          className={`cursor-pointer p-6 rounded-xl shadow transition ${
            viewMode === "today"
              ? "bg-red-600 text-white"
              : "bg-red-100 border-l-4 border-red-500 text-red-900"
          }`}
        >
          <h2 className="text-xl font-semibold">Today's Buses</h2>
          <p className="mt-2 text-3xl font-bold">{todayBuses.length}</p>
        </div>
      </div>

      {/* Buses Table */}
      <div className="mt-6 card">
        <div className="card-header">
          <p className="card-title">{viewMode === "today" ? "Today's Buses" : "All Buses"} List</p>
        </div>
        <div className="p-0 card-body">
          <div className="relative h-[500px] w-full overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table">
              <thead className="bg-gray-100 table-header">
                <tr className="table-row">
                  <th className="table-head">Bus Name</th>
                  <th className="table-head">Departure Date & Time</th>
                  <th className="table-head">From</th>
                  <th className="table-head">To</th>
                  <th className="table-head">Plate No</th>
                  <th className="table-head">Price</th>
                  <th className="table-head">Available Seats</th>
                  <th className="table-head">Total Seats</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {busesToDisplay.map((bus) => {
                  const departureDate = new Date(bus.busDepartureDate);
                  return (
                    <tr key={bus._id} className="table-row hover:bg-gray-50">
                      <td className="table-cell">{bus.busName}</td>
                      <td className="table-cell">
                        <div className="text-sm">{departureDate.toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{departureDate.toLocaleTimeString()}</div>
                      </td>
                      <td className="table-cell">{bus.busCitiesAndTimes[0]?.cityName || "N/A"}</td>
                      <td className="table-cell">
                        {bus.busCitiesAndTimes[bus.busCitiesAndTimes.length - 1]?.cityName || "N/A"}
                      </td>
                      <td className="table-cell">{bus.busPlateNo || "N/A"}</td>
                      <td className="table-cell">Rs.{bus.busTicketPrice || "0"}</td>
                      <td className="table-cell">
                        {bus.seats ? bus.seats.filter((seat) => seat.availability === "available").length : 0}
                      </td>
                      <td className="table-cell">{bus.seats ? bus.seats.length : 0}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-x-4">
                          <button className="text-blue-500 hover:text-blue-700">
                            <PencilLine size={20} />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {busesToDisplay.length === 0 && (
                  <tr>
                    <td colSpan="9" className="py-4 text-center text-gray-500">
                      No buses found for the selected view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Busses;
