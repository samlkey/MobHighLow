import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './css/App.css'
import './css/index.css'
import Banner from './components/Banner'
import Game from './components/Game'
import About from './components/About'
import Footer from './components/Footer'
import Landing from './components/Landing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      {/* <Banner />
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer /> */}
      <Landing />
    </Router>
  )
}

export default App
