import React, { useState } from 'react'
import GameLobby from './components/GameLobby'
import WaitingRoom from './components/WaitingRoom'
import Game from './components/Game'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('lobby') // 'lobby', 'waiting', 'playing'
  const [gameId, setGameId] = useState(null)
  const [playerId, setPlayerId] = useState(null)
  const handleGameStart = (newGameId, newPlayerId) => {
    setGameId(newGameId)
    setPlayerId(newPlayerId)
    setGameState('waiting')
  }

  const handleGameReady = () => {
    setGameState('playing')
  }

  const handleLeaveGame = () => {
    setGameState('lobby')
    setGameId(null)
    setPlayerId(null)
  }

  return (
    <div className="App">
      {gameState === 'lobby' && (
        <GameLobby onGameStart={handleGameStart} />
      )}
      
      {gameState === 'waiting' && (
        <WaitingRoom
          gameId={gameId}
          playerId={playerId}
          onGameStart={handleGameReady}
          onLeaveGame={handleLeaveGame}
        />
      )}
      
      {gameState === 'playing' && (
        <Game
          gameId={gameId}
          playerId={playerId}
          onLeaveGame={handleLeaveGame}
        />
      )}
    </div>
  )
}

export default App
