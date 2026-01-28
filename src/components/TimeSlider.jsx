import React, { useState, useEffect, useRef, useCallback } from 'react'

function TimeSlider({ mythes, onTimeFilterChange }) {
  const [minYear, setMinYear] = useState(-1500)
  const [maxYear, setMaxYear] = useState(2025)
  const [minVal, setMinVal] = useState(-1500)
  const [maxVal, setMaxVal] = useState(2025)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(1000)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const intervalRef = useRef(null)
  const minValRef = useRef(minVal)
  const maxValRef = useRef(maxVal)
  const range = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (mythes.length > 0) {
      const years = mythes
        .map(m => m.date_entier)
        .filter(y => y !== null && y !== undefined)
      
      if (years.length > 0) {
        const min = Math.min(...years)
        const max = Math.max(...years)
        const roundedMin = Math.floor(min / 100) * 100
        const roundedMax = Math.ceil(max / 100) * 100
        
        setMinYear(roundedMin)
        setMaxYear(roundedMax)
        setMinVal(roundedMin)
        setMaxVal(roundedMax)
        minValRef.current = roundedMin
        maxValRef.current = roundedMax
      }
    }
  }, [mythes])

  useEffect(() => {
    const filtered = mythes.filter(myth => {
      if (!myth.date_entier) return true
      return myth.date_entier >= minVal && myth.date_entier <= maxVal
    })
    onTimeFilterChange(filtered)
  }, [minVal, maxVal, mythes, onTimeFilterChange])

  useEffect(() => {
    if (isPlaying) {
      const step = (maxYear - minYear) / 50
      intervalRef.current = setInterval(() => {
        setMaxVal(prev => {
          const newVal = prev + step
          if (newVal >= maxYear) {
            setIsPlaying(false)
            return maxYear
          }
          return newVal
        })
      }, playSpeed)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, playSpeed, minYear, maxYear])

  const getPercent = useCallback(
    (value) => Math.round(((value - minYear) / (maxYear - minYear)) * 100),
    [minYear, maxYear]
  )

  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxValRef.current)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minVal, getPercent])

  useEffect(() => {
    const minPercent = getPercent(minValRef.current)
    const maxPercent = getPercent(maxVal)

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxVal, getPercent])

  const handleMinChange = useCallback((e) => {
    const value = parseInt(e.target.value)
    setMinVal(Math.min(value, maxVal - 1))
    minValRef.current = Math.min(value, maxVal - 1)
  }, [maxVal])

  const handleMaxChange = useCallback((e) => {
    const value = parseInt(e.target.value)
    setMaxVal(Math.max(value, minVal + 1))
    maxValRef.current = Math.max(value, minVal + 1)
  }, [minVal])

  const formatYear = (year) => {
    if (year < 0) return `${Math.abs(year)} av. J.-C.`
    return `${year} apr. J.-C.`
  }

  const reset = () => {
    setMinVal(minYear)
    setMaxVal(maxYear)
    setIsPlaying(false)
  }

  const mythesInRange = mythes.filter(m => {
    if (!m.date_entier) return true
    return m.date_entier >= minVal && m.date_entier <= maxVal
  }).length

  // MODE COMPACT : Petit affichage (quand isExpanded = false)
  if (!isExpanded) {
    return (
      <>
        {/* Version compacte - Mobile = bouton flottant, Desktop = barre en bas */}
        {isMobile ? (
          // MOBILE : Petit bouton flottant
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              cursor: 'pointer',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)'
            }}
          >
            <span style={{ fontSize: '24px' }}>⏱️</span>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: '600',
              marginTop: '2px'
            }}>
              {mythesInRange}
            </span>
          </button>
        ) : (
          // DESKTOP : Barre compacte en bas
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'rgba(102, 126, 234, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '12px 20px',
              color: 'white'
            }}>
              <span style={{ fontSize: '20px', cursor: 'pointer' }}
                onClick={() => setIsExpanded(true)}>
                ⏱️
              </span>

              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                minWidth: '300px'
              }}>
                {formatYear(Math.round(minVal))} → {formatYear(Math.round(maxVal))}
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {mythesInRange} mythe{mythesInRange > 1 ? 's' : ''}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    background: isPlaying ? 'rgba(231, 76, 60, 0.8)' : 'rgba(39, 174, 96, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                
                <button
                  onClick={reset}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🔄
                </button>

                <button
                  onClick={() => setIsExpanded(true)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ⚙️
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // MODE ÉTENDU (Mobile ouvert ou Desktop)
  return (
    <div style={{
      position: isMobile ? 'fixed' : 'absolute',
      bottom: isMobile ? '0' : '20px',
      left: isMobile ? '0' : '50%',
      right: isMobile ? '0' : 'auto',
      transform: isMobile ? 'none' : 'translateX(-50%)',
      zIndex: 1000,
      background: 'rgba(102, 126, 234, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: isMobile ? '20px 20px 0 0' : '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      maxWidth: isMobile ? '100%' : 'none'
    }}>
      {/* Version étendue */}
      <div style={{ 
        padding: isMobile ? '20px 15px' : '20px', 
        minWidth: isMobile ? 'auto' : '500px',
        maxWidth: isMobile ? '100%' : 'none'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>⏱️</span>
            <h4 style={{ margin: 0, fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>
              Période temporelle
            </h4>
          </div>
          
          <button
            onClick={() => setIsExpanded(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '30px',
              height: '30px'
            }}
          >
            ▼
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: 'bold',
          marginBottom: '15px',
          padding: '10px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '8px',
          color: 'white'
        }}>
          {formatYear(Math.round(minVal))} → {formatYear(Math.round(maxVal))}
        </div>

        {/* Double Range Slider Container */}
        <div style={{ 
          position: 'relative',
          marginBottom: '20px',
          padding: '20px 0'
        }}>
          {/* Track de fond */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.2)',
            zIndex: 1
          }} />

          {/* Track actif (range entre min et max) */}
          <div
            ref={range}
            style={{
              position: 'absolute',
              height: '8px',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #F6AA1C, #FFC837)',
              boxShadow: '0 2px 8px rgba(246, 170, 28, 0.5)',
              zIndex: 2
            }}
          />

          {/* Input MIN (thumb gauche) */}
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={minVal}
            onChange={handleMinChange}
            className="thumb thumb--left"
            style={{
              position: 'absolute',
              width: '100%',
              pointerEvents: 'none',
              zIndex: 3
            }}
          />

          {/* Input MAX (thumb droit) */}
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={maxVal}
            onChange={handleMaxChange}
            className="thumb thumb--right"
            style={{
              position: 'absolute',
              width: '100%',
              pointerEvents: 'none',
              zIndex: 4
            }}
          />
        </div>

        {/* Contrôles */}
        <div style={{
          display: 'flex',
          gap: isMobile ? '8px' : '10px',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: isMobile ? '8px 12px' : '8px 16px',
              background: isPlaying ? '#e74c3c' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '600'
            }}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Lecture'}
          </button>

          <select
            value={playSpeed}
            onChange={(e) => setPlaySpeed(parseInt(e.target.value))}
            disabled={isPlaying}
            style={{
              padding: isMobile ? '8px 10px' : '8px 12px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: isMobile ? '11px' : '12px'
            }}
          >
            <option value={2000} style={{ background: '#667eea', color: 'white' }}>Lent</option>
            <option value={1000} style={{ background: '#667eea', color: 'white' }}>Normal</option>
            <option value={500} style={{ background: '#667eea', color: 'white' }}>Rapide</option>
          </select>

          <button
            onClick={reset}
            style={{
              padding: isMobile ? '8px 12px' : '8px 16px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '600'
            }}
          >
            🔄 Reset
          </button>

          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: isMobile ? '8px 10px' : '8px 12px',
            borderRadius: '6px',
            fontSize: isMobile ? '11px' : '12px',
            fontWeight: '600',
            color: 'white'
          }}>
            {mythesInRange} mythe{mythesInRange > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <style>
        {`
          /* Réinitialiser les styles du range */
          input[type="range"] {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background: transparent;
            outline: none;
            margin: 0;
            padding: 0;
          }

          /* Track invisible pour Chrome/Safari */
          input[type="range"]::-webkit-slider-runnable-track {
            height: 8px;
            background: transparent;
          }

          /* Track invisible pour Firefox */
          input[type="range"]::-moz-range-track {
            height: 8px;
            background: transparent;
          }

          /* Thumb pour Chrome/Safari */
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            pointer-events: all;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 3px solid #F6AA1C;
            margin-top: -6px;
          }

          /* Thumb pour Firefox */
          input[type="range"]::-moz-range-thumb {
            pointer-events: all;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 3px solid #F6AA1C;
          }

          /* Hover effect */
          input[type="range"]::-webkit-slider-thumb:hover {
            box-shadow: 0 3px 12px rgba(246, 170, 28, 0.6);
            transform: scale(1.1);
          }

          input[type="range"]::-moz-range-thumb:hover {
            box-shadow: 0 3px 12px rgba(246, 170, 28, 0.6);
            transform: scale(1.1);
          }

          /* Active effect */
          input[type="range"]:active::-webkit-slider-thumb {
            box-shadow: 0 4px 16px rgba(246, 170, 28, 0.8);
            transform: scale(1.2);
          }

          input[type="range"]:active::-moz-range-thumb {
            box-shadow: 0 4px 16px rgba(246, 170, 28, 0.8);
            transform: scale(1.2);
          }
        `}
      </style>
    </div>
  )
}

export default TimeSlider