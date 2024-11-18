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
        const accessToken = jwt.sign(
            { username: user[0][0].username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const token = jwt.decode(accessToken);
        console.log(token);
        console.log(Date.now());

        res.json({ accessToken });
    }
}

module.exports = { login };