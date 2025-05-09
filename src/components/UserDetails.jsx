import React from "react";
import userprop from "@/assets/userprop.png";
import { Trash } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDetails = ({ user }) => {
    const { userName, email, mobile, isAdmin, _id } = user;

    const navigate = useNavigate();

    const deleteHandler = async () => {     
        try {
            await axios.delete(`http://localhost:8000/api/users/${_id}`);
            navigate("/users"); // Redirect after deletion
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="w-full p-4 mb-4 transition-transform transform bg-white rounded-lg shadow-md hover:scale-105">
            <div className="flex flex-wrap items-center justify-between w-full">
                <img
                    src={userprop}
                    alt="User"
                    className="object-cover w-10 h-10 mr-4 rounded-full"
                />
                <p className="min-w-[150px] flex-1 font-medium text-gray-800">
                    <span className="font-semibold text-red-600"></span> {userName}
                </p>
                <p className="min-w-[150px] flex-1 text-gray-600">
                    <span className="font-semibold text-red-600">Email:</span> {email}
                </p>
                <p className="min-w-[150px] flex-1 text-gray-600">
                    <span className="font-semibold text-red-600">Mobile:</span> {mobile}
                </p>
                <button onClick={deleteHandler} className="text-red-500">
                    <Trash size={20} />
                </button>
                
            </div>
            {isAdmin && (
                <div className="mt-2">
                    <span className="px-3 py-1 text-sm font-medium text-white bg-orange-500 rounded-md">
                        Admin
                    </span>
                </div>
            )}
        </div>
    );
};

export default UserDetails;
