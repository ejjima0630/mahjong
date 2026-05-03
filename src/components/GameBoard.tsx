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
  onUndo?: () => void
}

const ghostBtn: React.CSSProperties = {
  fontSize: '1rem',
  color: 'var(--c-dim)',
  background: 'none',
  border: '1px solid var(--c-border)',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  fontFamily: 'inherit',
  letterSpacing: '0.05em',
  transition: 'color 0.15s',
}

export function GameBoard({ state, onStateChange, onEndGame, onUndo }: Props) {
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      gap: '1rem',
    }}>

      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--c-surface)',
        padding: '0.875rem 1.25rem',
        borderBottom: '2px solid var(--c-border)',
        borderRadius: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem' }}>
          <span className="mono" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--c-text)', letterSpacing: '-0.01em' }}>
            {windLabel}{round.number}局
          </span>
          {round.honba > 0 && (
            <span style={{ fontSize: '1.125rem', color: 'var(--c-dim)', fontWeight: 500 }}>{round.honba}本場</span>
          )}
          <span style={{ fontSize: '0.875rem', color: 'var(--c-muted)' }}>
            {state.gameType === 'hanchan' ? '半荘' : '東風'}
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--c-muted)' }}>
            ツモ損{state.tsumoRule === 'loss' ? 'あり' : 'なし'}
          </span>
        </div>

        {kyoutaku > 0 && (
          <span className="mono" style={{ fontSize: '1.125rem', color: 'var(--c-accent)', fontWeight: 700 }}>
            供託 {(kyoutaku * 1000).toLocaleString()}
          </span>
        )}

        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button onClick={() => setModal('scoreTable')} style={ghostBtn}>点数表</button>
          {onUndo && (
            <button onClick={onUndo} style={{ ...ghostBtn, color: 'var(--c-accent)', borderColor: 'var(--c-accent)' }}>
              やり直し
            </button>
          )}
          <button onClick={onEndGame} style={ghostBtn}>終了</button>
        </div>
      </div>

      {/* プレイヤーカード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem', flex: 1 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <button
          onClick={() => setModal('agari')}
          style={{
            padding: '1.625rem',
            background: 'var(--c-accent)',
            color: '#fff',
            fontWeight: 900,
            fontSize: '1.75rem',
            letterSpacing: '0.15em',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          アガリ
        </button>
        <button
          onClick={() => setModal('ryuukyoku')}
          style={{
            padding: '1.625rem',
            background: 'none',
            color: 'var(--c-dim)',
            fontWeight: 700,
            fontSize: '1.375rem',
            letterSpacing: '0.08em',
            border: '1px solid var(--c-border)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-dim)')}
        >
          流局
        </button>
      </div>

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
        <ScoreTableModal tsumoRule={state.tsumoRule} onClose={() => setModal(null)} />
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
