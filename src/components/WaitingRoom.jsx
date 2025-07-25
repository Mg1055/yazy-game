import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import './WaitingRoom.css'

const WaitingRoom = ({ gameId, playerId, onGameStart, onLeaveGame }) => {
  const [gameState, setGameState] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGameState()
    
    // Subscribe to real-time updates with better configuration
    const channel = supabase
      .channel(`game-changes-${gameId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'games',
          filter: `id=eq.${gameId}`
        }, 
        (payload) => {
          console.log('Received real-time update:', payload)
          handleGameUpdate(payload)
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
      })

    return () => {
      console.log('Unsubscribing from channel')
      channel.unsubscribe()
    }
  }, [gameId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Add polling as backup in case real-time doesn't work
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState?.status === 'waiting') {
        console.log('Polling for game state update...')
        loadGameState()
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }, [gameState?.status]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadGameState = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single()

      if (error) throw error
      
      console.log('Loaded game state:', data)
      setGameState(data)

      // If game is active (someone joined), start the game
      if (data.status === 'active') {
        console.log('Game is active, starting game...')
        onGameStart()
      }
    } catch (error) {
      console.error('Error loading game:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGameUpdate = (payload) => {
    const newGameState = payload.new
    console.log('Game state updated:', newGameState)
    setGameState(newGameState)

    // If game becomes active, start playing
    if (newGameState.status === 'active') {
      console.log('Game became active, starting game...')
      onGameStart()
    }
  }

  const copyGameCode = () => {
    navigator.clipboard.writeText(gameId)
    // You could add a toast notification here
  }

  const leaveGame = async () => {
    try {
      // Delete the game since we're the only player
      await supabase
        .from('games')
        .delete()
        .eq('id', gameId)
      
      onLeaveGame()
    } catch (error) {
      console.error('Error leaving game:', error)
      onLeaveGame() // Leave anyway
    }
  }

  if (loading) {
    return (
      <div className="waiting-room">
        <div className="waiting-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="waiting-room">
      <div className="waiting-container">
        <h2>🎲 Waiting for Player</h2>
        <p>You created a new game!</p>
        
        <div className="game-info">
          <div className="player-info">
            <h3>Players ({gameState?.players?.length || 0}/2)</h3>
            <div className="player-list">
              {gameState?.players?.map((player) => (
                <div key={player.id} className="player-item">
                  <span className="player-name">{player.name}</span>
                  {player.id === playerId && <span className="you-badge">You</span>}
                </div>
              ))}
              {(!gameState?.players || gameState.players.length < 2) && (
                <div className="player-item waiting">
                  <span className="player-name">Waiting for player...</span>
                </div>
              )}
            </div>
          </div>

          <div className="game-code-section">
            <h3>Game Code</h3>
            <div className="game-code-display">
              <code className="game-code">{gameId}</code>
              <button onClick={copyGameCode} className="copy-btn">
                📋 Copy
              </button>
            </div>
            <p className="share-instructions">
              Share this code with your friend so they can join the game!
            </p>
          </div>
        </div>

        <div className="waiting-actions">
          <button onClick={leaveGame} className="leave-btn">
            Cancel Game
          </button>
        </div>

        <div className="waiting-animation">
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Waiting for someone to join...</p>
          <p><small>Game Status: {gameState?.status || 'unknown'}</small></p>
        </div>
      </div>
    </div>
  )
}

export default WaitingRoom 
