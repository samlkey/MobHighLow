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
            <Banner />
            <div className={`game__box${!loading ? ' game__box--with-divider' : ''}`}>
                {loading ? (
                  <div className="game-throbber"></div>
                ) : (
                  <>
                    <div className="gamebox__left">
                        <h1 className="gamebox__title">GOBLIN</h1>
                        <div className="gamebox__image-container">
                            <img className="gamebox__image" src="/images/goblin.webp" alt="Goblin" />
                        </div>
                        <h1 className="gamebox__title">CL: ???</h1>
                    </div>
                    <div className="gamebox__buttons">
                        <div>
                            <button>Higher</button>
                            <button>Lower</button>
                        </div>
                    </div>
                    <div className="gamebox__right">
                        <h1 className="gamebox__title">JAD</h1>
                        <div className="gamebox__image-container">
                            <img className="gamebox__image" src="/images/jad.webp" alt="Jad" />
                        </div>
                        <h1 className="gamebox__title">???</h1>
                    </div>
                  </>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default Game;