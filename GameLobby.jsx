import React, { useState } from 'react'
import { supabase } from '../supabase'
import { createEmptyScorecard } from '../game/yazyLogic'
import { v4 as uuidv4 } from 'uuid'
import './GameLobby.css'

const GameLobby = ({ onGameStart }) => {
  const [playerName, setPlayerName] = useState('')
  const [gameCode, setGameCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const createGame = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const gameId = uuidv4()
      const playerId = uuidv4()
      
      const gameData = {
        id: gameId,
        status: 'waiting',
        current_turn: null,
        players: [{
          id: playerId,
          name: playerName.trim(),
          scorecard: createEmptyScorecard()
        }],
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('games')
        .insert([gameData])

      if (error) throw error

      onGameStart(gameId, playerId)

    } catch (error) {
      console.error('Error creating game:', error)
      setError('Failed to create game. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const joinGame = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name')
      return
    }

    if (!gameCode.trim()) {
      setError('Please enter a game code')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get current game state
      const { data: gameData, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameCode.trim())
        .single()

      if (fetchError || !gameData) {
        throw new Error('Game not found')
      }

      if (gameData.status !== 'waiting') {
        throw new Error('Game is no longer accepting players')
      }

      if (gameData.players.length >= 2) {
        throw new Error('Game is full')
      }

      // Add player to game
      const playerId = uuidv4()
      const updatedPlayers = [...gameData.players, {
        id: playerId,
        name: playerName.trim(),
        scorecard: createEmptyScorecard()
      }]

      const { error: updateError } = await supabase
        .from('games')
        .update({
          players: updatedPlayers,
          status: 'active',
          current_turn: gameData.players[0].id // First player starts
        })
        .eq('id', gameCode.trim())

      if (updateError) throw updateError

      onGameStart(gameCode.trim(), playerId)

    } catch (error) {
      console.error('Error joining game:', error)
      setError(error.message || 'Failed to join game. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="game-lobby">
      <div className="lobby-container">
        <h1>🎲 Yazy Game</h1>
        <p>Play the classic dice game online with friends!</p>

        <div className="name-input">
          <label htmlFor="playerName">Your Name:</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="lobby-actions">
          <div className="action-section">
            <h3>Create New Game</h3>
            <p>Start a new game and share the code with a friend</p>
            <button 
              onClick={createGame}
              disabled={loading}
              className="create-btn"
            >
              {loading ? 'Creating...' : 'Create Game'}
            </button>
          </div>

          <div className="divider">OR</div>

          <div className="action-section">
            <h3>Join Existing Game</h3>
            <p>Enter the game code shared by your friend</p>
            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              placeholder="Enter game code"
              className="game-code-input"
            />
            <button 
              onClick={joinGame}
              disabled={loading}
              className="join-btn"
            >
              {loading ? 'Joining...' : 'Join Game'}
            </button>
          </div>
        </div>

        <div className="game-rules">
          <h4>How to Play:</h4>
          <ul>
            <li>Roll 5 dice up to 3 times per turn</li>
            <li>Hold dice between rolls to keep them</li>
            <li>Score in different categories for points</li>
            <li>Complete all categories to finish the game</li>
            <li>Highest total score wins!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default GameLobby 
