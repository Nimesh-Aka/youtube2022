import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBus = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [buses, setBuses] = useState([]);
    const [filteredBuses, setFilteredBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [expandedBusId, setExpandedBusId] = useState(null);

    useEffect(() => {
        if (id) {
            navigate(`/edit-bus/${id}`);
        } else {
            fetchBuses();
        }
    }, [id, navigate]);

    const fetchBuses = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8000/api/buses/allBuses");
            setBuses(response.data);
            setFilteredBuses(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch buses. Please try again later.");
            console.error("Error fetching buses:", err);
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setFilteredBuses(buses);
        } else {
            const filtered = buses.filter(
                (bus) => bus.busPlateNo.toLowerCase().includes(value.toLowerCase()) || bus.busName.toLowerCase().includes(value.toLowerCase()),
            );
            setFilteredBuses(filtered);
        }
    };

    const handleUpdateBus = (busId) => {
        navigate(`/edit-bus/${busId}`);
    };

    const handleDeleteBus = async (busId) => {
        try {
            setDeleteLoading(true);
            await axios.delete(`http://localhost:8000/api/buses/${busId}`);

            const updatedBuses = buses.filter((bus) => bus._id !== busId);
            setBuses(updatedBuses);
            setFilteredBuses(updatedBuses);

            alert("Bus deleted successfully");
            setDeleteLoading(false);
        } catch (err) {
            setError("Failed to delete bus. Please try again later.");
            console.error("Error deleting bus:", err);
            setDeleteLoading(false);
        }
    };

    const toggleExpandBus = (busId) => {
        if (expandedBusId === busId) {
            setExpandedBusId(null);
        } else {
            setExpandedBusId(busId);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getFirstCity = (busCitiesAndTimes) => {
        if (busCitiesAndTimes && busCitiesAndTimes.length > 0) {
            return busCitiesAndTimes[0].cityName;
        }
        return "N/A";
    };

    const getDepartureTime = (busCitiesAndTimes) => {
        if (busCitiesAndTimes && busCitiesAndTimes.length > 0) {
            return busCitiesAndTimes[0].arrivalTime;
        }
        return "N/A";
    };

    const getLastCity = (busCitiesAndTimes) => {
        if (busCitiesAndTimes && busCitiesAndTimes.length > 0) {
            return busCitiesAndTimes[busCitiesAndTimes.length - 1].cityName;
        }
        return "N/A";
    };

    const countAvailableSeats = (seats) => {
        if (!seats || !seats.length) return 0;
        return seats.filter((seat) => seat.availability === "available").length;
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-2">Loading buses...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                role="alert"
            >
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Bus Management</h1>
                <button
                    onClick={() => navigate("/add-bus")}
                    className="flex items-center rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Add New Bus
                </button>
            </div>

            {/* Search Box */}
            <div className="mb-6">
                <div className="flex items-center rounded-lg bg-white p-2 shadow-md">
                    <input
                        type="text"
                        className="flex-grow border-none p-2 focus:outline-none"
                        placeholder="Search by bus name or plate number..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className="rounded-md bg-blue-500 p-2 text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Buses List */}
            <div className="space-y-6">
                {filteredBuses.length > 0 ? (
                    filteredBuses.map((bus) => (
                        <div
                            key={bus._id}
                            className="overflow-hidden rounded-lg bg-white shadow-md"
                        >
                            {/* Bus Summary Row */}
                            <div
                                className="flex cursor-pointer flex-wrap items-center justify-between p-4 hover:bg-gray-50 md:flex-nowrap"
                                onClick={() => toggleExpandBus(bus._id)}
                            >
                                <div className="mb-2 flex w-full items-center space-x-3 md:mb-0 md:w-auto">
                                    <div className="flex-shrink-0 rounded-full bg-blue-100 p-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-blue-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6h12a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{bus.busName}</h3>
                                        <p className="text-sm text-gray-600">Plate: {bus.busPlateNo}</p>
                                    </div>
                                </div>

                                <div className="flex w-full flex-wrap gap-4 md:w-auto md:flex-nowrap">
                                    <div className="px-2 text-center md:px-4">
                                        <p className="text-sm text-gray-500">Type</p>
                                        <p className="font-medium">{bus.busType || "N/A"}</p>
                                    </div>

                                    <div className="px-2 text-center md:px-4">
                                        <p className="text-sm text-gray-500">From</p>
                                        <p className="font-medium">{getFirstCity(bus.busCitiesAndTimes)}</p>
                                    </div>

                                    <div className="px-2 text-center md:px-4">
                                        <p className="text-sm text-gray-500">To</p>
                                        <p className="font-medium">{getLastCity(bus.busCitiesAndTimes)}</p>
                                    </div>

                                    <div className="px-2 text-center md:px-4">
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium">{formatDate(bus.busDepartureDate)}</p>
                                    </div>

                                    <div className="px-2 text-center md:px-4">
                                        <p className="text-sm text-gray-500">Price</p>
                                        <p className="font-medium">Rs. {bus.busTicketPrice?.toLocaleString() || "N/A"}</p>
                                    </div>

                                    <div className="px-2 text-center md:px-4">
                                        <p className="text-sm text-gray-500">Available Seats</p>
                                        <p className="font-medium">
                                            {countAvailableSeats(bus.seats)} / {bus.seats?.length || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-2 flex w-full items-center justify-end space-x-2 md:mt-0 md:w-auto">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateBus(bus._id);
                                        }}
                                        className="flex items-center rounded bg-blue-500 px-3 py-2 font-bold text-white hover:bg-blue-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Edit
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Are you sure you want to delete bus "${bus.busName}" (${bus.busPlateNo})?`)) {
                                                handleDeleteBus(bus._id);
                                            }
                                        }}
                                        disabled={deleteLoading}
                                        className="flex items-center rounded bg-red-500 px-3 py-2 font-bold text-white hover:bg-red-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Delete
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpandBus(bus._id);
                                        }}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        {expandedBusId === bus._id ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 15l7-7 7 7"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedBusId === bus._id && (
                                <div className="border-t border-gray-200 p-4">
                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                        {/* Column 1: Basic Details & Amenities */}
                                        <div>
                                            <h4 className="mb-2 text-lg font-bold text-gray-800">Bus Details</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Name:</span>
                                                    <span className="font-medium">{bus.busName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Plate Number:</span>
                                                    <span className="font-medium">{bus.busPlateNo}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Type:</span>
                                                    <span className="font-medium">{bus.busType || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Ownership:</span>
                                                    <span className="font-medium">{bus.busOwnership || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Departure Date:</span>
                                                    <span className="font-medium">{formatDate(bus.busDepartureDate)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Price:</span>
                                                    <span className="font-medium">Rs. {bus.busTicketPrice?.toLocaleString() || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Recommends:</span>
                                                    <span className="font-medium">{bus.recommends || 0}</span>
                                                </div>
                                            </div>

                                            <h4 className="mb-2 mt-4 text-lg font-bold text-gray-800">Amenities</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {bus.busAmenities && bus.busAmenities.length > 0 ? (
                                                    bus.busAmenities.map((amenity, index) => (
                                                        <span
                                                            key={index}
                                                            className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
                                                        >
                                                            {amenity}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500">No amenities listed</span>
                                                )}
                                            </div>

                                            {bus.passengersMessage && (
                                                <div className="mt-4">
                                                    <h4 className="mb-2 text-lg font-bold text-gray-800">Message for Passengers</h4>
                                                    <div className="rounded-md bg-gray-50 p-3 text-sm">{bus.passengersMessage}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Column 2: Route Details */}
                                        <div>
                                            <h4 className="mb-2 text-lg font-bold text-gray-800">Route Information</h4>
                                            <div className="space-y-4">
                                                {bus.busCitiesAndTimes && bus.busCitiesAndTimes.length > 0 ? (
                                                    bus.busCitiesAndTimes.map((stop, index) => (
                                                        <div
                                                            key={index}
                                                            className={`p-3 ${index === 0 ? "border-l-4 border-blue-500 bg-blue-50" : "bg-gray-50"} rounded-md`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="flex items-center">
                                                                        {index === 0 ? (
                                                                            <span className="mr-2 inline-block flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                                                                                S
                                                                            </span>
                                                                        ) : index === bus.busCitiesAndTimes.length - 1 ? (
                                                                            <span className="mr-2 inline-block flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                                                                                E
                                                                            </span>
                                                                        ) : (
                                                                            <span className="mr-2 inline-block flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-xs text-white">
                                                                                {index}
                                                                            </span>
                                                                        )}
                                                                        <span className="font-medium">{stop.cityName}</span>
                                                                    </div>
                                                                    <div className="ml-8 text-sm text-gray-500">
                                                                        {index === 0 ? "Departure Time" : "Arrival Time"}: {stop.arrivalTime}
                                                                    </div>
                                                                </div>
                                                                {stop.platform && (
                                                                    <div className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                                                        Platform: {stop.platform}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-gray-500">No route information available</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Column 3: Seat Layout */}
                                        <div>
                                            <h4 className="mb-2 text-lg font-bold text-gray-800">Seat Layout</h4>
                                            <div className="rounded-md bg-gray-50 p-4">
                                                <div className="mb-3 text-center">
                                                    <div className="mb-2 flex justify-center space-x-6">
                                                        <div className="flex items-center">
                                                            <div className="mr-1 h-4 w-4 rounded-sm bg-green-500"></div>
                                                            <span className="text-xs">Available</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="mr-1 h-4 w-4 rounded-sm bg-red-500"></div>
                                                            <span className="text-xs">Booked</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="mr-1 h-4 w-4 rounded-sm bg-gray-700"></div>
                                                            <span className="text-xs">Maintenance</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {bus.seats && bus.seats.length > 0 ? (
                                                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                                                        {/* Bus front with driver position */}
                                                        <div className="mb-6 flex justify-end border-b pb-4">
                                                            <div className="flex items-center">
                                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-8 w-8 text-red-600"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="ml-2 text-sm font-medium">Driver</div>
                                                            </div>
                                                        </div>

                                                        {/* Vertical seat layout */}
                                                        <div className="flex justify-center">
                                                            <div className="flex space-x-6">
                                                                {/* Right column (even B seats: B2, B4, B6, etc.) */}
                                                                <div className="flex flex-col space-y-4">
                                                                    {Array.from({ length: 9 }, (_, i) => {
                                                                        const seatNumber = `B${i * 2 + 2}`;
                                                                        const seat = bus.seats.find((s) => s.seatNumber === seatNumber);
                                                                        return (
                                                                            <div
                                                                                key={`right2-${i}`}
                                                                                className="flex flex-col items-center"
                                                                            >
                                                                                <div
                                                                                    className={`flex h-10 w-12 items-center justify-center rounded-t-lg border-2 ${
                                                                                        !seat
                                                                                            ? "border-gray-200 bg-white text-gray-400"
                                                                                            : seat.availability === "available"
                                                                                              ? "border-green-500 bg-green-100 text-green-700"
                                                                                              : seat.availability === "booked"
                                                                                                ? "border-red-500 bg-red-100 text-red-700"
                                                                                                : "border-gray-500 bg-gray-300 text-gray-700"
                                                                                    }`}
                                                                                >
                                                                                    {seatNumber}
                                                                                </div>
                                                                                <div className="h-1 w-4 bg-gray-300"></div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>

                                                                {/* Right column (odd B seats: B1, B3, B5, etc.) */}
                                                                <div className="flex flex-col space-y-4">
                                                                    {Array.from({ length: 9 }, (_, i) => {
                                                                        const seatNumber = `B${i * 2 + 1}`;
                                                                        const seat = bus.seats.find((s) => s.seatNumber === seatNumber);
                                                                        return (
                                                                            <div
                                                                                key={`right1-${i}`}
                                                                                className="flex flex-col items-center"
                                                                            >
                                                                                <div
                                                                                    className={`flex h-10 w-12 items-center justify-center rounded-t-lg border-2 ${
                                                                                        !seat
                                                                                            ? "border-gray-200 bg-white text-gray-400"
                                                                                            : seat.availability === "available"
                                                                                              ? "border-green-500 bg-green-100 text-green-700"
                                                                                              : seat.availability === "booked"
                                                                                                ? "border-red-500 bg-red-100 text-red-700"
                                                                                                : "border-gray-500 bg-gray-300 text-gray-700"
                                                                                    }`}
                                                                                >
                                                                                    {seatNumber}
                                                                                </div>
                                                                                <div className="h-1 w-4 bg-gray-300"></div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>

                                                                {/* Center aisle - With A19 added as a rear center seat */}
                                                                <div className="flex flex-col items-center">
                                                                    <div className="flex h-full w-6 items-center justify-center border-l-2 border-r-2 border-dashed border-gray-300">
                                                                        <span className="rotate-90 whitespace-nowrap text-xs text-gray-500">
                                                                            Aisle
                                                                        </span>
                                                                    </div>

                                                                    {/* A19 seat at the bottom center */}
                                                                    {(() => {
                                                                        const seatNumber = "A19";
                                                                        const seat = bus.seats.find((s) => s.seatNumber === seatNumber);
                                                                        return (
                                                                            <div
                                                                                key="A19"
                                                                                className="mt-4 flex flex-col items-center"
                                                                            >
                                                                                <div
                                                                                    className={`flex h-10 w-12 items-center justify-center rounded-t-lg border-2 ${
                                                                                        !seat
                                                                                            ? "border-gray-200 bg-white text-gray-400"
                                                                                            : seat.availability === "available"
                                                                                              ? "border-green-500 bg-green-100 text-green-700"
                                                                                              : seat.availability === "booked"
                                                                                                ? "border-red-500 bg-red-100 text-red-700"
                                                                                                : "border-gray-500 bg-gray-300 text-gray-700"
                                                                                    }`}
                                                                                >
                                                                                    {seatNumber}
                                                                                </div>
                                                                                <div className="h-1 w-4 bg-gray-300"></div>
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>

                                                                {/* Left column (even A seats: A2, A4, A6, etc.) */}
                                                                <div className="flex flex-col space-y-4">
                                                                    {Array.from({ length: 9 }, (_, i) => {
                                                                        const seatNumber = `A${i * 2 + 2}`;
                                                                        const seat = bus.seats.find((s) => s.seatNumber === seatNumber);
                                                                        return (
                                                                            <div
                                                                                key={`left2-${i}`}
                                                                                className="flex flex-col items-center"
                                                                            >
                                                                                <div
                                                                                    className={`flex h-10 w-12 items-center justify-center rounded-t-lg border-2 ${
                                                                                        !seat
                                                                                            ? "border-gray-200 bg-white text-gray-400"
                                                                                            : seat.availability === "available"
                                                                                              ? "border-green-500 bg-green-100 text-green-700"
                                                                                              : seat.availability === "booked"
                                                                                                ? "border-red-500 bg-red-100 text-red-700"
                                                                                                : "border-gray-500 bg-gray-300 text-gray-700"
                                                                                    }`}
                                                                                >
                                                                                    {seatNumber}
                                                                                </div>
                                                                                <div className="h-1 w-4 bg-gray-300"></div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>

                                                                {/* Left column (odd A seats: A1, A3, A5, etc.) */}
                                                                <div className="flex flex-col space-y-4">
                                                                    {Array.from({ length: 9 }, (_, i) => {
                                                                        const seatNumber = `A${i * 2 + 1}`;
                                                                        const seat = bus.seats.find((s) => s.seatNumber === seatNumber);
                                                                        return (
                                                                            <div
                                                                                key={`left1-${i}`}
                                                                                className="flex flex-col items-center"
                                                                            >
                                                                                <div
                                                                                    className={`flex h-10 w-12 items-center justify-center rounded-t-lg border-2 ${
                                                                                        !seat
                                                                                            ? "border-gray-200 bg-white text-gray-400"
                                                                                            : seat.availability === "available"
                                                                                              ? "border-green-500 bg-green-100 text-green-700"
                                                                                              : seat.availability === "booked"
                                                                                                ? "border-red-500 bg-red-100 text-red-700"
                                                                                                : "border-gray-500 bg-gray-300 text-gray-700"
                                                                                    }`}
                                                                                >
                                                                                    {seatNumber}
                                                                                </div>
                                                                                <div className="h-1 w-4 bg-gray-300"></div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="py-4 text-center text-gray-500">No seat information available</div>
                                                )}

                                                {bus.seats && bus.seats.length > 0 && (
                                                    <div className="mt-4 rounded-md bg-white p-3 shadow-sm">
                                                        <div className="flex justify-around text-sm">
                                                            <div>
                                                                <span className="font-medium">Available: </span>
                                                                <span className="font-bold text-green-600">
                                                                    {bus.seats.filter((seat) => seat.availability === "available").length}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Booked: </span>
                                                                <span className="font-bold text-red-600">
                                                                    {bus.seats.filter((seat) => seat.availability === "booked").length}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Maintenance: </span>
                                                                <span className="font-bold text-gray-600">
                                                                    {bus.seats.filter((seat) => seat.availability === "maintenance").length}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="rounded-lg bg-white p-8 text-center shadow-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-16 w-16 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            {searchTerm ? "No buses found matching your search." : "No buses available."}
                        </h3>
                        <p className="mt-2 text-gray-500">{searchTerm ? "Please try a different search term." : "Add a new bus to get started."}</p>
                    </div>
                )}
            </div>

            {/* Total Count */}
            <div className="mt-4 text-gray-600">
                Total buses: {filteredBuses.length}
                {searchTerm && filteredBuses.length !== buses.length && ` (filtered from ${buses.length})`}
            </div>
        </div>
    );
};

export default UpdateBus;
