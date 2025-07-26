import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { 
  rollDice, 
  calculateScore, 
  createEmptyScorecard, 
  isGameComplete 
} from '../game/yazyLogic'
import Die from './Die'
import Scorecard from './Scorecard'
import './Game.css'

const Game = ({ gameId, playerId, onLeaveGame }) => {
  const [gameState, setGameState] = useState(null)
  const [currentDice, setCurrentDice] = useState([1, 1, 1, 1, 1])
  const [heldDice, setHeldDice] = useState([false, false, false, false, false])
  const [rollsLeft, setRollsLeft] = useState(3)
  const [loading, setLoading] = useState(true)

  // Load game state on mount
  useEffect(() => {
    loadGameState()
    
    // Subscribe to real-time updates with better configuration
    const channel = supabase
      .channel(`game-updates-${gameId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'games',
          filter: `id=eq.${gameId}`
        }, 
        (payload) => {
          console.log('Game received real-time update:', payload)
          handleGameUpdate(payload)
        }
      )
      .subscribe((status) => {
        console.log('Game subscription status:', status)
      })

    return () => {
      console.log('Game unsubscribing from channel')
      channel.unsubscribe()
    }
  }, [gameId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadGameState = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single()

      if (error) throw error
      setGameState(data)
    } catch (error) {
      console.error('Error loading game:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGameUpdate = (payload) => {
    setGameState(payload.new)
  }

  const handleRollDice = () => {
    if (rollsLeft <= 0 || !isMyTurn()) return

    const newDice = rollDice(5)
    const finalDice = newDice.map((die, index) => 
      heldDice[index] ? currentDice[index] : die
    )
    
    setCurrentDice(finalDice)
    setRollsLeft(prev => prev - 1)
  }

  const handleDieClick = (index) => {
    if (!isMyTurn() || rollsLeft === 3) return
    
    setHeldDice(prev => {
      const newHeld = [...prev]
      newHeld[index] = !newHeld[index]
      return newHeld
    })
  }

  const handleScoreSelect = async (category) => {
    console.log('Score select attempted:', { 
      category, 
      isMyTurn: isMyTurn(), 
      rollsLeft, 
      gameState: gameState?.current_turn,
      playerId 
    })

    // Can only score if it's my turn AND I've rolled at least once
    if (!isMyTurn()) {
      console.log('Not my turn, cannot score')
      return
    }
    
    if (rollsLeft === 3) {
      console.log('Must roll at least once before scoring')
      return
    }

    console.log('Attempting to score:', { category, rollsLeft, currentDice })
    const score = calculateScore(currentDice, category)
    const currentPlayer = getCurrentPlayer()
    const newScorecard = { ...currentPlayer.scorecard, [category]: score }

    console.log('Score calculation:', { score, newScorecard })

    try {
      const otherPlayerId = gameState.players.find(p => p.id !== playerId)?.id
      const isGameOver = isGameComplete(newScorecard)
      
      const updates = {
        players: gameState.players.map(p => 
          p.id === playerId 
            ? { ...p, scorecard: newScorecard }
            : p
        ),
        current_turn: isGameOver ? null : otherPlayerId,
        status: isGameOver ? 'completed' : 'active'
      }

      console.log('Updating database with:', updates)

      const { error } = await supabase
        .from('games')
        .update(updates)
        .eq('id', gameId)

      if (error) throw error

      console.log('Database updated successfully, resetting for next turn')

      // Reset for next turn
      setCurrentDice([1, 1, 1, 1, 1])
      setHeldDice([false, false, false, false, false])
      setRollsLeft(3)

    } catch (error) {
      console.error('Error updating score:', error)
    }
  }

  const isMyTurn = () => {
    return gameState?.current_turn === playerId
  }

  const getCurrentPlayer = () => {
    return gameState?.players?.find(p => p.id === playerId)
  }

  const getOtherPlayer = () => {
    return gameState?.players?.find(p => p.id !== playerId)
  }

  if (loading) {
    return <div className="game-loading">Loading game...</div>
  }

  if (!gameState) {
    return <div className="game-error">Game not found</div>
  }

  const currentPlayer = getCurrentPlayer()
  const otherPlayer = getOtherPlayer()
  const myTurn = isMyTurn()

  return (
    <div className="game">
      <div className="game-header">
        <h2>Yazy Game</h2>
        <button onClick={onLeaveGame} className="leave-btn">Leave Game</button>
      </div>

      <div className="game-status">
        {gameState.status === 'completed' ? (
          <div className="game-over">
            <h3>Game Over!</h3>
            <p>Winner: {/* Add winner logic */}</p>
          </div>
        ) : (
          <div className="turn-info">
            <h3>{myTurn ? "Your Turn" : `${otherPlayer?.name}'s Turn`}</h3>
            {myTurn && <p>Rolls left: {rollsLeft}</p>}
          </div>
        )}
      </div>

      <div className="game-content">
        {/* Dice Area */}
        <div className="dice-area">
          <div className="dice-container">
            {currentDice.map((die, index) => (
              <Die
                key={index}
                value={die}
                isHeld={heldDice[index]}
                onClick={() => handleDieClick(index)}
                disabled={!myTurn || rollsLeft === 3}
              />
            ))}
          </div>
          
          {myTurn && rollsLeft > 0 && (
            <button 
              className="roll-btn"
              onClick={handleRollDice}
            >
              {rollsLeft === 3 ? 'Start Rolling!' : `Roll Again (${rollsLeft} left)`}
            </button>
          )}
        </div>

        {/* Scorecards */}
        <div className="scorecards">
          {/* My Scorecard */}
          <div className="scorecard-container">
            <h4>Your Score ({currentPlayer?.name})</h4>
            <Scorecard
              scorecard={currentPlayer?.scorecard || createEmptyScorecard()}
              currentDice={myTurn && rollsLeft < 3 ? currentDice : null}
              onScoreSelect={handleScoreSelect}
              canScore={myTurn && rollsLeft < 3}
            />
          </div>

          {/* Opponent's Scorecard */}
          {otherPlayer && (
            <div className="scorecard-container">
              <h4>Opponent ({otherPlayer.name})</h4>
              <Scorecard
                scorecard={otherPlayer.scorecard || createEmptyScorecard()}
                currentDice={null}
                onScoreSelect={() => {}}
                canScore={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Game 
