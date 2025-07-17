import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSelector = ({ users, onUserAdded, onPointsClaimed, refreshRankings }) => {
    // State for managing modal visibility
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showGivePointsModal, setShowGivePointsModal] = useState(false);

    // States for messages within the main component (optional, modals handle their own)
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const AddUserModal = ({ onClose, onUserAdded }) => {
        const [newUserName, setNewUserName] = useState('');
        const [selectedAvatar, setSelectedAvatar] = useState(null); 
        const [avatarPreview, setAvatarPreview] = useState(null); 
        const [modalMessage, setModalMessage] = useState('');
        const [modalError, setModalError] = useState('');
        const [isAddingUser, setIsAddingUser] = useState(false); 

        useEffect(() => {
            if (modalMessage || modalError) {
                const timer = setTimeout(() => {
                    setModalMessage('');
                    setModalError('');
                }, 3000);
                return () => clearTimeout(timer);
            }
        }, [modalMessage, modalError]);

        useEffect(() => {
            if (selectedAvatar) {
                const objectUrl = URL.createObjectURL(selectedAvatar);
                setAvatarPreview(objectUrl);
                return () => URL.revokeObjectURL(objectUrl);
            } else {
                setAvatarPreview(null);
            }
        }, [selectedAvatar]);


        const handleFileChange = (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                // Basic validation (optional)
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    setModalError('File size too large (max 5MB).');
                    setSelectedAvatar(null);
                    return;
                }
                if (!file.type.startsWith('image/')) {
                    setModalError('Please upload an image file.');
                    setSelectedAvatar(null);
                    return;
                }
                setSelectedAvatar(file);
                setModalError(''); // Clear previous error
            } else {
                setSelectedAvatar(null);
                setAvatarPreview(null);
            }
        };


        const handleAddUserSubmit = async () => {
            setModalError('');
            setModalMessage('');
            if (!newUserName.trim()) {
                setModalError('User name cannot be empty.');
                return;
            }

            setIsAddingUser(true); // Set loading state

            try {
                const userResponse = await axios.post('http://localhost:5000/api/users', { name: newUserName.trim() });
                const newUser = userResponse.data;

                let avatarUploaded = false;
                if (selectedAvatar) {
                    const formData = new FormData();
                    formData.append('avatar', selectedAvatar);

                    try {
                        await axios.post(`http://localhost:5000/api/users/${newUser._id}/avatar`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        avatarUploaded = true;
                    } catch (avatarUploadErr) {
                        console.error('Error uploading avatar:', avatarUploadErr);
                        setModalError(avatarUploadErr.response?.data?.msg || 'Failed to upload avatar. User added.');
                    }
                }

                setModalMessage(`User '${newUser.name}' added successfully! ${avatarUploaded ? 'Avatar uploaded!' : ''} 🎉`);
                setNewUserName('');
                setSelectedAvatar(null); 
                setAvatarPreview(null); 
                onUserAdded();
                setTimeout(onClose, 1500); 

            } catch (err) {
                console.error('Error adding user:', err);
                setModalError(err.response?.data?.msg || 'Failed to add user. Try again');
            } finally {
                setIsAddingUser(false); 
            }
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Add New User</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="Enter new user name"
                            disabled={isAddingUser}
                        />
                    </div>
                    <div className="form-group avatar-upload-group"> {/* Added a class for styling */}
                        <label htmlFor="avatar-upload-input" className="avatar-upload-label">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar Preview" className="avatar-preview-thumbnail" />
                            ) : (
                                <span className="placeholder-text">Choose Avatar</span>
                            )}
                            <input
                                id="avatar-upload-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isAddingUser}
                            />
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button onClick={handleAddUserSubmit} disabled={isAddingUser}>
                            {isAddingUser ? 'Adding...' : 'Add User'}
                        </button>
                        <button className="cancel-button" onClick={onClose} disabled={isAddingUser}>
                            Cancel
                        </button>
                    </div>
                    {modalMessage && <div className="message">{modalMessage}</div>}
                    {modalError && <div className="message error">{modalError}</div>}
                </div>
            </div>
        );
    };
    const GivePointsModal = ({ users, onClose, onPointsClaimed, refreshRankings }) => {
        const [claiming, setClaiming] = useState(false);
        const [modalMessage, setModalMessage] = useState('');
        const [modalError, setModalError] = useState('');

        useEffect(() => {
            if (modalMessage || modalError) {
                const timer = setTimeout(() => {
                    setModalMessage('');
                    setModalError('');
                }, 3000);
                return () => clearTimeout(timer);
            }
        }, [modalMessage, modalError]);

        const handleClaimPointsClick = async (userId, userName) => {
            setModalError('');
            setModalMessage('');
            setClaiming(true);
            try {
                const response = await axios.post(`http://localhost:5000/api/claim-points/${userId}`);
                setModalMessage(`Awarded ${response.data.pointsAwarded} points to ${userName}! 🎉`);
                onPointsClaimed(response.data.user);
                refreshRankings(); 
                setTimeout(onClose, 3000); 
            } catch (err) {
                console.error('Error claiming points:', err);
                setModalError(err.response?.data?.msg || 'Could not claim points 👻');
            } finally {
                setClaiming(false);
            }
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Give Points to a User</h3>
                    <div className="user-list-for-points">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <div key={user._id} className="user-item-for-points" onClick={() => handleClaimPointsClick(user._id, user.name)}>
                                    
                                    <span className="user-name-and-avatar">
                                        <img
                                            src={user.avatar} 
                                            alt={user.name}
                                            className="user-avatar-list-small"
                                        />
                                        {user.name}
                                    </span>
                                    <span className="current-points">({user.totalPoints} points)</span>
                                    {claiming && <span className="claiming-spinner"></span>}
                                </div>
                            ))
                        ) : (
                            <p>No users available to give points. Add some first!</p>
                        )}
                    </div>
                    <div className="modal-actions">
                        <button className="cancel-button" onClick={onClose}>Close</button>
                    </div>
                    {modalMessage && <div className="message">{modalMessage}</div>}
                    {modalError && <div className="message error">{modalError}</div>}
                    {claiming && <div className="message">Processing points...</div>}
                </div>
            </div>
        );
    };

    return (
        <div className="user-management-buttons">
            <button onClick={() => setShowAddUserModal(true)}>Add User</button>
            <button onClick={() => setShowGivePointsModal(true)} disabled={users.length === 0}>Give Points</button>

            {showAddUserModal && (
                <AddUserModal
                    onClose={() => setShowAddUserModal(false)}
                    onUserAdded={onUserAdded}
                />
            )}
            {showGivePointsModal && (
                <GivePointsModal
                    users={users}
                    onClose={() => setShowGivePointsModal(false)}
                    onPointsClaimed={onPointsClaimed}
                    refreshRankings={refreshRankings}
                />
            )}

            {message && <div className="message">{message}</div>}
            {error && <div className="message error">{error}</div>}
        </div>
    );
};

export default UserSelector;