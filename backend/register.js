const bcrypt = require('bcrypt');
const pool = require('./utils/db');

const register = async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide a username and password' });
    }

    try {
        // Check if user already exists
        const [existingUserRows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUserRows.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        await pool.query('INSERT INTO userdata (user_id, click_amount, clicker, oven) VALUES ((SELECT id FROM users WHERE username = ?), 0, 0, 0)', [username]);

        res.status(201).json({ message: 'User created' });

    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
}

module.exports = { register };
