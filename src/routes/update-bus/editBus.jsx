import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditBus = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [busData, setBusData] = useState({
        busName: "",
        busPlateNo: "",
        busType: "",
        busOwnership: "",
        busAmenities: [],
        recommends: 0,
        passengersMessage: "",
        busCitiesAndTimes: [{ cityName: "", arrivalTime: "" }],
        busTicketPrice: 0,
        busDepartureDate: new Date(),
        seats: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    // Amenities options based on your schema
    const amenitiesOptions = ["Internet/Wifi", "AC", "Charging Ports", "Fan"];

    // Bus types and ownership options from your schema
    const busTypes = ["AC Delux", "Tourist AC Delux", "Air Suspension", "Semi Luxury"];
    const ownershipTypes = ["CTB", "Private"];

    // Fetch the specific bus data
    useEffect(() => {
        const fetchBusData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8000/api/buses/find/${id}`);
                const bus = response.data;

                // Format date for the component
                const formattedDate = bus.busDepartureDate ? new Date(bus.busDepartureDate) : new Date();

                setBusData({
                    ...bus,
                    busDepartureDate: formattedDate,
                });

                setLoading(false);
            } catch (err) {
                setError("Failed to load bus data. Please try again later.");
                console.error("Error fetching bus data:", err);
                setLoading(false);
            }
        };

        fetchBusData();
    }, [id]);

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBusData({ ...busData, [name]: value });
    };

    // Handle checkbox change for amenities
    const handleAmenityChange = (amenity) => {
        if (busData.busAmenities.includes(amenity)) {
            setBusData({
                ...busData,
                busAmenities: busData.busAmenities.filter((item) => item !== amenity),
            });
        } else {
            setBusData({
                ...busData,
                busAmenities: [...busData.busAmenities, amenity],
            });
        }
    };

    // Handle cities and times change
    const handleCityTimeChange = (index, field, value) => {
        const updatedCitiesAndTimes = [...busData.busCitiesAndTimes];
        updatedCitiesAndTimes[index] = {
            ...updatedCitiesAndTimes[index],
            [field]: value,
        };

        setBusData({
            ...busData,
            busCitiesAndTimes: updatedCitiesAndTimes,
        });
    };

    // Add new city and time
    const addCityAndTime = () => {
        setBusData({
            ...busData,
            busCitiesAndTimes: [...busData.busCitiesAndTimes, { cityName: "", arrivalTime: "" }],
        });
    };

    // Remove city and time
    const removeCityAndTime = (index) => {
        const updatedCitiesAndTimes = [...busData.busCitiesAndTimes];
        updatedCitiesAndTimes.splice(index, 1);

        setBusData({
            ...busData,
            busCitiesAndTimes: updatedCitiesAndTimes,
        });
    };

    // Handle seat change
    const handleSeatChange = (index, field, value) => {
        const updatedSeats = [...busData.seats];
        updatedSeats[index] = {
            ...updatedSeats[index],
            [field]: value,
        };

        setBusData({
            ...busData,
            seats: updatedSeats,
        });
    };

    // Add new seat
    const addSeat = () => {
        setBusData({
            ...busData,
            seats: [...busData.seats, { seatNumber: "", availability: "available" }],
        });
    };

    // Remove seat
    const removeSeat = (index) => {
        const updatedSeats = [...busData.seats];
        updatedSeats.splice(index, 1);

        setBusData({
            ...busData,
            seats: updatedSeats,
        });
    };

    // Handle departure date change
    const handleDateChange = (e) => {
        setBusData({
            ...busData,
            busDepartureDate: new Date(e.target.value),
        });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setUpdateSuccess(false);

        try {
            // Validate before submitting
            if (busData.busCitiesAndTimes.some((item) => !item.cityName || !item.arrivalTime)) {
                alert("All cities and arrival times must be filled");
                setSubmitting(false);
                return;
            }

            if (busData.seats.some((seat) => !seat.seatNumber)) {
                alert("All seat numbers must be filled");
                setSubmitting(false);
                return;
            }

            // Format the data for API
            const formattedData = {
                ...busData,
                busTicketPrice: Number(busData.busTicketPrice),
                recommends: Number(busData.recommends),
            };

            console.log("Sending update request for bus ID:", id);
            await axios.put(`http://localhost:8000/api/buses/${id}`, formattedData);
            setUpdateSuccess(true);

            // Show success alert
            alert("Bus updated successfully!");

            // Navigate back to the bus list after successful update
            navigate("/update-bus");
        } catch (error) {
            alert("Failed to update bus. " + (error.response?.data?.message || error.message));
            console.error("Error updating bus:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Format date for date input
    const formattedDateForInput = busData.busDepartureDate ? busData.busDepartureDate.toISOString().split("T")[0] : "";

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-2">Loading bus data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div
                    className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                    role="alert"
                >
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
                <div className="mt-4">
                    <button
                        onClick={() => navigate("/update-bus")}
                        className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                    >
                        Back to Bus List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-6 text-3xl font-bold">Edit Bus: {busData.busName}</h1>

            {updateSuccess && (
                <div
                    className="relative mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
                    role="alert"
                >
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> Bus information has been updated.</span>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-8"
            >
                {/* Basic Information */}
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 border-b pb-2 text-xl font-bold">Basic Information</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="busName"
                                className="block text-sm font-medium"
                            >
                                Bus Name
                            </label>
                            <input
                                id="busName"
                                name="busName"
                                className="w-full rounded-md border p-2"
                                value={busData.busName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="busPlateNo"
                                className="block text-sm font-medium"
                            >
                                Bus Plate Number
                            </label>
                            <input
                                id="busPlateNo"
                                name="busPlateNo"
                                className="w-full rounded-md border p-2"
                                value={busData.busPlateNo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="busType"
                                className="block text-sm font-medium"
                            >
                                Bus Type
                            </label>
                            <select
                                id="busType"
                                name="busType"
                                className="w-full rounded-md border p-2"
                                value={busData.busType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select bus type</option>
                                {busTypes.map((type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="busOwnership"
                                className="block text-sm font-medium"
                            >
                                Bus Ownership
                            </label>
                            <select
                                id="busOwnership"
                                name="busOwnership"
                                className="w-full rounded-md border p-2"
                                value={busData.busOwnership}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select ownership</option>
                                {ownershipTypes.map((type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="busTicketPrice"
                                className="block text-sm font-medium"
                            >
                                Ticket Price (LKR)
                            </label>
                            <input
                                id="busTicketPrice"
                                name="busTicketPrice"
                                type="number"
                                className="w-full rounded-md border p-2"
                                value={busData.busTicketPrice}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>

                        

                        <div className="space-y-2">
                            <label
                                htmlFor="busDepartureDate"
                                className="block text-sm font-medium"
                            >
                                Departure Date
                            </label>
                            <input
                                id="busDepartureDate"
                                name="busDepartureDate"
                                type="date"
                                className="w-full rounded-md border p-2"
                                value={formattedDateForInput}
                                onChange={handleDateChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 border-b pb-2 text-xl font-bold">Amenities</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {amenitiesOptions.map((amenity) => (
                            <div
                                key={amenity}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="checkbox"
                                    id={`amenity-${amenity}`}
                                    checked={busData.busAmenities.includes(amenity)}
                                    onChange={() => handleAmenityChange(amenity)}
                                    className="h-4 w-4"
                                />
                                <label
                                    htmlFor={`amenity-${amenity}`}
                                    className="text-sm"
                                >
                                    {amenity}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message for Passengers */}
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 border-b pb-2 text-xl font-bold">Message for Passengers</h2>
                    <textarea
                        id="passengersMessage"
                        name="passengersMessage"
                        className="w-full resize-none rounded-md border p-2"
                        value={busData.passengersMessage || ""}
                        onChange={handleInputChange}
                        placeholder="Enter message for passengers (optional)"
                        rows={4}
                        maxLength="5000"
                    />
                    <p className="mt-1 text-sm text-gray-500">{busData.passengersMessage?.length || 0}/5000 characters</p>
                </div>

                {/* Cities and Arrival Times */}
<div className="rounded-lg bg-white p-6 shadow-md">
    <div className="mb-6 flex items-center justify-between border-b pb-3">
        <h2 className="text-xl font-bold text-gray-800">Cities & Arrival Times</h2>
        <button
            type="button"
            className="flex items-center rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
            onClick={addCityAndTime}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add City
        </button>
    </div>
    
    <div className="space-y-5">
        {busData.busCitiesAndTimes.map((city, index) => (
            <div
                key={index}
                className="group relative rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
                draggable="true"
                onDragStart={(e) => e.dataTransfer.setData("cityIndex", index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const dragIndex = parseInt(e.dataTransfer.getData("cityIndex"));
                    if (dragIndex !== index) {
                        const newCitiesAndTimes = [...busData.busCitiesAndTimes];
                        const draggedCity = newCitiesAndTimes[dragIndex];
                        newCitiesAndTimes.splice(dragIndex, 1);
                        newCitiesAndTimes.splice(index, 0, draggedCity);
                        setBusData({...busData, busCitiesAndTimes: newCitiesAndTimes});
                    }
                }}
            >
                <div className="flex w-full cursor-move items-center justify-between mb-2">
                    <div className="flex items-center">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 mr-2">
                            {index === 0 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            ) : index === busData.busCitiesAndTimes.length - 1 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2a2 2 0 012 2v4a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-9a1 1 0 00-1-1h-8a1 1 0 00-1 1v5H4a1 1 0 01-1-1V5a1 1 0 00-1-1H3z" />
                                </svg>
                            )}
                        </div>
                        <span className="font-medium text-gray-700">Stop {index + 1}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">City Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                className="w-full rounded-md border border-gray-200 p-2.5 pl-10 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                value={city.cityName}
                                onChange={(e) => handleCityTimeChange(index, "cityName", e.target.value)}
                                placeholder="Enter city name"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                className="w-full rounded-md border border-gray-200 p-2.5 pl-10 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                value={city.arrivalTime}
                                onChange={(e) => handleCityTimeChange(index, "arrivalTime", e.target.value)}
                                placeholder="HH:MM"
                                required
                                pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                                title="Time format: HH:MM (24-hour)"
                            />
                        </div>
                    </div>
                </div>
                
                <button
                    type="button"
                    className={`absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-opacity hover:bg-red-600 ${
                        busData.busCitiesAndTimes.length <= 1 ? "cursor-not-allowed opacity-50" : "opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={() => removeCityAndTime(index)}
                    disabled={busData.busCitiesAndTimes.length <= 1}
                >
                    ✕
                </button>
            </div>
        ))}
    </div>
    
    <div className="mt-6 bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
        <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Drag and drop cities to reorder the bus route
        </div>
    </div>
    
    <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">{busData.busCitiesAndTimes.length}</span> cities added
            <span className="text-xs text-gray-400"> (maximum 50)</span>
        </p>
        
        {busData.busCitiesAndTimes.length > 0 && (
            <div className="flex items-center text-sm text-blue-600 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Route summary</span>
            </div>
        )}
    </div>
</div>

                {/* Seat Layout Section */}
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-4 flex items-center justify-between border-b pb-2">
                        <h2 className="text-xl font-bold">Seat Layout</h2>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className="flex items-center rounded-md border border-green-500 px-3 py-1 text-sm text-green-500 hover:bg-green-50"
                                onClick={() => {
                                    // Generate seats in A1-A19, B1-B18 pattern
                                    const seats = [];
                                    for (let i = 1; i <= 18; i += 2) {
                                        seats.push({ seatNumber: `A${i}`, availability: "available" });
                                    }
                                    for (let i = 2; i <= 18; i += 2) {
                                        seats.push({ seatNumber: `A${i}`, availability: "available" });
                                    }
                                    seats.push({ seatNumber: "A19", availability: "available" });
                                    for (let i = 1; i <= 17; i += 2) {
                                        seats.push({ seatNumber: `B${i}`, availability: "available" });
                                    }
                                    for (let i = 2; i <= 18; i += 2) {
                                        seats.push({ seatNumber: `B${i}`, availability: "available" });
                                    }
                                    setBusData({ ...busData, seats });
                                }}
                            >
                                <span className="mr-1">🔄</span> Auto-Generate Seats
                            </button>
                            <button
                                type="button"
                                className="flex items-center rounded-md border border-blue-500 px-3 py-1 text-sm text-blue-500 hover:bg-blue-50"
                                onClick={addSeat}
                            >
                                <span className="mr-1">+</span> Add Seat
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
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
                    
                    {/* Seat Layout */}
                    {busData.seats && busData.seats.length > 0 ? (
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            {/* Bus front with driver position */}
                            <div className="mb-6 flex justify-center border-b pb-4">
                                <div className="flex translate-x-28 items-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 shadow-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-red-600"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                                        </svg>
                                    </div>
                                    <div className="ml-2 text-sm font-medium text-gray-700">Driver</div>
                                </div>
                            </div>

                            {/* Vertical seat layout */}
                            <div className="flex justify-center">
                                <div className="flex space-x-6">
                                    {/* Right column (even B seats: B2, B4, B6, etc.) */}
                                    <div className="flex flex-col space-y-4">
                                        {Array.from({ length: 9 }, (_, i) => {
                                            const seatIndex = busData.seats.findIndex((s) => s.seatNumber === `B${i * 2 + 2}`);
                                            return (
                                                <div
                                                    key={`right2-${i}`}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div
                                                        className={`flex h-10 w-12 items-center justify-center rounded-t-lg border-2 ${
                                                            seatIndex >= 0
                                                                ? busData.seats[seatIndex].availability === "available"
                                                                    ? "border-green-500 bg-green-100 text-green-700"
                                                                    : busData.seats[seatIndex].availability === "booked"
                                                                      ? "border-red-500 bg-red-100 text-red-700"
                                                                      : "border-gray-500 bg-gray-300 text-gray-700"
                                                                : "border-gray-200 bg-white text-gray-400"
                                                        }`}
                                                        onClick={() => {
                                                            if (seatIndex >= 0) {
                                                                // Open a modal or dropdown to edit this seat
                                                                const newAvailability =
                                                                    busData.seats[seatIndex].availability === "available"
                                                                        ? "booked"
                                                                        : busData.seats[seatIndex].availability === "booked"
                                                                          ? "maintenance"
                                                                          : "available";

                                                                const newSeats = [...busData.seats];
                                                                newSeats[seatIndex] = {
                                                                    ...newSeats[seatIndex],
                                                                    availability: newAvailability,
                                                                };
                                                                setBusData({ ...busData, seats: newSeats });
                                                            } else {
                                                                // Add this seat
                                                                setBusData({
                                                                    ...busData,
                                                                    seats: [
                                                                        ...busData.seats,
                                                                        { seatNumber: `B${i * 2 + 2}`, availability: "available" },
                                                                    ],
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        B{i * 2 + 2}
                                                    </div>
                                                    <div className="h-1 w-4 bg-gray-300"></div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Right column (odd B seats: B1, B3, B5, etc.) */}
                                    <div className="flex flex-col space-y-4">
                                        {Array.from({ length: 9 }, (_, i) => {
                                            const seatIndex = busData.seats.findIndex((s) => s.seatNumber === `B${i * 2 + 1}`);
                                            return (
                                                <div
                                                    key={`right1-${i}`}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div
                                                        className={`flex h-10 w-12 items-center justify-center rounded-t-lg border-2 ${
                                                            seatIndex >= 0
                                                                ? busData.seats[seatIndex].availability === "available"
                                                                    ? "border-green-500 bg-green-100 text-green-700"
                                                                    : busData.seats[seatIndex].availability === "booked"
                                                                      ? "border-red-500 bg-red-100 text-red-700"
                                                                      : "border-gray-500 bg-gray-300 text-gray-700"
                                                                : "border-gray-200 bg-white text-gray-400"
                                                        }`}
                                                        onClick={() => {
                                                            if (seatIndex >= 0) {
                                                                const newAvailability =
                                                                    busData.seats[seatIndex].availability === "available"
                                                                        ? "booked"
                                                                        : busData.seats[seatIndex].availability === "booked"
                                                                          ? "maintenance"
                                                                          : "available";

                                                                const newSeats = [...busData.seats];
                                                                newSeats[seatIndex] = {
                                                                    ...newSeats[seatIndex],
                                                                    availability: newAvailability,
                                                                };
                                                                setBusData({ ...busData, seats: newSeats });
                                                            } else {
                                                                setBusData({
                                                                    ...busData,
                                                                    seats: [
                                                                        ...busData.seats,
                                                                        { seatNumber: `B${i * 2 + 1}`, availability: "available" },
                                                                    ],
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        B{i * 2 + 1}
                                                    </div>
                                                    <div className="h-1 w-4 bg-gray-300"></div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Center aisle - With A19 added as a rear center seat */}
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-full w-6 items-center justify-center border-l-2 border-r-2 border-dashed border-gray-300">
                                            <span className="rotate-90 whitespace-nowrap text-xs text-gray-500">Aisle</span>
                                        </div>

                                        {/* A19 seat at the bottom center */}
                                        {(() => {
                                            const seatIndex = busData.seats.findIndex((s) => s.seatNumber === "A19");
                                            return (
                                                <div
                                                    key="A19"
                                                    className="mt-4 flex flex-col items-center"
                                                >
                                                    <div
                                                        className={`flex h-10 w-12 items-center justify-center rounded-t-lg border-2 ${
                                                            seatIndex >= 0
                                                                ? busData.seats[seatIndex].availability === "available"
                                                                    ? "border-green-500 bg-green-100 text-green-700"
                                                                    : busData.seats[seatIndex].availability === "booked"
                                                                      ? "border-red-500 bg-red-100 text-red-700"
                                                                      : "border-gray-500 bg-gray-300 text-gray-700"
                                                                : "border-gray-200 bg-white text-gray-400"
                                                        }`}
                                                        onClick={() => {
                                                            if (seatIndex >= 0) {
                                                                const newAvailability =
                                                                    busData.seats[seatIndex].availability === "available"
                                                                        ? "booked"
                                                                        : busData.seats[seatIndex].availability === "booked"
                                                                          ? "maintenance"
                                                                          : "available";

                                                                const newSeats = [...busData.seats];
                                                                newSeats[seatIndex] = {
                                                                    ...newSeats[seatIndex],
                                                                    availability: newAvailability,
                                                                };
                                                                setBusData({ ...busData, seats: newSeats });
                                                            } else {
                                                                setBusData({
                                                                    ...busData,
                                                                    seats: [...busData.seats, { seatNumber: "A19", availability: "available" }],
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        A19
                                                    </div>
                                                    <div className="h-1 w-4 bg-gray-300"></div>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Left column (even A seats: A2, A4, A6, etc.) */}
                                    <div className="flex flex-col space-y-4">
                                        {Array.from({ length: 9 }, (_, i) => {
                                            const seatIndex = busData.seats.findIndex((s) => s.seatNumber === `A${i * 2 + 2}`);
                                            return (
                                                <div
                                                    key={`left2-${i}`}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div
                                                        className={`flex h-10 w-12 items-center justify-center rounded-t-lg border-2 ${
                                                            seatIndex >= 0
                                                                ? busData.seats[seatIndex].availability === "available"
                                                                    ? "border-green-500 bg-green-100 text-green-700"
                                                                    : busData.seats[seatIndex].availability === "booked"
                                                                      ? "border-red-500 bg-red-100 text-red-700"
                                                                      : "border-gray-500 bg-gray-300 text-gray-700"
                                                                : "border-gray-200 bg-white text-gray-400"
                                                        }`}
                                                        onClick={() => {
                                                            if (seatIndex >= 0) {
                                                                const newAvailability =
                                                                    busData.seats[seatIndex].availability === "available"
                                                                        ? "booked"
                                                                        : busData.seats[seatIndex].availability === "booked"
                                                                          ? "maintenance"
                                                                          : "available";

                                                                const newSeats = [...busData.seats];
                                                                newSeats[seatIndex] = {
                                                                    ...newSeats[seatIndex],
                                                                    availability: newAvailability,
                                                                };
                                                                setBusData({ ...busData, seats: newSeats });
                                                            } else {
                                                                setBusData({
                                                                    ...busData,
                                                                    seats: [
                                                                        ...busData.seats,
                                                                        { seatNumber: `A${i * 2 + 2}`, availability: "available" },
                                                                    ],
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        A{i * 2 + 2}
                                                    </div>
                                                    <div className="h-1 w-4 bg-gray-300"></div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Left column (odd A seats: A1, A3, A5, etc.) */}
                                    <div className="flex flex-col space-y-4">
                                        {Array.from({ length: 9 }, (_, i) => {
                                            const seatIndex = busData.seats.findIndex((s) => s.seatNumber === `A${i * 2 + 1}`);
                                            return (
                                                <div
                                                    key={`left1-${i}`}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div
                                                        className={`flex h-10 w-12 items-center justify-center rounded-t-lg border-2 ${
                                                            seatIndex >= 0
                                                                ? busData.seats[seatIndex].availability === "available"
                                                                    ? "border-green-500 bg-green-100 text-green-700"
                                                                    : busData.seats[seatIndex].availability === "booked"
                                                                      ? "border-red-500 bg-red-100 text-red-700"
                                                                      : "border-gray-500 bg-gray-300 text-gray-700"
                                                                : "border-gray-200 bg-white text-gray-400"
                                                        }`}
                                                        onClick={() => {
                                                            if (seatIndex >= 0) {
                                                                const newAvailability =
                                                                    busData.seats[seatIndex].availability === "available"
                                                                        ? "booked"
                                                                        : busData.seats[seatIndex].availability === "booked"
                                                                          ? "maintenance"
                                                                          : "available";

                                                                const newSeats = [...busData.seats];
                                                                newSeats[seatIndex] = {
                                                                    ...newSeats[seatIndex],
                                                                    availability: newAvailability,
                                                                };
                                                                setBusData({ ...busData, seats: newSeats });
                                                            } else {
                                                                setBusData({
                                                                    ...busData,
                                                                    seats: [
                                                                        ...busData.seats,
                                                                        { seatNumber: `A${i * 2 + 1}`, availability: "available" },
                                                                    ],
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        A{i * 2 + 1}
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
                        <div className="rounded-lg border border-dashed py-10 text-center text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mx-auto mb-2 h-12 w-12 text-gray-400"
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
                            <p>No seat configuration yet.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    // Generate standard 37 seat layout
                                    const seats = [];
                                    for (let i = 1; i <= 18; i += 2) seats.push({ seatNumber: `A${i}`, availability: "available" });
                                    for (let i = 2; i <= 18; i += 2) seats.push({ seatNumber: `A${i}`, availability: "available" });
                                    seats.push({ seatNumber: "A19", availability: "available" });
                                    for (let i = 1; i <= 17; i += 2) seats.push({ seatNumber: `B${i}`, availability: "available" });
                                    for (let i = 2; i <= 18; i += 2) seats.push({ seatNumber: `B${i}`, availability: "available" });
                                    setBusData({ ...busData, seats });
                                }}
                                className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            >
                                Generate Standard 37-Seat Layout
                            </button>
                        </div>
                    )}

                    {busData.seats && busData.seats.length > 0 && (
                        <div className="mt-4 rounded-md border border-gray-100 bg-white p-3 shadow-sm">
                            <div className="flex justify-around text-sm">
                                <div>
                                    <span className="font-medium">Available: </span>
                                    <span className="font-bold text-green-600">
                                        {busData.seats.filter((seat) => seat.availability === "available").length}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium">Booked: </span>
                                    <span className="font-bold text-red-600">
                                        {busData.seats.filter((seat) => seat.availability === "booked").length}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium">Maintenance: </span>
                                    <span className="font-bold text-gray-600">
                                        {busData.seats.filter((seat) => seat.availability === "maintenance").length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {busData.seats && busData.seats.length > 0 && (
                        <div className="mt-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap justify-around gap-3">
                                <div className="flex items-center rounded-lg border border-green-200 px-4 py-2">
                                    <div className="mr-2 h-4 w-4 rounded-sm bg-green-500"></div>
                                    <div>
                                        <span className="text-xs text-gray-500">Available</span>
                                        <div className="text-lg font-bold text-green-600">
                                            {busData.seats.filter((seat) => seat.availability === "available").length}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center rounded-lg border border-red-200 px-4 py-2">
                                    <div className="mr-2 h-4 w-4 rounded-sm bg-red-500"></div>
                                    <div>
                                        <span className="text-xs text-gray-500">Booked</span>
                                        <div className="text-lg font-bold text-red-600">
                                            {busData.seats.filter((seat) => seat.availability === "booked").length}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center rounded-lg border border-gray-200 px-4 py-2">
                                    <div className="mr-2 h-4 w-4 rounded-sm bg-gray-700"></div>
                                    <div>
                                        <span className="text-xs text-gray-500">Maintenance</span>
                                        <div className="text-lg font-bold text-gray-600">
                                            {busData.seats.filter((seat) => seat.availability === "maintenance").length}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center rounded-lg border border-blue-200 px-4 py-2">
                                    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-sm bg-blue-50 font-bold text-blue-500">
                                        Σ
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">Total Seats</span>
                                        <div className="text-lg font-bold text-blue-600">{busData.seats.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                    <button
                        type="button"
                        className="rounded-md bg-red-600 px-6 py-2 text-white hover:bg-red-700"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this bus?")) {
                                // Add your delete logic here
                                console.log("Delete bus with ID:", id);
                                // Example: axios.delete(`http://localhost:8000/api/buses/${id}`);
                                // Then navigate after successful deletion
                                // navigate('/update-bus');
                            }
                        }}
                    >
                        Delete Bus
                    </button>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 px-6 py-2 hover:bg-gray-50"
                            onClick={() => navigate("/update-bus")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`min-w-[120px] rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 ${submitting ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                            {submitting ? (
                                <>
                                    <span className="mr-2 inline-block animate-spin">↻</span>
                                    Updating...
                                </>
                            ) : (
                                "Update Bus"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditBus;
