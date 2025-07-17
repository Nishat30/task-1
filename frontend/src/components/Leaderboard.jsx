// client/src/components/Leaderboard.jsx
import React from 'react';

// Default avatar fallback
const DEFAULT_AVATAR_PATH = '/assets/default_avatar.png'; // Ensure this path is correct relative to your public folder
const CROWN_IMAGE_PATH = '/crown.png';
const Leaderboard = ({ rankings }) => {
    // Find the top 3 users explicitly by their rank
    const rank1User = rankings.find(user => user.rank === 1);
    const rank2User = rankings.find(user => user.rank === 2);
    const rank3User = rankings.find(user => user.rank === 3);

    // Get the rest of the rankings from rank 4 onwards
    const restOfRankings = rankings.slice(3);

    return (
        <div className="leaderboard-section">

            {rankings.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No users on the leaderboard yet. Add some!</p>
            ) : (
                <>
                    <div className="top-3">
                        {rank2User && (
                            <div className="top-user-wrapper rank-2-wrapper">
                                {/* Avatar is now background of top-user-card */}
                                <div
                                    key={rank2User._id}
                                    className="top-user-card rank-2"
                                    style={{ backgroundImage: `url(${rank2User.avatar || DEFAULT_AVATAR_PATH})` }}
                                >
                                    <div className="rank-overlay">
                                    </div>
                                </div>
                                <h3 className="user-name-below">{rank2User.name}</h3>
                                <p className="points-display-below">{rank2User.totalPoints} Points</p>
                            </div>
                        )}

                        {rank1User && (
                            <div className="top-user-wrapper rank-1-wrapper ">
                                {/* Avatar is now background of top-user-card */}
                                <img src={CROWN_IMAGE_PATH} alt="Crown" className="crown-icon" />
                                <div
                                    key={rank1User._id}
                                    className="top-user-card rank-1"
                                    style={{ backgroundImage: `url(${rank1User.avatar || DEFAULT_AVATAR_PATH})` }}
                                >
                                     <div className="rank-overlay">
                                    </div>
                                </div>
                                <h3 className="user-name-below">{rank1User.name}</h3>
                                <p className="points-display-below">{rank1User.totalPoints} Points</p>
                            </div>
                        )}

                        {rank3User && (
                            <div className="top-user-wrapper rank-3-wrapper">
                                {/* Avatar is now background of top-user-card */}
                                <div
                                    key={rank3User._id}
                                    className="top-user-card rank-3"
                                    style={{ backgroundImage: `url(${rank3User.avatar || DEFAULT_AVATAR_PATH})` }}
                                >
                                     <div className="rank-overlay">
                                    </div>
                                </div>
                                <h3 className="user-name-below">{rank3User.name}</h3>
                                <p className="points-display-below">{rank3User.totalPoints} Points</p>
                            </div>
                        )}
                    </div>

                    {/* Display for remaining users (list-like) */}
                    <ul className="leaderboard-list">
                        {restOfRankings.map((user) => (
                            <li key={user._id} className="leaderboard-item">
                                <span className="rank">#{user.rank}</span>
                                {/* Avatar for list users */}
                                <img
                                    src={user.avatar || DEFAULT_AVATAR_PATH}
                                    alt={user.name}
                                    className="user-avatar-list" /* Class for smaller avatars in list */
                                />
                                <span className="name">{user.name}</span>
                                <span className="points">{user.totalPoints}🏆</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Leaderboard;