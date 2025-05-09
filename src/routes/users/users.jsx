import React, { useEffect, useState } from "react";
import axios from "axios";
import UserDetails from "../../components/UserDetails";

const URL = "http://localhost:8000/api/users"; // Backend API endpoint

const UsersPage = () => {
    const [users, setUsers] = useState([]); // State for users
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true); // Start loading
                const response = await axios.get(URL); // Fetch users from backend

                console.log("Fetched Users:", response); // Debug log
                console.log("response Users:", response.data); // Debug log
                console.log("frist Users:", response.data[0]); // Debug log
                console.log("frist User name:", response.data[0].userName); // Debug log

                if (response.data) {
                    const usersArray = Array.isArray(response.data) ? response.data : response.data.users;
                    setUsers(usersArray && Array.isArray(usersArray) ? usersArray : []);
                } else {
                    setUsers([]); // Handle unexpected response structure
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div>Loading...</div>; // Display loading indicator
    if (error) return <div>{error}</div>; // Display error message

    return (
        <div>
            <h1 className="title">Users</h1>
            <br />
            
            {/* Total Users Count */}
            <div className="card">
                <div className="card-header">
                    <p className="card-title">Total Users: {users.length}</p>
                </div>
            </div>
            <br />
              
            <div>
                {users.length > 0 ? (
                    users.map((user) => (
                        <UserDetails
                            key={user._id}
                            user={user}
                        /> // Display each user
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default UsersPage;
