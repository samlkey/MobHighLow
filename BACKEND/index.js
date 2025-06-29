const express = require("express");
const cors = require("cors");
const axios = require("axios");
const ColorThief = require('colorthief');

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

const fetchImage = async (name) => {
    const url = 'https://oldschool.runescape.wiki/api.php';
    const params = {
        action: 'parse',
        format: 'json',
        page: name,
        prop: 'text',
        section: 0
    }
    const res = await axios.get(url, { params });

    // Extract HTML content
    const htmlContent = res.data.parse.text['*'];

    // Regex to find the first <img> in the infobox-image td
    const match = htmlContent.match(/<td[^>]*class="infobox-image[^"]*"[^>]*>.*?<img[^>]*src="([^"]+)"[^>]*>/s);
    if (match) {
        let imgSrc = match[1];
    
        if (imgSrc.includes('/thumb/')) {
            // Extract the original filename from the thumbnail URL
            const originalMatch = imgSrc.match(/\/thumb\/([^\/]+)\/\d+px-[^\/]+/);
            if (originalMatch) {
                imgSrc = `/images/${originalMatch[1]}`;
            }
        }
        
        // Prepend the wiki base URL if the src is relative
        if (imgSrc.startsWith('/')) {
            imgSrc = 'https://oldschool.runescape.wiki' + imgSrc;
        }

        // Extract primary color from the image
        let primaryColor = null;
        try {
            // Download the image first
            const imageResponse = await axios.get(imgSrc, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(imageResponse.data);
            
            const dominantColor = await ColorThief.getColor(imageBuffer);;
            primaryColor = `#${dominantColor[0].toString(16).padStart(2, '0')}${dominantColor[1].toString(16).padStart(2, '0')}${dominantColor[2].toString(16).padStart(2, '0')}`;
        } catch (error) {
            console.error('Error extracting color from image:', error);
        }

        return {
            image: imgSrc,
            primaryColor: primaryColor
        }
    }
    return null;
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

app.get("/api/image", async (req, res) => {
    try {
        const { mobName } = req.query;

        if (!mobName) {
            return res.status(400).json({ 
                error: 'Missing required parameter: mobName' 
            });
        }

        const data = await fetchImage(mobName);
        
        if (!data) {
            return res.status(404).json({ 
                error: `Image not found for monster: ${mobName}`,
                monsterName: mobName
            });
        }
        
        res.json(data);

    } catch (error) {
        console.error('Error fetching mob image:', error);
        res.status(500).json({
            error: 'Failed to fetch image',
            details: error.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});