// client/src/components/Leaderboard.jsx
import React from 'react';

const Leaderboard = ({ rankings }) => {
    // Find the top 3 users explicitly by their rank
    // This allows us to control their individual rendering order and structure
    const rank1User = rankings.find(user => user.rank === 1);
    const rank2User = rankings.find(user => user.rank === 2);
    const rank3User = rankings.find(user => user.rank === 3);

    // Get the rest of the rankings from rank 4 onwards
    const restOfRankings = rankings.slice(3);

    return (
        <div className="leaderboard-section">
            <h2>Live Leaderboard</h2>

            {rankings.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No users on the leaderboard yet. Add some!</p>
            ) : (
                <>
                    {/* Top 3 users container - arranged horizontally by Flexbox */}
                    <div className="top-3">
                        {/* Wrapper for Rank 2: Contains the circle, name, and points */}
                        {rank2User && (
                            <div className="top-user-wrapper rank-2-wrapper">
                                <div key={rank2User._id} className="top-user-card rank-2">
                                    <span className="rank-display">#{rank2User.rank}</span>
                                    {/* Name and points are NOT inside the circle */}
                                </div>
                                <h3 className="user-name-below">{rank2User.name}</h3>
                                <p className="points-display-below">{rank2User.totalPoints} Points</p>
                            </div>
                        )}

                        {/* Wrapper for Rank 1: Contains the circle, name, and points */}
                        {rank1User && (
                            <div className="top-user-wrapper rank-1-wrapper">
                                <div key={rank1User._id} className="top-user-card rank-1">
                                    <span className="rank-display">#{rank1User.rank}</span>
                                </div>
                                <h3 className="user-name-below">{rank1User.name}</h3>
                                <p className="points-display-below">{rank1User.totalPoints} Points</p>
                            </div>
                        )}

                        {/* Wrapper for Rank 3: Contains the circle, name, and points */}
                        {rank3User && (
                            <div className="top-user-wrapper rank-3-wrapper">
                                <div key={rank3User._id} className="top-user-card rank-3">
                                    <span className="rank-display">#{rank3User.rank}</span>
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
                                <span className="name">{user.name}</span>
                                <span className="points">{user.totalPoints} Points</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Leaderboard;