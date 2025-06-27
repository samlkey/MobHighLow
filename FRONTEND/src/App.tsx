import { BrowserRouter as Router } from 'react-router-dom'
import { useState, createContext, useContext, Dispatch, SetStateAction, ReactNode } from 'react'
import './css/App.css'
import './css/index.css'
import Game from './components/Game'
import Landing from './components/Landing'
import { AnimatePresence, motion } from 'framer-motion'
import Footer from './components/Footer'

interface ViewContextType {
  view: string;
  setView: Dispatch<SetStateAction<string>>;
}

const ViewContext = createContext<ViewContextType>({ view: 'landing', setView: () => {} });
export const useView = () => useContext(ViewContext);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState('landing');
  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

function App() {
  const [view, setView] = useState('landing') // 'landing', 'game', 'about'

  return (
    <>
    <Router>
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Landing onStart={() => setView('game')} onAbout={() => setView('about')} />
          </motion.div>
        )}
        {view === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Game onBack={() => setView('landing')} />
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
    <Footer></Footer>
    </>
  )
}

export default App
