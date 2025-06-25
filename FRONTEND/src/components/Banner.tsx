import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/Banner.css'

function Banner() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="banner">
            <h1 className="banner__title">OSRS-CL</h1>
        </header>
    )
}

export default Banner;