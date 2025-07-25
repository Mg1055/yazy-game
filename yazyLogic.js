// Yazy Game Logic

export const CATEGORIES = {
  // Upper section
  ONES: 'ones',
  TWOS: 'twos', 
  THREES: 'threes',
  FOURS: 'fours',
  FIVES: 'fives',
  SIXES: 'sixes',
  
  // Lower section
  THREE_OF_A_KIND: 'threeOfAKind',
  FOUR_OF_A_KIND: 'fourOfAKind',
  FULL_HOUSE: 'fullHouse',
  SMALL_STRAIGHT: 'smallStraight',
  LARGE_STRAIGHT: 'largeStraight',
  YAZY: 'yazy',
  CHANCE: 'chance'
}

export const CATEGORY_NAMES = {
  [CATEGORIES.ONES]: 'Ones',
  [CATEGORIES.TWOS]: 'Twos', 
  [CATEGORIES.THREES]: 'Threes',
  [CATEGORIES.FOURS]: 'Fours',
  [CATEGORIES.FIVES]: 'Fives',
  [CATEGORIES.SIXES]: 'Sixes',
  [CATEGORIES.THREE_OF_A_KIND]: 'Three of a Kind',
  [CATEGORIES.FOUR_OF_A_KIND]: 'Four of a Kind',
  [CATEGORIES.FULL_HOUSE]: 'Full House',
  [CATEGORIES.SMALL_STRAIGHT]: 'Small Straight',
  [CATEGORIES.LARGE_STRAIGHT]: 'Large Straight',
  [CATEGORIES.YAZY]: 'Yazy',
  [CATEGORIES.CHANCE]: 'Chance'
}

// Roll 5 dice
export const rollDice = (count = 5) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1)
}

// Count occurrences of each die value
const countDice = (dice) => {
  const counts = [0, 0, 0, 0, 0, 0, 0] // index 0 unused, 1-6 for die values
  dice.forEach(die => counts[die]++)
  return counts
}

// Check if dice contains a straight of given length
const hasStraight = (dice, length) => {
  const sorted = [...new Set(dice)].sort((a, b) => a - b)
  
  for (let i = 0; i <= sorted.length - length; i++) {
    let consecutive = 1
    for (let j = i + 1; j < sorted.length && consecutive < length; j++) {
      if (sorted[j] === sorted[j-1] + 1) {
        consecutive++
      } else {
        break
      }
    }
    if (consecutive >= length) return true
  }
  return false
}

// Calculate score for a given category and dice combination
export const calculateScore = (dice, category) => {
  const counts = countDice(dice)
  const sum = dice.reduce((a, b) => a + b, 0)
  
  switch (category) {
    case CATEGORIES.ONES:
      return counts[1] * 1
    case CATEGORIES.TWOS:
      return counts[2] * 2
    case CATEGORIES.THREES:
      return counts[3] * 3
    case CATEGORIES.FOURS:
      return counts[4] * 4
    case CATEGORIES.FIVES:
      return counts[5] * 5
    case CATEGORIES.SIXES:
      return counts[6] * 6
    
    case CATEGORIES.THREE_OF_A_KIND:
      return counts.some(count => count >= 3) ? sum : 0
    
    case CATEGORIES.FOUR_OF_A_KIND:
      return counts.some(count => count >= 4) ? sum : 0
    
    case CATEGORIES.FULL_HOUSE: {
      const hasThree = counts.some(count => count === 3)
      const hasTwo = counts.some(count => count === 2)
      const hasFive = counts.some(count => count === 5)
      return (hasThree && hasTwo) || hasFive ? 25 : 0
    }
    
    case CATEGORIES.SMALL_STRAIGHT:
      return hasStraight(dice, 4) ? 30 : 0
    
    case CATEGORIES.LARGE_STRAIGHT:
      return hasStraight(dice, 5) ? 40 : 0
    
    case CATEGORIES.YAZY:
      return counts.some(count => count === 5) ? 50 : 0
    
    case CATEGORIES.CHANCE:
      return sum
    
    default:
      return 0
  }
}

// Calculate total score including bonuses
export const calculateTotalScore = (scorecard) => {
  const upperSection = [
    CATEGORIES.ONES, CATEGORIES.TWOS, CATEGORIES.THREES,
    CATEGORIES.FOURS, CATEGORIES.FIVES, CATEGORIES.SIXES
  ]
  
  const upperSum = upperSection.reduce((sum, category) => {
    return sum + (scorecard[category] || 0)
  }, 0)
  
  const upperBonus = upperSum >= 63 ? 35 : 0
  
  const lowerSection = [
    CATEGORIES.THREE_OF_A_KIND, CATEGORIES.FOUR_OF_A_KIND,
    CATEGORIES.FULL_HOUSE, CATEGORIES.SMALL_STRAIGHT,
    CATEGORIES.LARGE_STRAIGHT, CATEGORIES.YAZY, CATEGORIES.CHANCE
  ]
  
  const lowerSum = lowerSection.reduce((sum, category) => {
    return sum + (scorecard[category] || 0)
  }, 0)
  
  return {
    upperSum,
    upperBonus,
    lowerSum,
    total: upperSum + upperBonus + lowerSum
  }
}

// Get all possible scores for current dice (for UI hints)
export const getPossibleScores = (dice, scorecard) => {
  const scores = {}
  
  Object.values(CATEGORIES).forEach(category => {
    if (scorecard[category] === undefined) { // Category not yet scored
      scores[category] = calculateScore(dice, category)
    }
  })
  
  return scores
}

// Check if game is complete
export const isGameComplete = (scorecard) => {
  return Object.values(CATEGORIES).every(category => 
    scorecard[category] !== undefined
  )
}

// Create initial empty scorecard
export const createEmptyScorecard = () => {
  const scorecard = {}
  Object.values(CATEGORIES).forEach(category => {
    scorecard[category] = undefined
  })
  return scorecard
} 
