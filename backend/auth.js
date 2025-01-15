const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./utils/db');
require('dotenv').config();


const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: 'Please provide a username and password' });
    }
    const user = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (user[0].length === 0) {
        res.status(401).json({ message: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user[0][0].password);
    if (!validPassword) {
        res.status(401).json({ message: 'Invalid credentials' });
    }
    if (validPassword) {
        const user_id = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        const accessToken = jwt.sign(
            { username: user[0][0].username, user_id: user_id[0][0].id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ accessToken, user_id: user_id[0][0].id });
    }
}

module.exports = { login };