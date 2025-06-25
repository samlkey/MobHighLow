import { useNavigate } from 'react-router-dom'
import '../css/Game.css'
import About from './About'

function Game(){
    const navigate = useNavigate();
    return (
        <div className="game-container">
            <div className="game-box">
                <button>Start</button>
                <button>Difficulty</button>
                <button onClick={() => navigate('/about')}>Help</button>
            </div>
        </div>
    )
}

export default Game;