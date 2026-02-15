import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import Bibliotheque from './pages/Bibliotheque'
import GalleryPage from './pages/GalleryPage'
import ComparisonPage from './pages/ComparisonPage'
import AboutPage from './pages/AboutPage'
import SitesTouristiques from './pages/SitesTouristiques'
import './i18n/config'
import { useState, useEffect } from 'react'
import Tutorial from './components/Tutorial'

function App() {
  const [showTutorial, setShowTutorial] = useState(false)

  // Afficher le tuto au premier lancement
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('tutorialCompleted')
    if (!hasSeenTutorial) {
      setShowTutorial(true)
    }
  }, [])

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
          {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} onComplete={() => setShowTutorial(false)} />}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carte" element={<MapPage />} />
          <Route path="/bibliotheque" element={<Bibliotheque />} />
          <Route path="/galerie" element={<GalleryPage />} />
          <Route path="/comparaison" element={<ComparisonPage />} />
          <Route path="/sites" element={<SitesTouristiques />} />
          <Route path="/a-propos" element={<AboutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App