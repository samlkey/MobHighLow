import '../css/Landing.css'
import Footer from '../components/Footer'

function Landing(){
    return(
        <div className="landing__container">
            <div className="backdrop" />
            <div className="landing__main">
                <div>
                    <img className="landing___main__logo" src="/images/icon.png"></img>
                    <div className="landing__main__content">
                        <h1>Welcome to the OSRS CombatLvl Guessing game!</h1>
                        <h2>Can you guess higher/lower for all the enemies in the game?</h2>
                        <div className="landing__main__button">
                            <button value="Play">Play</button>
                        </div>
                    </div>
                </div>
                <div className="landing__main__right">
                    <div className="landing__main__images">
                        <img src="/images/mob.png"></img>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Landing;