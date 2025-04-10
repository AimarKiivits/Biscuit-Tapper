const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./utils/db');
require('dotenv').config();


const login = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide a username and password' });
    }
    
    try {
        const [userRows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = userRows[0];

        if (!user) {
            return res.status(401).json({ message: 'This user does not exist' });
        } else {
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const accessToken = jwt.sign(
                { username: user.username, user_id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.json({ accessToken, user_id: user.id });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { login };