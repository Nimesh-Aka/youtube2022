import React, { useState } from 'react';
import { Footer } from "@/layouts/footer";
import axios from 'axios'

const allSeats = [
  ...[...Array(9).keys()].map(i => `A${i * 2 + 1}`),  // A1, A3, A5, ..., A17
  ...[...Array(9).keys()].map(i => `A${(i + 1) * 2}`), // A2, A4, A6, ..., A18
  "A19",
  ...[...Array(9).keys()].map(i => `B${i * 2 + 1}`),  // B1, B3, B5, ..., B17
  ...[...Array(9).keys()].map(i => `B${(i + 1) * 2}`) // B2, B4, B6, ..., B18
];

const initialSeats = allSeats.map(seat => ({
  seatNumber: seat,
  availability: 'available'
}));

const Addbus = () => {
  const [formData, setFormData] = useState({
    busName: '',
    busPlateNo: '',
    busAmenities: [],
    busOwnership: '',
    busType: '',
    busCitiesAndTimes: [{ cityName: '', arrivalTime: '' }],
    busTicketPrice: '',
    busDepartureDate: '',
    seats: initialSeats
  });

  const [selectedSeatNumber, setSelectedSeatNumber] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('maintenance');
  const [errors, setErrors] = useState({});

  const addPredefinedSeat = () => {
    if (!selectedSeatNumber) return;

    setFormData(prevFormData => {
      const updatedSeats = prevFormData.seats.map(seat =>
        seat.seatNumber === selectedSeatNumber
          ? { ...seat, availability: selectedStatus }
          : seat
      );
      return { ...prevFormData, seats: updatedSeats };
    });

    setSelectedSeatNumber('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const isoDate = new Date(formData.busDepartureDate).toISOString();
        const submissionData = {
          ...formData,
          busDepartureDate: isoDate
        };

        /*const response = await fetch('/api/buses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData)
        });*/

        const response = await axios.post('http://localhost:8000/api/buses', submissionData)

        console.log("formData : ", formData);
        console.log("submissionData : ", submissionData);
        console.log("response", response);
        console.log("response.ok", response.ok)

        if (response.statusText) {
          alert('Bus added successfully!');
          setFormData({
            busName: '',
            busPlateNo: '',
            busAmenities: [],
            busOwnership: '',
            busType: '',
            busCitiesAndTimes: [{ cityName: '', arrivalTime: '' }],
            busTicketPrice: '',
            busDepartureDate: '',
            seats: initialSeats
          });
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to add bus');
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.busName.trim()) errors.busName = 'Bus name is required';
    if (!formData.busPlateNo.trim()) errors.busPlateNo = 'License plate is required';
    if (!formData.busTicketPrice) errors.busTicketPrice = 'Ticket price is required';
    if (!formData.busDepartureDate) errors.busDepartureDate = 'Departure date is required';
    if (!formData.busOwnership) errors.busOwnership = 'Ownership is required';
    if (!formData.busType) errors.busType = 'Bus type is required';
    return errors;
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const updatedArray = formData[arrayName].map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, [arrayName]: updatedArray });
  };

  const addArrayItem = (arrayName, template) => {
    if (formData[arrayName].length < 50) {
      setFormData({
        ...formData,
        [arrayName]: [...formData[arrayName], template]
      });
    }
  };

  const removeArrayItem = (arrayName, index) => {
    const filteredArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: filteredArray });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Add New Bus</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block mb-2">Bus Name *</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.busName}
                  onChange={(e) => setFormData({ ...formData, busName: e.target.value })}
                />
                {errors.busName && <span className="text-red-500 text-sm">{errors.busName}</span>}
              </div>

              <div className="form-group">
                <label className="block mb-2">License Plate *</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.busPlateNo}
                  onChange={(e) => setFormData({ ...formData, busPlateNo: e.target.value })}
                />
                {errors.busPlateNo && <span className="text-red-500 text-sm">{errors.busPlateNo}</span>}
              </div>
            </div>
          </div>

          {/* Price and Departure Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Price & Departure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Ticket Price (Rs.) *</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.01"
                  value={formData.busTicketPrice}
                  onChange={(e) => setFormData({ ...formData, busTicketPrice: e.target.value })}
                />
                {errors.busTicketPrice && <span className="text-red-500 text-sm">{errors.busTicketPrice}</span>}
              </div>
              <div>
                <label className="block mb-2">Departure Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded"
                  value={formData.busDepartureDate}
                  onChange={(e) => setFormData({ ...formData, busDepartureDate: e.target.value })}
                />
                {errors.busDepartureDate && <span className="text-red-500 text-sm">{errors.busDepartureDate}</span>}
              </div>
            </div>
          </div>

          {/* Ownership Field */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Bus Ownership</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2 w-4 h-4 accent-red-500"
                  name="ownership"
                  value="CTB"
                  checked={formData.busOwnership === 'CTB'}
                  onChange={(e) => setFormData({ ...formData, busOwnership: e.target.value })}
                />
                CTB
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2 w-4 h-4 accent-red-500"
                  name="ownership"
                  value="Private"
                  checked={formData.busOwnership === 'Private'}
                  onChange={(e) => setFormData({ ...formData, busOwnership: e.target.value })}
                />
                Private
              </label>
            </div>
            {errors.busOwnership && (
              <span className="text-red-500 text-sm mt-2 block">{errors.busOwnership}</span>
            )}
          </div>

          {/* Bus Type Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Bus Type </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['AC Delux', 'Tourist AC Delux', 'Air Suspension', 'Semi Luxury'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2 w-4 h-4 accent-red-500"
                    name="busType"
                    value={type}
                    checked={formData.busType === type}
                    onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                  />
                  {type}
                </label>
              ))}
            </div>
            {errors.busType && <span className="text-red-500 text-sm mt-2 block">{errors.busType}</span>}
          </div>

          {/* Amenities Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Internet/Wifi', 'AC', 'Charging Ports', 'Fan'].map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.busAmenities.includes(amenity)}
                    onChange={(e) => {
                      const amenities = e.target.checked
                        ? [...formData.busAmenities, amenity]
                        : formData.busAmenities.filter(item => item !== amenity);
                      setFormData({ ...formData, busAmenities: amenities });
                    }}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* Route Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Route Information</h3>
            {formData.busCitiesAndTimes.map((city, index) => (
              <div key={index} className="border p-4 mb-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">City Name *</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={city.cityName}
                      onChange={(e) => handleArrayChange('busCitiesAndTimes', index, 'cityName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Arrival Time *</label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                      value={city.arrivalTime}
                      onChange={(e) => handleArrayChange('busCitiesAndTimes', index, 'arrivalTime', e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-2 text-red-500 text-sm"
                  onClick={() => removeArrayItem('busCitiesAndTimes', index)}
                >
                  Remove City
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => addArrayItem('busCitiesAndTimes', { cityName: '', arrivalTime: '' })}
              disabled={formData.busCitiesAndTimes.length >= 50}
            >
              Add City
            </button>
          </div>

          {/* Seat Configuration Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Seat Configuration</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                className="p-2 border rounded"
                value={selectedSeatNumber}
                onChange={(e) => setSelectedSeatNumber(e.target.value)}
              >
                <option value="">Select Seat Number</option>
                {allSeats.map(seat => (
                  <option
                    key={seat}
                    value={seat}
                  //disabled={formData.seats.find(s => s.seatNumber === seat)?.availability === 'booked'}
                  >
                    {seat}
                  </option>
                ))}
              </select>

              <select
                className="p-2 border rounded"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="maintenance">Maintenance</option>
                <option value="booked">Booked</option>
              </select>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={addPredefinedSeat}
                disabled={!selectedSeatNumber}
              >
                Update Seat
              </button>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {formData.seats
                  .filter(seat => seat.availability === "booked" || seat.availability === "maintenance")
                  .map((seat, index) => (
                    <div key={index} className="border p-3 rounded flex items-center justify-between">
                      <div>
                        <span className="font-medium">{seat.seatNumber}</span>
                        <span className={`ml-2 text-sm ${seat.availability === "booked" ? "text-red-600" : "text-gray-600"}`}>
                          ({seat.availability})
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
          >
            Add Bus
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Addbus;