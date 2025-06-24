const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


const fetchCombatLevel = async (name) => {
    const url = 'https://oldschool.runescape.wiki/api.php';
    const params = {
        action: 'parse',
        format: 'json',
        page: name,
        prop: 'text',
        section: 0
    }
    const res = await axios.get(url, { params });
    
    // Extract combat level from the HTML content
    const htmlContent = res.data.parse.text['*'];
    
    // Look for combat level in the HTML
    const combatLevelMatch = htmlContent.match(/Combat level[^>]*>Combat level<\/a><\/th><td[^>]*>([\d,]+)<\/td>/i);
    const combatLevel = combatLevelMatch ? parseInt(combatLevelMatch[1].replace(/,/g, '')) : null;
    
    return {
        monsterName: name,
        combatLevel: combatLevel
    };
}

//ENDPOINTS
app.get("/api/combat-level", async (req, res) => {
    try {
        const { mobName } = req.query;
        
        if (!mobName) {
            return res.status(400).json({ 
                error: 'Missing required parameter: mobName' 
            });
        }
        
        const data = await fetchCombatLevel(mobName);
        
        if (!data.combatLevel) {
            return res.status(404).json({ 
                error: `Combat level not found for monster: ${mobName}`,
                monsterName: mobName
            });
        }
        
        res.json(data);
        
    } catch (error) {
        console.error('Error fetching combat level:', error);
        res.status(500).json({ 
            error: 'Failed to fetch combat level',
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});