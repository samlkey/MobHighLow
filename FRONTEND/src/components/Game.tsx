import { useNavigate } from 'react-router-dom'
import '../css/Game.css'
import Footer from '../components/Footer'
import Banner from '../components/Banner'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface GameProps {
  onBack: () => void;
}

interface CombatLevelData {
  monsterName: string;
  combatLevel: number;
}

interface ImageData {
  image: string;
  primaryColor: string;
}

//not sold on the box game look, mayb try without the box?
function Game({ onBack }: GameProps){
    const [loading, setLoading] = useState(false);
    const [mob1, setMob1] = useState<string>('Goblin');
    const [mob2, setMob2] = useState<string>('Jad');
    const [mob1CombatLevel, setMob1CombatLevel] = useState<number | null>(null);
    const [mob2CombatLevel, setMob2CombatLevel] = useState<number | null>(null);
    const [mob1Image, setMob1Image] = useState<string>('images/missing.png');
    const [mob2Image, setMob2Image] = useState<string>('images/missing.png');
    const [mob1Color, setMob1Color] = useState<string>('#2d5016');
    const [mob2Color, setMob2Color] = useState<string>('#8b0000');

    const fetchCombatLevel = async (mobName: string): Promise<number | null> => {
        try {
            const response = await fetch(`http://localhost:3000/api/combat-level?mobName=${encodeURIComponent(mobName)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: CombatLevelData = await response.json();
            return data.combatLevel;
        } catch (error) {
            console.error(`Error fetching combat level for ${mobName}:`, error);
            return null;
        }
    };

    const fetchImage = async (mobName: string): Promise<{image: string, primaryColor: string} | null> => {
        try {
            const response = await fetch(`http://localhost:3000/api/image?mobName=${encodeURIComponent(mobName)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: ImageData = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching image for ${mobName}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const mob1Name = "Vorkath";
                const mob2Name = "Zulrah";
                
                setMob1(mob1Name);
                setMob2(mob2Name);

                const [mob1Level, mob2Level, mob1Data, mob2Data] = await Promise.all([
                    fetchCombatLevel(mob1Name),
                    fetchCombatLevel(mob2Name),
                    fetchImage(mob1Name),
                    fetchImage(mob2Name)
                ]);
                setMob1CombatLevel(mob1Level);
                setMob2CombatLevel(mob2Level);
                if (mob1Data) {
                    setMob1Image(mob1Data.image);
                    if (mob1Data.primaryColor) setMob1Color(mob1Data.primaryColor);
                }
                if (mob2Data) {
                    setMob2Image(mob2Data.image);
                    if (mob2Data.primaryColor) setMob2Color(mob2Data.primaryColor);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const slideDownAnimation = {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.2
        }
    };

    return (
        <div className="game-container">
            <div className="backdrop" />
            {/* <Banner /> */}
            <div className={`game__box${!loading ? ' game__box--with-divider' : ''}`}>
                {loading ? (
                  <div className="game-throbber"></div>
                ) : (
                  <>
                    <motion.div 
                        className="gamebox__left"
                        initial={slideDownAnimation.initial}
                        animate={slideDownAnimation.animate}
                        transition={slideDownAnimation.transition}
                    >
                        <div 
                            className="gamebox__background"
                            style={{ backgroundColor: mob1Color }}
                        />
                        <div className="gamebox__label">
                            {mob1}
                            {mob1CombatLevel && <div className="combat-level">Level {mob1CombatLevel}</div>}
                        </div>
                        <img className="gamebox__image" src={mob1Image} alt="Goblin" />
                    </motion.div>

                    <div className="gamebox__or-circle">
                        <span>OR</span>
                    </div>

                    <div className="gamebox__score">
                        <div className="score__current">Score: 0</div>
                        <div className="score__high">High Score: 0</div>
                    </div>

                    <motion.div 
                        className="gamebox__right"
                        initial={slideDownAnimation.initial}
                        animate={slideDownAnimation.animate}
                        transition={{ ...slideDownAnimation.transition, delay: 0.4 }}
                    >
                        <div 
                            className="gamebox__background"
                            style={{ backgroundColor: mob2Color }}
                        />
                        <div className="gamebox__label">
                            {mob2}
                            {mob2CombatLevel && <div className="combat-level">Level {mob2CombatLevel}</div>}
                        </div>
                        <img className="gamebox__image" src={mob2Image} alt="Jad" />
                    </motion.div>
                  </>
                )}
            </div>
        </div>
    )
}

export default Game;