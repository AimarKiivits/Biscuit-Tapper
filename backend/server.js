const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
const auth = require('./auth');
const register = require('./register');

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
    auth.login(req, res);
    console.log(req.body);
});

app.post('/register', (req, res) => {
    console.log(req.body);
    register.register(req, res);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});