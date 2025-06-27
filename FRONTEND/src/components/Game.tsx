import { useNavigate } from 'react-router-dom'
import '../css/Game.css'
import Footer from '../components/Footer'
import Banner from '../components/Banner'
import { useState } from 'react'

interface GameProps {
  onBack: () => void;
}

//not sold on the box game look, mayb try without the box?
function Game({ onBack }: GameProps){
    const [loading, setLoading] = useState(false);
    return (
        <div className="game-container">
            <div className="backdrop" />
            {/* <Banner /> */}
            <div className={`game__box${!loading ? ' game__box--with-divider' : ''}`}>
                {loading ? (
                  <div className="game-throbber"></div>
                ) : (
                  <>
                    <div className="gamebox__left">
                        <div className="gamebox__label">GOBLIN</div>
                        <img className="gamebox__image" src="/images/goblin.webp" alt="Goblin" />
                    </div>

                    <div className="gamebox__or-circle">
                        <span>OR</span>
                    </div>

                    <div className="gamebox__score">
                        <div className="score__current">Score: 0</div>
                        <div className="score__high">High Score: 0</div>
                    </div>

                    <div className="gamebox__right">
                        <div className="gamebox__label">JAD</div>
                        <img className="gamebox__image" src="/images/jad.webp" alt="Jad" />
                    </div>
                  </>
                )}
            </div>
        </div>
    )
}

export default Game;