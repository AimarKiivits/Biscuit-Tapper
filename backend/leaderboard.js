const pool = require('./utils/db');

const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await pool.query('SELECT u.username, ud.click_amount FROM userdata ud INNER JOIN users u ON u.id = ud.user_id ORDER BY click_amount DESC;');
        leaderboard[0].sort((a, b) => b.click_amount - a.click_amount);
        
        res.status(200).json({ leaderboard: leaderboard[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting leaderboard' });
    }
}

module.exports = { getLeaderboard };