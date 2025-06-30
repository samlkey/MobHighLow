import { useNavigate } from 'react-router-dom'
import '../css/Game.css'
import Footer from '../components/Footer'
import Banner from '../components/Banner'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    // Fetch mob list from API
    const [mobList, setMobList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [mob1, setMob1] = useState<string>(mobList[0]);
    const [mob2, setMob2] = useState<string>(mobList[1]);
    const [mob1CombatLevel, setMob1CombatLevel] = useState<number | null>(null);
    const [mob2CombatLevel, setMob2CombatLevel] = useState<number | null>(null);
    const [mob1Image, setMob1Image] = useState<string>('images/missing.png');
    const [mob2Image, setMob2Image] = useState<string>('images/missing.png');
    const [mob1Color, setMob1Color] = useState<string>('#2d5016');
    const [mob2Color, setMob2Color] = useState<string>('#8b0000');
    const [score, setScore] = useState<number>(0);
    const [highScore, setHighScore] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [reveal, setReveal] = useState(false);
    const [roundKey, setRoundKey] = useState(0);
    const [pickedSide, setPickedSide] = useState<null | 'left' | 'right'>(null);
    const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

    const fetchCombatLevel = async (mobName: string): Promise<number | null> => {
        try {
            const response = await fetch(`http://localhost:3000/api/combat-level?mobName=${encodeURIComponent(mobName)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: CombatLevelData = await response.json();
            return data.combatLevel;
        } catch (error) {
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
            return null;
        }
    };

    // Pick two distinct random mobs
    function getTwoRandomMobs(list: string[]) {
        if (list.length < 2) return [list[0], list[0]];
        const idx1 = Math.floor(Math.random() * list.length);
        let idx2 = Math.floor(Math.random() * (list.length - 1));
        if (idx2 >= idx1) idx2 += 1;
        return [list[idx1], list[idx2]];
    }

    // Retry logic for loading two valid mobs
    const loadMobDataWithRetry = async (maxRetries = 10) => {
        let attempts = 0;
        while (attempts < maxRetries) {
            const [mobA, mobB] = getTwoRandomMobs(mobList);
            try {
                setLoading(true);
                setReveal(false);
                setRoundKey(prev => prev + 1);
                setPickedSide(null);
                setLastCorrect(null);

                setMob1(mobA);
                setMob2(mobB);

                const [mob1Level, mob2Level, mob1Data, mob2Data] = await Promise.all([
                    fetchCombatLevel(mobA),
                    fetchCombatLevel(mobB),
                    fetchImage(mobA),
                    fetchImage(mobB)
                ]);

                if (
                    mob1Level == null ||
                    mob2Level == null ||
                    !mob1Data ||
                    !mob2Data ||
                    !mob1Data.image ||
                    !mob2Data.image
                ) {
                    throw new Error('Invalid mob data');
                }

                setMob1CombatLevel(mob1Level);
                setMob2CombatLevel(mob2Level);
                setMob1Image(mob1Data.image);
                setMob2Image(mob2Data.image);
                if (mob1Data.primaryColor) setMob1Color(mob1Data.primaryColor);
                if (mob2Data.primaryColor) setMob2Color(mob2Data.primaryColor);

                setLoading(false);
                return; // Success!
            } catch (error) {
                attempts++;
                if (attempts >= maxRetries) {
                    setLoading(false);
                    alert('Failed to load valid mobs after several attempts.');
                    return;
                }
                // Otherwise, try again
            }
        }
    };

    // Start or reset the game
    const startGame = (newMobList?: string[]) => {
        const list = newMobList || mobList;
        if (list.length < 2) return;
        setScore(0);
        setGameOver(false);
        loadMobDataWithRetry();
    };

    const handlePlayAgain = async () => {
        setLoading(true);
        const res = await fetch('http://localhost:3000/api/mobs');
        const data = await res.json();
        setMobList(data);
        startGame(data);
        setLoading(false);
    };

    // On mount, fetch the mob list
    useEffect(() => {
        fetch('http://localhost:3000/api/mobs')
            .then(res => res.json())
            .then(data => {
                setMobList(data);
            });
    }, []);

    // When mobList is set, start the game
    useEffect(() => {
        if (mobList.length >= 2) {
            startGame();
        }
        // eslint-disable-next-line
    }, [mobList]);

    // Handle user guess (left or right)
    const handleGuess = (guess: 'left' | 'right') => {
        if (loading || gameOver || reveal) return;
        if (mob1CombatLevel == null || mob2CombatLevel == null) return;
        let correct = false;
        if (guess === 'left') {
            correct = mob1CombatLevel >= mob2CombatLevel;
        } else {
            correct = mob2CombatLevel >= mob1CombatLevel;
        }
        setPickedSide(guess);
        setLastCorrect(correct);
        setReveal(true);
        if (correct) {
            const newScore = score + 1;
            setScore(newScore);
            if (newScore > highScore) setHighScore(newScore);
            setTimeout(() => {
                setRoundKey(prev => prev + 1);
                setTimeout(() => {
                    loadMobDataWithRetry();
                }, 400);
            }, 1500);
        } else {
            setTimeout(() => {
                setGameOver(true);
            }, 3000);
        }
    };

    const slideDownAnimation = {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.2
        }
    };

    // Animation for combat level reveal
    const combatLevelRevealAnim = {
        initial: { opacity: 0, scale: 0.7 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }
    };

    // Animation for mob box exit
    const leftExitAnim = { exit: { x: '-100vw', opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } } };
    const rightExitAnim = { exit: { x: '100vw', opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } } };

    // Determine the color of the center circle based on selection
    const orCircleColor =
      pickedSide && reveal
        ? lastCorrect
          ? "#2ecc40" // green
          : "#e74c3c" // red
        : "#fff"; // default white

    // Determine the icon for the center circle
    const orCircleIcon =
      pickedSide && reveal
        ? lastCorrect
          ? "✔"
          : "✖"
        : "OR";

    if (mobList.length < 2) {
        return (
            <div className="game-container">
                <div className="game-throbber"></div>
            </div>
        );
    }
    return (
        <div className="game-container">
            <div className="backdrop" />
            <div className={`game__box${!loading ? ' game__box--with-divider' : ''}`}> 
                {loading ? (
                  <div className="game-throbber"></div>
                ) : gameOver ? (
                  <div className="gameover-overlay">
                    <motion.div
                      className="gameover-content"
                      initial={{ y: -200, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <h1 className="gameover-title">You Scored</h1>
                        <div className="gameover-score"><p>{score}</p></div>
                        <button className="gameover-btn" onClick={handlePlayAgain}>Play Again</button>
                    </motion.div>
                  </div>
                ) : (
                  <>
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={"left-" + roundKey}
                            className={
                              "gamebox__left" +
                              (pickedSide === 'left' && reveal
                                ? lastCorrect
                                  ? " gamebox__picked-correct"
                                  : " gamebox__picked-incorrect"
                                : "")
                            }
                            initial={slideDownAnimation.initial}
                            animate={slideDownAnimation.animate}
                            exit={leftExitAnim.exit}
                            transition={slideDownAnimation.transition}
                            onClick={() => handleGuess('left')}
                            style={{ cursor: gameOver || reveal ? 'not-allowed' : 'pointer' }}
                        >
                            <div 
                                className="gamebox__background"
                                style={{ backgroundColor: mob1Color }}
                            />
                            <div className="gamebox__label">
                                {mob1}
                                {reveal && mob1CombatLevel !== null && (
                                    <motion.div
                                        className="combat-level"
                                        initial={combatLevelRevealAnim.initial}
                                        animate={combatLevelRevealAnim.animate}
                                    >
                                        Level {mob1CombatLevel}
                                    </motion.div>
                                )}
                            </div>
                            <img className="gamebox__image" src={mob1Image} alt={mob1} />
                        </motion.div>
                    </AnimatePresence>

                    <div
                      className="gamebox__or-circle"
                      style={{ background: orCircleColor, transition: 'background 0.3s' }}
                    >
                      <span className={pickedSide && reveal ? "or-circle-icon" : undefined}>{orCircleIcon}</span>
                    </div>

                    <div className="gamebox__score">
                        <div className="score__current">Score: {score}</div>
                        <div className="score__high">High Score: {highScore}</div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={"right-" + roundKey}
                            className={
                              "gamebox__right" +
                              (pickedSide === 'right' && reveal
                                ? lastCorrect
                                  ? " gamebox__picked-correct"
                                  : " gamebox__picked-incorrect"
                                : "")
                            }
                            initial={slideDownAnimation.initial}
                            animate={slideDownAnimation.animate}
                            exit={rightExitAnim.exit}
                            transition={{ ...slideDownAnimation.transition, delay: 0.4 }}
                            onClick={() => handleGuess('right')}
                            style={{ cursor: gameOver || reveal ? 'not-allowed' : 'pointer' }}
                        >
                            <div 
                                className="gamebox__background"
                                style={{ backgroundColor: mob2Color }}
                            />
                            <div className="gamebox__label">
                                {mob2}
                                {reveal && mob2CombatLevel !== null && (
                                    <motion.div
                                        className="combat-level"
                                        initial={combatLevelRevealAnim.initial}
                                        animate={combatLevelRevealAnim.animate}
                                    >
                                        Level {mob2CombatLevel}
                                    </motion.div>
                                )}
                            </div>
                            <img className="gamebox__image" src={mob2Image} alt={mob2} />
                        </motion.div>
                    </AnimatePresence>
                  </>
                )}
            </div>
        </div>
    );
}

export default Game;