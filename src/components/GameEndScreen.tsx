import type { GameType } from '../types/game'
import { getRankings } from '../utils/gameLogic'

interface Props {
  players: { name: string; score: number }[]
  gameType: GameType
  onRestart: () => void
}

export function GameEndScreen({ players, gameType, onRestart }: Props) {
  const rankings = getRankings(players)
  const sorted = players
    .map((p, i) => ({ ...p, rank: rankings[i] }))
    .sort((a, b) => a.rank - b.rank)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'var(--c-surface)', padding: '2.5rem', border: '1px solid var(--c-border)', borderRadius: '12px' }}>

        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--c-dim)' }}>
            {gameType === 'hanchan' ? '半荘' : '東風'}終了
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--c-muted)', marginTop: '0.25rem', letterSpacing: '0.1em' }}>
            最終結果
          </p>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          {sorted.map((p, i) => (
            <div key={p.name} style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              padding: '1.25rem 0',
              borderBottom: '1px solid var(--c-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem' }}>
                <span className="mono" style={{
                  fontSize: '1rem',
                  color: i === 0 ? 'var(--c-accent)' : 'var(--c-muted)',
                  minWidth: '1.5rem',
                  fontWeight: 700,
                }}>
                  {p.rank}
                </span>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: i === 0 ? 'var(--c-text)' : 'var(--c-dim)',
                }}>
                  {p.name}
                </span>
              </div>
              <span className="mono" style={{
                fontSize: '1.875rem',
                fontWeight: 700,
                color: p.score < 0 ? 'var(--c-red)' : i === 0 ? 'var(--c-text)' : 'var(--c-dim)',
              }}>
                {p.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onRestart}
          style={{
            width: '100%',
            padding: '1.25rem',
            background: 'var(--c-accent)',
            color: '#fff',
            fontWeight: 900,
            fontSize: '1.125rem',
            letterSpacing: '0.18em',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'inherit',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          もう一回
        </button>
      </div>
    </div>
  )
}
