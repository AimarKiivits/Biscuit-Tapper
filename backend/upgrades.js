const pool = require('./utils/db');

const getUpgrades = async (req, res) => {
    const user_id = req.params;

    if (!user_id?.id) {
        return res.status(400).json({ message: 'Please provide a user_id' });
    }

    try {
        const [userDataRows] = await pool.query('SELECT * FROM userdata WHERE user_id = ?', [user_id.id]);
        const userData = userDataRows[0];

        if (!userData) {
            return res.status(404).json({ message: 'Data not found' });
        }
        
        const clicks = parseInt(userData.click_amount);
        
        res.status(200).json({ upgrades: { clicker: userData.clicker, oven: userData.oven}, click_amount: clicks });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting upgrades' });
    }
}

const saveUpgrades = async (req, res) => {
    const user_id = req.params;
    const upgrades = req.body.user_upgrades;
    const click_amount = req.body.clicks;


    if (!user_id) {
        return res.status(400).json({ message: 'Please provide a user_id' });
    }

    if (!upgrades) {
        return res.status(400).json({ message: 'Please provide upgrades' });
    }

    try {
        await pool.query('UPDATE userdata SET click_amount = ?, clicker = ?, oven = ? WHERE user_id = ?', [click_amount, upgrades.clicker, upgrades.oven, user_id.id]);
        res.status(200).json({ message: 'Upgrades saved' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving upgrades' });
    }
}

module.exports = { getUpgrades, saveUpgrades };