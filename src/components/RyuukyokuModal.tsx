import { useState } from 'react'

interface Props {
  players: { name: string; isRiichi: boolean }[]
  dealerIndex: number
  onConfirm: (tenpaiIndices: number[]) => void
  onCancel: () => void
}

export function RyuukyokuModal({ players, dealerIndex, onConfirm, onCancel }: Props) {
  const riichiIndices = players.map((p, i) => (p.isRiichi ? i : -1)).filter(i => i >= 0)
  const [tenpaiIndices, setTenpaiIndices] = useState<number[]>(riichiIndices)

  const toggle = (i: number) => {
    if (players[i].isRiichi) return
    setTenpaiIndices(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
  }

  const tenpaiCount = tenpaiIndices.length
  const notenCount = 3 - tenpaiCount

  let paymentDesc = '点数移動なし'
  if (tenpaiCount > 0 && tenpaiCount < 3) {
    const notenPay = Math.round(3000 / notenCount)
    const tenpaiGain = Math.round(3000 / tenpaiCount)
    paymentDesc = `ノーテン ${notenPay.toLocaleString()} → テンパイ +${tenpaiGain.toLocaleString()}`
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem',
    }}>
      <div style={{
        background: 'var(--c-bg)',
        width: '100%', maxWidth: '440px',
        border: '1px solid var(--c-border)',
        borderRadius: '12px',
      }}>

        <div style={{ padding: '1.125rem 1.5rem', borderBottom: '1px solid var(--c-border)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--c-text)' }}>
            流局
          </h2>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <section>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--c-dim)', marginBottom: '0.625rem', display: 'block' }}>
              テンパイ / ノーテン
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {players.map((p, i) => {
                const isTenpai = tenpaiIndices.includes(i)
                const isRiichi = p.isRiichi
                return (
                  <button key={i} onClick={() => toggle(i)}
                    style={{
                      padding: '0.875rem 0.25rem',
                      background: isRiichi || isTenpai ? 'var(--c-surface2)' : 'none',
                      color: isRiichi ? 'var(--c-accent)' : isTenpai ? 'var(--c-text)' : 'var(--c-dim)',
                      border: `1px solid ${isRiichi ? 'var(--c-accent)' : isTenpai ? 'var(--c-text)' : 'var(--c-border)'}`,
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: isRiichi ? 'default' : 'pointer',
                      fontFamily: 'inherit',
                      lineHeight: 1.5,
                    }}>
                    {i === dealerIndex ? '◆ ' : ''}{p.name}
                    <br />
                    <span style={{ fontSize: '0.7rem', fontWeight: 400, opacity: 0.75 }}>
                      {isRiichi ? 'リーチ' : isTenpai ? 'テンパイ' : 'ノーテン'}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <div style={{
            border: '1px solid var(--c-border)',
            borderRadius: '6px',
            padding: '0.875rem',
            textAlign: 'center',
            background: tenpaiCount > 0 && tenpaiCount < 3 ? 'var(--c-surface)' : 'none',
          }}>
            <p className="mono" style={{ fontSize: '0.9rem', color: tenpaiCount > 0 && tenpaiCount < 3 ? 'var(--c-text)' : 'var(--c-dim)' }}>
              {paymentDesc}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
            <button onClick={onCancel} style={{
              padding: '1rem',
              background: 'none',
              color: 'var(--c-dim)',
              border: '1px solid var(--c-border)',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.05em',
            }}>
              キャンセル
            </button>
            <button onClick={() => onConfirm(tenpaiIndices)} style={{
              padding: '1rem',
              background: 'var(--c-text)',
              color: 'var(--c-bg)',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 900,
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.05em',
            }}>
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
