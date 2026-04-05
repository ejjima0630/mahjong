export type Wind = 'east' | 'south'

export type GameType = 'hanchan' | 'tonpuusen'

export type TsumoRule = 'loss' | 'noloss'

export interface Player {
  name: string
  score: number
  isRiichi: boolean
}

export interface Round {
  wind: Wind
  number: 1 | 2 | 3
  honba: number
}

export type GamePhase = 'setup' | 'playing' | 'end'

export type WinType = 'tsumo' | 'ron'

export interface AgariInput {
  winnerIndex: number
  winType: WinType
  ronTargetIndex: number | null
  han: number
  fu: number
  riichiIndices: number[]
}

export interface RyuukyokuInput {
  tenpaiIndices: number[]
}

export interface GameState {
  players: Player[]
  round: Round
  kyoutaku: number
  dealerIndex: number
  phase: GamePhase
  gameType: GameType
  tsumoRule: TsumoRule
}

export type ScoreLevel =
  | 'normal'
  | 'mangan'
  | 'haneman'
  | 'baiman'
  | 'sanbaiman'
  | 'yakuman'

export interface PaymentResult {
  payments: { fromIndex: number; amount: number }[]
  kyoutakuGain: number
}
