import { useState } from 'react'
import HomePage from './components/HomePage'
import Game from './components/Game'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [playerCount, setPlayerCount] = useState(2)
  const [selectedSkins, setSelectedSkins] = useState({ cardSkin: 'classic', themeSkin: 'default', playerSkin: 'cats' })

  const handleStartGame = (numPlayers, skins = { cardSkin: 'classic', themeSkin: 'default', playerSkin: 'cats' }) => {
    setPlayerCount(numPlayers)
    setSelectedSkins(skins)
    setCurrentView('game')
  }

  const handleBackToMenu = () => {
    setCurrentView('home')
  }

  return (
    <div className={`App theme-${selectedSkins.themeSkin}`}>
      {currentView === 'home' && (
        <HomePage
          onStartGame={handleStartGame}
          currentSkins={selectedSkins}
          onSkinChange={setSelectedSkins}
        />
      )}
      {currentView === 'game' && (
        <Game
          playerCount={playerCount}
          onBackToMenu={handleBackToMenu}
          skins={selectedSkins}
        />
      )}
    </div>
  )
}

export default App
