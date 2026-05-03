import { useState } from 'react'
import type { GameType, TsumoRule } from '../types/game'

interface Props {
  onStart: (names: [string, string, string], gameType: GameType, tsumoRule: TsumoRule) => void
}

function tabBtn(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    paddingTop: '0.5rem',
    paddingBottom: '0.875rem',
    marginBottom: '-1px',
    fontSize: '1.25rem',
    fontWeight: 700,
    textAlign: 'left',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--c-accent)' : '2px solid transparent',
    color: active ? 'var(--c-text)' : 'var(--c-muted)',
    cursor: 'pointer',
    letterSpacing: '0.03em',
    transition: 'color 0.15s',
    fontFamily: 'inherit',
  }
}

export function GameSetup({ onStart }: Props) {
  const [names, setNames] = useState<[string, string, string]>(['プレイヤー1', 'プレイヤー2', 'プレイヤー3'])
  const [gameType, setGameType] = useState<GameType>('hanchan')
  const [tsumoRule, setTsumoRule] = useState<TsumoRule>('loss')

  const handleChange = (i: number, value: string) => {
    const next = [...names] as [string, string, string]
    next[i] = value
    setNames(next)
  }

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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--c-text)' }}>
            三麻点数管理
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--c-dim)', marginTop: '0.375rem' }}>
            初期点数 35,000
          </p>
        </div>

        <div>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--c-dim)', marginBottom: '0.75rem' }}>ゲーム形式</p>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--c-border)', marginBottom: '2rem' }}>
            {(['tonpuusen', 'hanchan'] as const).map(type => (
              <button key={type} onClick={() => setGameType(type)} style={tabBtn(gameType === type)}>
                {type === 'tonpuusen' ? '東風戦' : '半荘戦'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--c-dim)', marginBottom: '0.75rem' }}>ツモ損</p>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--c-border)', marginBottom: '2.25rem' }}>
            {([['loss', 'ツモ損あり'], ['noloss', 'ツモ損なし']] as const).map(([rule, label]) => (
              <button key={rule} onClick={() => setTsumoRule(rule)} style={tabBtn(tsumoRule === rule)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--c-dim)', marginBottom: '0.75rem' }}>プレイヤー</p>
          {names.map((name, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', borderBottom: '1px solid var(--c-border)', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--c-muted)', minWidth: '1.25rem', fontFamily: "'Roboto', sans-serif", fontWeight: 700 }}>
                {i + 1}
              </span>
              <input
                type="text"
                value={name}
                onChange={e => handleChange(i, e.target.value)}
                placeholder={`プレイヤー${i + 1}`}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--c-text)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  padding: '0.75rem 0',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => onStart(names, gameType, tsumoRule)}
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
          ゲーム開始
        </button>

      </div>
    </div>
  )
}
