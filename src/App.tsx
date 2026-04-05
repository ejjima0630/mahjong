import { useState, useEffect } from 'react'
import type { GameState, GameType } from './types/game'
import { createInitialState, loadState, saveState, clearState } from './utils/gameLogic'
import { GameSetup } from './components/GameSetup'
import { GameBoard } from './components/GameBoard'
import { GameEndScreen } from './components/GameEndScreen'

export default function App() {
  const [state, setState] = useState<GameState>(() => loadState() ?? createInitialState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const handleStart = (names: [string, string, string], gameType: GameType) => {
    const initial = createInitialState(gameType)
    initial.players = names.map(name => ({
      name,
      score: 35000,
      isRiichi: false,
    }))
    initial.phase = 'playing'
    setState(initial)
  }

  const handleEndGame = () => {
    setState(prev => ({ ...prev, phase: 'end' }))
  }

  const handleRestart = () => {
    clearState()
    setState(createInitialState())
  }

  if (state.phase === 'setup') {
    return <GameSetup onStart={handleStart} />
  }

  if (state.phase === 'end') {
    return <GameEndScreen players={state.players} onRestart={handleRestart} />
  }

  return (
    <GameBoard
      state={state}
      onStateChange={setState}
      onEndGame={handleEndGame}
    />
  )
}
