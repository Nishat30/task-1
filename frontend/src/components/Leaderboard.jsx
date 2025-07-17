import React from 'react';
const CROWN_IMAGE_PATH = '/crown.png';
const Leaderboard = ({ rankings }) => {
    const rank1User = rankings.find(user => user.rank === 1);
    const rank2User = rankings.find(user => user.rank === 2);
    const rank3User = rankings.find(user => user.rank === 3);
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
                                <div
                                    key={rank2User._id}
                                    className="top-user-card rank-2"
                                    style={{ backgroundImage: `url(${rank2User.avatar})` }}
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
                                <img src={CROWN_IMAGE_PATH} alt="Crown" className="crown-icon" />
                                <div
                                    key={rank1User._id}
                                    className="top-user-card rank-1"
                                    style={{ backgroundImage: `url(${rank1User.avatar})` }}
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
                                <div
                                    key={rank3User._id}
                                    className="top-user-card rank-3"
                                    style={{ backgroundImage: `url(${rank3User.avatar})` }}
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
                                    src={user.avatar}
                                    alt={user.name}
                                    className="user-avatar-list"
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