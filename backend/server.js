const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
const auth = require('./auth');
const register = require('./register');
const upgrades = require('./upgrades');
const leaderboard = require('./leaderboard');
const path = require('path');

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
    auth.login(req, res);
});

app.post('/register', (req, res) => {
    register.register(req, res);
});

app.get('/upgrades/:id', (req, res) => {
    upgrades.getUpgrades(req, res);
});

app.post('/save/:id', (req, res) => {
    upgrades.saveUpgrades(req, res);
});

app.get('/leaderboard', (req, res) => {
    leaderboard.getLeaderboard(req, res);
});

if (process.env.MODE === 'PROD') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});