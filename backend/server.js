const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
const auth = require('./auth');
const register = require('./register');
const upgrades = require('./upgrades');

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
    auth.login(req, res);
});

app.post('/register', (req, res) => {
    register.register(req, res);
});

app.get('/upgrades', (req, res) => {
    res.json({ clicker: 0, oven: 0 });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});