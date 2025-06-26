import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/Banner.css'

function Banner() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="banner">
            <div className="banner__center">
                <span className="banner__score">Score: 0</span>
                <span className="banner__lives">Lives Remaining: 3</span>
            </div>
        </header>
    )
}

export default Banner;