const pool = require('./utils/db');

const getUpgrades = async (req, res) => {
    const user_id = req.params;

    if (!user_id) {
        return res.status(400).json({ message: 'Please provide a user_id' });
    }

    try {
        const upgrades = await pool.query('SELECT * FROM Upgrades WHERE user_id = ?', [user_id.id]);
        res.status(200).json(upgrades[0][0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting upgrades' });
    }
}

const saveUpgrades = async (req, res) => {
    const user_id = req.params;
    const upgrades = req.body;

    if (!user_id) {
        return res.status(400).json({ message: 'Please provide a user_id' });
    }

    if (!upgrades) {
        return res.status(400).json({ message: 'Please provide upgrades' });
    }

    console.log(upgrades);
    console.log(user_id);

    try {
        const result = await pool.query('UPDATE Upgrades SET ? WHERE user_id = ?', [upgrades, user_id.id]);
        res.status(200).json({ message: 'Upgrades saved' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving upgrades' });
    }
}

module.exports = { getUpgrades, saveUpgrades };