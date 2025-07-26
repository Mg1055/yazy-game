import React from 'react'
import { 
  CATEGORIES, 
  CATEGORY_NAMES, 
  calculateTotalScore,
  getPossibleScores 
} from '../game/yazyLogic'
import './Scorecard.css'

const Scorecard = ({ scorecard, currentDice, onScoreSelect, canScore }) => {
  const possibleScores = currentDice ? getPossibleScores(currentDice, scorecard) : {}
  const totals = calculateTotalScore(scorecard)

  const upperCategories = [
    CATEGORIES.ONES,
    CATEGORIES.TWOS,
    CATEGORIES.THREES,
    CATEGORIES.FOURS,
    CATEGORIES.FIVES,
    CATEGORIES.SIXES
  ]

  const lowerCategories = [
    CATEGORIES.THREE_OF_A_KIND,
    CATEGORIES.FOUR_OF_A_KIND,
    CATEGORIES.FULL_HOUSE,
    CATEGORIES.SMALL_STRAIGHT,
    CATEGORIES.LARGE_STRAIGHT,
    CATEGORIES.YAZY,
    CATEGORIES.CHANCE
  ]

  const renderScoreRow = (category) => {
    const currentScore = scorecard[category]
    const possibleScore = possibleScores[category]
    const isScored = currentScore !== undefined
    const canSelectThis = canScore && !isScored

    const handleRowClick = () => {
      console.log('Scorecard row clicked:', { 
        category, 
        canSelectThis, 
        canScore, 
        isScored, 
        possibleScore 
      })
      if (canSelectThis) {
        onScoreSelect(category)
      }
    }

    return (
      <tr 
        key={category}
        className={`score-row ${canSelectThis ? 'selectable' : ''} ${isScored ? 'scored' : ''}`}
        onClick={handleRowClick}
      >
        <td className="category-name">{CATEGORY_NAMES[category]}</td>
        <td className="score-value">
          {isScored ? currentScore : (canSelectThis && possibleScore !== undefined ? possibleScore : '—')}
        </td>
      </tr>
    )
  }

  return (
    <div className="scorecard">
      <h3>Scorecard</h3>
      
      {/* Upper Section */}
      <div className="score-section">
        <h4>Upper Section</h4>
        <table>
          <tbody>
            {upperCategories.map(renderScoreRow)}
          </tbody>
        </table>
        <div className="section-totals">
          <div>Sum: {totals.upperSum}</div>
          <div>Bonus (63+): {totals.upperBonus}</div>
          <div><strong>Upper Total: {totals.upperSum + totals.upperBonus}</strong></div>
        </div>
      </div>

      {/* Lower Section */}
      <div className="score-section">
        <h4>Lower Section</h4>
        <table>
          <tbody>
            {lowerCategories.map(renderScoreRow)}
          </tbody>
        </table>
        <div className="section-totals">
          <div><strong>Lower Total: {totals.lowerSum}</strong></div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="grand-total">
        <strong>Grand Total: {totals.total}</strong>
      </div>
    </div>
  )
}

export default Scorecard 
