const pool = require('./utils/db');

const getUpgrades = async (req, res) => {
    const user_id = req.params;

    if (!user_id?.id) {
        return res.status(400).json({ message: 'Please provide a user_id' });
    }

    try {
        const upgrades = await pool.query('SELECT clicker, oven FROM userdata WHERE user_id = ?', [user_id.id]);
        const click_amount = await pool.query('SELECT click_amount FROM userdata WHERE user_id = ?', [user_id.id]);
        
        const clicks = parseInt(click_amount[0][0].click_amount);
        
        res.status(200).json({ upgrades: upgrades[0][0], click_amount: clicks });

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
        const result = await pool.query('UPDATE userdata SET click_amount = ?, clicker = ?, oven = ? WHERE user_id = ?', [click_amount, upgrades.clicker, upgrades.oven, user_id.id]);
        res.status(200).json({ message: 'Upgrades saved' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving upgrades' });
    }
}

module.exports = { getUpgrades, saveUpgrades };