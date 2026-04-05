import { useState, useEffect } from 'react'
import type { GameState, GameType, TsumoRule } from './types/game'
import { createInitialState, loadState, saveState, clearState } from './utils/gameLogic'
import { GameSetup } from './components/GameSetup'
import { GameBoard } from './components/GameBoard'
import { GameEndScreen } from './components/GameEndScreen'

export default function App() {
  const [state, setState] = useState<GameState>(() => loadState() ?? createInitialState())
  const [prevState, setPrevState] = useState<GameState | null>(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  const handleStateChange = (newState: GameState) => {
    setPrevState(state)
    setState(newState)
  }

  const handleUndo = () => {
    if (prevState) {
      setState(prevState)
      setPrevState(null)
    }
  }

  const handleStart = (names: [string, string, string], gameType: GameType, tsumoRule: TsumoRule) => {
    const initial = createInitialState(gameType, tsumoRule)
    initial.players = names.map(name => ({
      name,
      score: 35000,
      isRiichi: false,
    }))
    initial.phase = 'playing'
    setPrevState(null)
    setState(initial)
  }

  const handleEndGame = () => {
    setPrevState(state)
    setState(prev => ({ ...prev, phase: 'end' }))
  }

  const handleRestart = () => {
    clearState()
    setPrevState(null)
    setState(createInitialState())
  }

  if (state.phase === 'setup') {
    return <GameSetup onStart={handleStart} />
  }

  if (state.phase === 'end') {
    return <GameEndScreen players={state.players} gameType={state.gameType} onRestart={handleRestart} />
  }

  return (
    <GameBoard
      state={state}
      onStateChange={handleStateChange}
      onEndGame={handleEndGame}
      onUndo={prevState ? handleUndo : undefined}
    />
  )
}
