import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import UserSelector from "./components/UserSelector.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import './App.css';

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://task-1-inky-one.vercel.app' 
    : 'http://localhost:5000';

function App() {
    const [users, setUsers] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users from backend
    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users`);
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users.');
        }
    }, []);

    const fetchRankings = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/rankings`);
            setRankings(response.data);
        } catch (err) {
            console.error('Error fetching rankings:', err);
            setError('Failed to load rankings.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchRankings();
    }, [fetchUsers, fetchRankings]);

    const handleUserAdded = () => {
        fetchUsers();
        fetchRankings();
    };

    const handlePointsClaimed = (updatedUser) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user._id === updatedUser._id ? updatedUser : user
            )
        );
        fetchRankings();
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
    }

    return (
        <>
            <div className="app-container">
                <h1>Leaderboard</h1>
                <UserSelector
                    users={users}
                    onUserAdded={handleUserAdded}
                    onPointsClaimed={handlePointsClaimed}
                    refreshRankings={fetchRankings}
                />
                <Leaderboard rankings={rankings} />
            </div>
            <p className="footer">
                © 2025| Made by Nishat Khanam 🤍
            </p>
        </>
    );
}

export default App;