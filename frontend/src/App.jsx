// frontend/src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import UserSelector from "./components/UserSelector.jsx"; // Add .jsx
import Leaderboard from "./components/Leaderboard.jsx";
import './App.css'; // Styling

function App() {
    // State setup
    const [users, setUsers] = useState([]); // List of users
    const [rankings, setRankings] = useState([]); // Leaderboard data
    const [loading, setLoading] = useState(true); // Loading status
    const [error, setError] = useState(null); // Error handling

    // Fetch users from backend
    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users.');
        }
    }, []);

    // Fetch rankings from backend
    const fetchRankings = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/rankings');
            setRankings(response.data);
        } catch (err) {
            console.error('Error fetching rankings:', err);
            setError('Failed to load rankings.');
        } finally {
            setLoading(false); // Done loading regardless of success/fail
        }
    }, []);

    // Fetch users + rankings when app first loads
    useEffect(() => {
        fetchUsers();
        fetchRankings();
    }, [fetchUsers, fetchRankings]);

    // Called when new user is added
    const handleUserAdded = () => {
        fetchUsers();     // Refresh user list
        fetchRankings();  // Update leaderboard
    };

    // Called when user claims points
    const handlePointsClaimed = (updatedUser) => {
        // Update just the changed user locally
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user._id === updatedUser._id ? updatedUser : user
            )
        );
        fetchRankings(); // Re-calculate leaderboard
    };

    // Show loading or error if needed
    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
    }

    // Main app content: user selection + leaderboard
    return (
        <div className="app-container">
            <h1>Leaderboard Application</h1>
            <Leaderboard rankings={rankings} />
            <UserSelector
                users={users}
                onUserAdded={handleUserAdded}
                onPointsClaimed={handlePointsClaimed}
                refreshRankings={fetchRankings}
            />
        </div>
    );
}

export default App;
