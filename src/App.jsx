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



function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
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