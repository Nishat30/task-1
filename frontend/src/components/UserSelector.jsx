// This component handles two things:
// 1. Adding new users 👤
// 2. Claiming random points for a selected user 

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSelector = ({ users, onUserAdded, onPointsClaimed, refreshRankings }) => {
    // All the internal states we need
    const [selectedUserId, setSelectedUserId] = useState(''); // Who's getting points?
    const [newUserName, setNewUserName] = useState(''); // Name of the new user to add
    const [message, setMessage] = useState(''); // Success messages 🟢
    const [error, setError] = useState(''); // Error messages 🔴
    const [claiming, setClaiming] = useState(false); // Button loading state

    // Automatically clear success/error messages after 3 seconds ⏳
    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    // API call to add a new user
    const handleAddUser = async () => {
        setError('');
        setMessage('');
        if (!newUserName.trim()) {
            setError('User name cannot be empty. 😑');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/users', { name: newUserName });
            setMessage(`User '${response.data.name}' added successfully! 🎉`);
            setNewUserName('');
            onUserAdded(); // Trigger refresh in parent
        } catch (err) {
            console.error('Error adding user:', err);
            setError(err.response?.data?.msg || 'Failed to add user. Try again 🧯');
        }
    };

    // API call to give random points to the selected user
    const handleClaimPoints = async () => {
        setError('');
        setMessage('');
        if (!selectedUserId) {
            setError('Please select a user first. 🫠');
            return;
        }

        setClaiming(true); // Start loading
        try {
            const response = await axios.post(`http://localhost:5000/api/claim-points/${selectedUserId}`);
            setMessage(response.data.message); // e.g., "50 points awarded!"
            onPointsClaimed(response.data.user); // Update parent
            refreshRankings(); // Re-fetch leaderboard
        } catch (err) {
            console.error('Error claiming points:', err);
            setError(err.response?.data?.msg || 'Could not claim points 🛑');
        } finally {
            setClaiming(false); // Stop loading
        }
    };

    return (
        <div className="user-section">
            <h2>Manage Users & Claim Points</h2>

            {/* Input section to add a new user */}
            <div className="form-group">
                <label htmlFor="newUser">Add New User:</label>
                <input
                    type="text"
                    id="newUser"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter new user name"
                />
                <button onClick={handleAddUser}>Add User</button>
            </div>

            {/* Dropdown to select user and claim points */}
            <div className="form-group">
                <label htmlFor="selectUser">Select User:</label>
                <select
                    id="selectUser"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="">-- Select a user --</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name} ({user.totalPoints} points)
                        </option>
                    ))}
                </select>
                <button onClick={handleClaimPoints} disabled={!selectedUserId || claiming}>
                    {claiming ? 'Claiming...' : 'Claim Random Points'}
                </button>
            </div>

            {/* Messages shown to user */}
            {message && <div className="message">{message}</div>}
            {error && <div className="message error">{error}</div>}
        </div>
    );
};

export default UserSelector;