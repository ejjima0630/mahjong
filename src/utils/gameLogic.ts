import type { GameState, GameType, Round, TsumoRule, Wind } from '../types/game'

export const INITIAL_SCORE = 35000

export function createInitialState(gameType: GameType = 'hanchan', tsumoRule: TsumoRule = 'loss'): GameState {
  return {
    players: [
      { name: 'プレイヤー1', score: INITIAL_SCORE, isRiichi: false },
      { name: 'プレイヤー2', score: INITIAL_SCORE, isRiichi: false },
      { name: 'プレイヤー3', score: INITIAL_SCORE, isRiichi: false },
    ],
    round: { wind: 'east', number: 1, honba: 0 },
    kyoutaku: 0,
    dealerIndex: 0,
    phase: 'setup',
    gameType,
    tsumoRule,
  }
}

export function applyDeltas(state: GameState, deltas: number[]): GameState {
  return {
    ...state,
    players: state.players.map((p, i) => ({
      ...p,
      score: p.score + deltas[i],
    })),
  }
}

/**
 * アガリ後の局進行
 * dealerWon: 親がアガったか（連荘判定）
 * riichiIndices: リーチしていたプレイヤー（供託消費）
 */
export function advanceAfterAgari(
  state: GameState,
  dealerWon: boolean,
  riichiIndices: number[],
): GameState {
  // リーチ棒リセット
  const players = state.players.map((p, i) => ({
    ...p,
    isRiichi: false,
    // リーチ棒は既に供託として管理済み（アガリ時にデルタ適用済み）
  }))

  if (dealerWon) {
    // 連荘: 本場+1、局はそのまま
    return {
      ...state,
      players,
      round: { ...state.round, honba: state.round.honba + 1 },
      kyoutaku: 0, // アガリで供託はアガリ者が取得済み
    }
  } else {
    // 次の局へ
    return {
      ...state,
      players,
      round: nextRound(state.round),
      dealerIndex: (state.dealerIndex + 1) % 3,
      kyoutaku: 0,
    }
  }
}

/**
 * 流局後の局進行
 * dealerTenpai: 親がテンパイか（連荘判定）
 */
export function advanceAfterRyuukyoku(
  state: GameState,
  dealerTenpai: boolean,
): GameState {
  const players = state.players.map(p => ({ ...p, isRiichi: false }))

  if (dealerTenpai) {
    // 連荘
    return {
      ...state,
      players,
      round: { ...state.round, honba: state.round.honba + 1 },
      // 供託はそのまま積み上がる
    }
  } else {
    // 親ノーテン: 次の局へ、本場+1
    return {
      ...state,
      players,
      round: nextRound(state.round, state.round.honba + 1),
      dealerIndex: (state.dealerIndex + 1) % 3,
    }
  }
}

function nextRound(current: Round, honba = 0): Round {
  if (current.number < 3) {
    return { wind: current.wind, number: (current.number + 1) as 1 | 2 | 3, honba }
  }
  if (current.wind === 'east') {
    return { wind: 'south', number: 1, honba }
  }
  // 南3局終了 → ゲーム終了はApp側で判定
  return { wind: 'south', number: 3, honba: current.honba }
}

export function isLastRound(round: Round, gameType: GameType = 'hanchan'): boolean {
  if (gameType === 'tonpuusen') {
    return round.wind === 'east' && round.number === 3
  }
  return round.wind === 'south' && round.number === 3
}

export function roundLabel(round: Round, dealerIndex: number): string {
  const windChar = round.wind === 'east' ? '東' : '南'
  return `${windChar}${round.number}局`
}

export function getRankings(players: { name: string; score: number }[]): number[] {
  // 各プレイヤーの順位を返す（1-indexed）
  const sorted = [...players].sort((a, b) => b.score - a.score)
  return players.map(p => sorted.findIndex(s => s === p) + 1)
}

export function loadState(): GameState | null {
  try {
    const saved = localStorage.getItem('mahjong-state')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function saveState(state: GameState): void {
  localStorage.setItem('mahjong-state', JSON.stringify(state))
}

export function clearState(): void {
  localStorage.removeItem('mahjong-state')
}
