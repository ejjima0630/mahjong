import { useState } from 'react'
import type { GameState, AgariInput } from '../types/game'
import { calcAgariDeltas, calcRyuukyokuDeltas } from '../utils/scoring'
import {
  applyDeltas,
  advanceAfterAgari,
  advanceAfterRyuukyoku,
  isLastRound,
  getRankings,
} from '../utils/gameLogic'
import { AgariModal } from './AgariModal'
import { RyuukyokuModal } from './RyuukyokuModal'
import { PlayerCard } from './PlayerCard'
import { ScoreTableModal } from './ScoreTableModal'

type Modal = 'agari' | 'ryuukyoku' | 'scoreTable' | null

interface Props {
  state: GameState
  onStateChange: (state: GameState) => void
  onEndGame: () => void
}

export function GameBoard({ state, onStateChange, onEndGame }: Props) {
  const [modal, setModal] = useState<Modal>(null)
  const { players, round, kyoutaku, dealerIndex } = state
  const rankings = getRankings(players)

  const handleRiichi = (playerIndex: number) => {
    const player = players[playerIndex]
    if (player.isRiichi) {
      const deltas = [0, 0, 0]
      deltas[playerIndex] = 1000
      onStateChange({
        ...applyDeltas(state, deltas),
        kyoutaku: state.kyoutaku - 1,
        players: applyDeltas(state, deltas).players.map((p, i) => ({
          ...p, isRiichi: i === playerIndex ? false : p.isRiichi,
        })),
      })
    } else {
      if (player.score < 1000) return
      const deltas = [0, 0, 0]
      deltas[playerIndex] = -1000
      onStateChange({
        ...applyDeltas(state, deltas),
        kyoutaku: state.kyoutaku + 1,
        players: applyDeltas(state, deltas).players.map((p, i) => ({
          ...p, isRiichi: i === playerIndex ? true : p.isRiichi,
        })),
      })
    }
  }

  const handleAgari = (input: AgariInput) => {
    const deltas = calcAgariDeltas(
      input.han, input.fu, input.winType,
      input.winnerIndex, dealerIndex,
      input.ronTargetIndex, round.honba, state.kyoutaku, state.tsumoRule,
    )
    let next = applyDeltas(state, deltas)
    next = advanceAfterAgari(next, input.winnerIndex === dealerIndex, input.riichiIndices)
    next.kyoutaku = 0
    if (isLastRound(state.round, state.gameType) && input.winnerIndex !== dealerIndex) {
      onStateChange({ ...next, phase: 'end' })
    } else {
      onStateChange(next)
    }
    setModal(null)
  }

  const handleRyuukyoku = (tenpaiIndices: number[]) => {
    const deltas = calcRyuukyokuDeltas(tenpaiIndices)
    let next = applyDeltas(state, deltas)
    const dealerTenpai = tenpaiIndices.includes(dealerIndex)
    next = advanceAfterRyuukyoku(next, dealerTenpai)
    if (isLastRound(state.round, state.gameType) && !dealerTenpai) {
      onStateChange({ ...next, phase: 'end' })
    } else {
      onStateChange(next)
    }
    setModal(null)
  }

  const windLabel = round.wind === 'east' ? '東' : '南'

  return (
    <div className="min-h-screen bg-green-900 flex flex-col p-4 gap-4">

      {/* ヘッダー */}
      <div className="flex items-center justify-between bg-green-800 rounded-xl px-5 py-3">
        <div className="text-white">
          <span className="text-2xl font-bold">{windLabel}{round.number}局</span>
          {round.honba > 0 && (
            <span className="ml-3 text-lg opacity-80">{round.honba}本場</span>
          )}
        </div>
        {kyoutaku > 0 && (
          <span className="bg-yellow-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
            供託 {kyoutaku}本 ({(kyoutaku * 1000).toLocaleString()}点)
          </span>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setModal('scoreTable')}
            className="text-white/60 hover:text-white text-sm border border-white/30 rounded-lg px-3 py-1 transition-colors"
          >
            点数表
          </button>
          <button
            onClick={onEndGame}
            className="text-white/60 hover:text-white text-sm border border-white/30 rounded-lg px-3 py-1 transition-colors"
          >
            終了
          </button>
        </div>
      </div>

      {/* プレイヤーカード */}
      <div className="grid grid-cols-3 gap-3 flex-1">
        {players.map((player, i) => (
          <PlayerCard
            key={i}
            name={player.name}
            score={player.score}
            rank={rankings[i]}
            isDealer={i === dealerIndex}
            isRiichi={player.isRiichi}
            canRiichi={player.score >= 1000}
            onRiichi={() => handleRiichi(i)}
          />
        ))}
      </div>

      {/* アクションボタン */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setModal('agari')}
          className="bg-green-500 hover:bg-green-400 text-white font-black text-2xl py-6 rounded-2xl shadow-lg transition-colors"
        >
          アガリ
        </button>
        <button
          onClick={() => setModal('ryuukyoku')}
          className="bg-gray-500 hover:bg-gray-400 text-white font-black text-2xl py-6 rounded-2xl shadow-lg transition-colors"
        >
          流　局
        </button>
      </div>

      {/* モーダル */}
      {modal === 'agari' && (
        <AgariModal
          players={players}
          dealerIndex={dealerIndex}
          honba={round.honba}
          kyoutaku={kyoutaku}
          tsumoRule={state.tsumoRule}
          onConfirm={handleAgari}
          onCancel={() => setModal(null)}
        />
      )}
      {modal === 'scoreTable' && (
        <ScoreTableModal
          tsumoRule={state.tsumoRule}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'ryuukyoku' && (
        <RyuukyokuModal
          players={players}
          dealerIndex={dealerIndex}
          onConfirm={handleRyuukyoku}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  )
}
