const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./utils/db');

const JWT_SECRET = '5690b0a962318eba3b5f67f84cb9b157a1e7588f8c74efe402089a45eff9042c';

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
        console.log(user[0][0].username);
        const accessToken = jwt.sign(
            { username: user[0][0].username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const token = jwt.decode(accessToken);
        console.log(token);
        console.log(Date.now());

        res.json({ accessToken });
    }
}

module.exports = { login };