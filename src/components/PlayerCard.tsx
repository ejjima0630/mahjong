import { useAnimatedScore } from '../hooks/useAnimatedScore'

interface Props {
  name: string
  score: number
  rank: number
  isDealer: boolean
  isRiichi: boolean
  canRiichi: boolean
  onRiichi: () => void
}

export function PlayerCard({ name, score, rank, isDealer, isRiichi, canRiichi, onRiichi }: Props) {
  const { displayScore, delta } = useAnimatedScore(score)

  return (
    <div style={{
      background: rank === 1 ? 'rgba(156,107,46,0.08)' : 'var(--c-surface)',
      borderTop: isDealer ? '3px solid var(--c-accent)' : '3px solid transparent',
      borderLeft: isRiichi ? '4px solid var(--c-red)' : '4px solid transparent',
      borderRadius: '8px',
      padding: '1.25rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.875rem',
    }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '1.375rem',
          fontWeight: 700,
          color: isDealer ? 'var(--c-accent)' : 'var(--c-text)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          {isDealer && <span style={{ fontSize: '0.9rem', color: 'var(--c-accent)' }}>◆</span>}
          {name}
        </span>
        <span className="mono" style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: rank === 1 ? 'var(--c-accent)' : 'var(--c-muted)',
        }}>
          {rank}位
        </span>
      </div>

      <div style={{ position: 'relative', textAlign: 'center', padding: '0.75rem 0' }}>
        {delta !== null && (
          <span
            key={score}
            className="animate-delta-fade"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '-0.25rem',
              textAlign: 'center',
              fontSize: '1.375rem',
              fontWeight: 700,
              color: delta > 0 ? 'var(--c-pos)' : 'var(--c-red)',
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {delta > 0 ? '+' : ''}{delta.toLocaleString()}
          </span>
        )}
        <p className="mono" style={{
          fontSize: '3.5rem',
          fontWeight: 500,
          color: displayScore < 0 ? 'var(--c-red)' : 'var(--c-text)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {displayScore.toLocaleString()}
        </p>
      </div>

      <button
        onClick={onRiichi}
        disabled={!isRiichi && !canRiichi}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: isRiichi ? 'var(--c-red)' : 'none',
          color: isRiichi ? '#fff' : canRiichi ? 'var(--c-dim)' : 'var(--c-muted)',
          border: `1px solid ${isRiichi ? 'var(--c-red)' : 'var(--c-border)'}`,
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          cursor: !isRiichi && !canRiichi ? 'not-allowed' : 'pointer',
          opacity: !isRiichi && !canRiichi ? 0.4 : 1,
          fontFamily: 'inherit',
          transition: 'all 0.15s',
        }}
      >
        リーチ
      </button>
    </div>
  )
}
