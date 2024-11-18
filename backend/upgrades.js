

const getUpgrades = async (req, res) => {
    res.json({ user_upgrades: { clicker : 1, oven : 0} });
}

module.exports = { getUpgrades };