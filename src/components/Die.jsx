import React from 'react'
import './Die.css'

const Die = ({ value, isHeld, onClick, disabled }) => {
  const getDieFace = (value) => {
    const faces = {
      1: '⚀',
      2: '⚁', 
      3: '⚂',
      4: '⚃',
      5: '⚄',
      6: '⚅'
    }
    return faces[value] || '?'
  }

  return (
    <button
      className={`die ${isHeld ? 'held' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="die-face">{getDieFace(value)}</span>
      {isHeld && <div className="held-indicator">HELD</div>}
    </button>
  )
}

export default Die 
