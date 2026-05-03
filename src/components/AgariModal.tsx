import { useState, useMemo } from 'react'
import type { AgariInput, TsumoRule } from '../types/game'
import { FU_OPTIONS, HAN_OPTIONS, calcScorePreview, getScoreLevel, SCORE_LEVEL_LABEL } from '../utils/scoring'

interface Props {
  players: { name: string; score: number; isRiichi: boolean }[]
  dealerIndex: number
  honba: number
  kyoutaku: number
  tsumoRule: TsumoRule
  onConfirm: (input: AgariInput) => void
  onCancel: () => void
}

function selBtn(active: boolean, activeColor = 'var(--c-text)'): React.CSSProperties {
  return {
    padding: '0.75rem 0.25rem',
    background: active ? 'var(--c-surface2)' : 'none',
    color: active ? activeColor : 'var(--c-dim)',
    border: `1px solid ${active ? activeColor : 'var(--c-border)'}`,
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.1s',
    letterSpacing: '0.03em',
  }
}

const sectionLabel: React.CSSProperties = {
  fontSize: '0.8rem',
  letterSpacing: '0.12em',
  color: 'var(--c-dim)',
  marginBottom: '0.625rem',
  display: 'block',
}

export function AgariModal({ players, dealerIndex, honba, kyoutaku, tsumoRule, onConfirm, onCancel }: Props) {
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null)
  const [winType, setWinType] = useState<'tsumo' | 'ron'>('tsumo')
  const [ronTargetIndex, setRonTargetIndex] = useState<number | null>(null)
  const [han, setHan] = useState(1)
  const [fu, setFu] = useState(30)
  const [riichiIndices, setRiichiIndices] = useState<number[]>(
    players.map((p, i) => (p.isRiichi ? i : -1)).filter(i => i >= 0)
  )

  const toggleRiichi = (i: number) => {
    setRiichiIndices(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
  }

  const isDealer = winnerIndex !== null && winnerIndex === dealerIndex
  const needsFu = han <= 4

  const preview = useMemo(() => {
    if (winnerIndex === null) return null
    if (winType === 'ron' && ronTargetIndex === null) return null
    return calcScorePreview(han, fu, winType, isDealer, tsumoRule)
  }, [winnerIndex, winType, ronTargetIndex, han, fu, isDealer, tsumoRule])

  const canConfirm = winnerIndex !== null && (winType === 'tsumo' || ronTargetIndex !== null)

  const handleConfirm = () => {
    if (!canConfirm || winnerIndex === null) return
    onConfirm({ winnerIndex, winType, ronTargetIndex: winType === 'ron' ? ronTargetIndex : null, han, fu, riichiIndices })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem',
    }}>
      <div style={{
        background: 'var(--c-bg)',
        backgroundImage: 'none',
        width: '100%', maxWidth: '540px',
        maxHeight: '92vh', overflowY: 'auto',
        border: '1px solid var(--c-border)',
        borderRadius: '12px',
      }}>

        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--c-border)' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--c-text)' }}>
            アガリ入力
          </h2>
          {(honba > 0 || kyoutaku > 0) && (
            <p style={{ fontSize: '0.875rem', color: 'var(--c-dim)', marginTop: '0.25rem' }}>
              {honba > 0 && `${honba}本場　`}{kyoutaku > 0 && `供託${kyoutaku}本`}
            </p>
          )}
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* アガリ者 */}
          <section>
            <span style={sectionLabel}>アガリ者</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {players.map((p, i) => (
                <button key={i} onClick={() => setWinnerIndex(i)}
                  style={selBtn(winnerIndex === i, 'var(--c-accent)')}>
                  {i === dealerIndex ? '◆ ' : ''}{p.name}
                </button>
              ))}
            </div>
          </section>

          {/* ツモ / ロン */}
          <section>
            <span style={sectionLabel}>アガリ種類</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {(['tsumo', 'ron'] as const).map(t => (
                <button key={t} onClick={() => setWinType(t)}
                  style={{ ...selBtn(winType === t), fontSize: '1.25rem', padding: '0.875rem' }}>
                  {t === 'tsumo' ? 'ツモ' : 'ロン'}
                </button>
              ))}
            </div>
          </section>

          {/* 振込者 */}
          {winType === 'ron' && (
            <section>
              <span style={sectionLabel}>振込者</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {players.map((p, i) => {
                  if (i === winnerIndex) return <div key={i} />
                  return (
                    <button key={i} onClick={() => setRonTargetIndex(i)}
                      style={selBtn(ronTargetIndex === i, 'var(--c-red)')}>
                      {i === dealerIndex ? '◆ ' : ''}{p.name}
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {/* 翻数 */}
          <section>
            <span style={sectionLabel}>
              翻数
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {HAN_OPTIONS.map(h => (
                <button key={h} onClick={() => setHan(h)}
                  style={{ ...selBtn(han === h), width: '3.75rem', height: '3.5rem', padding: 0, fontSize: '0.9rem' }}>
                  {h}翻
                </button>
              ))}
            </div>
          </section>

          {/* 符数 */}
          {needsFu && (
            <section>
              <span style={sectionLabel}>符数</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {FU_OPTIONS.map(f => (
                  <button key={f} onClick={() => setFu(f)}
                    style={{ ...selBtn(fu === f), width: '4rem', height: '3.5rem', padding: 0, fontSize: '0.9rem' }}>
                    {f}符
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* リーチ */}
          <section>
            <span style={sectionLabel}>リーチしていた人</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {players.map((p, i) => (
                <button key={i} onClick={() => toggleRiichi(i)}
                  style={selBtn(riichiIndices.includes(i), 'var(--c-accent)')}>
                  {p.name}
                </button>
              ))}
            </div>
          </section>

          {/* プレビュー */}
          {preview && (
            <div style={{
              border: '1px solid var(--c-border)',
              borderRadius: '6px',
              padding: '1.125rem',
              textAlign: 'center',
              background: 'var(--c-surface)',
            }}>
              <p className="mono" style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--c-text)' }}>
                {preview}
              </p>
              {(honba > 0 || kyoutaku > 0) && (
                <p style={{ fontSize: '0.875rem', color: 'var(--c-dim)', marginTop: '0.25rem' }}>
                  {honba > 0 && `+本場 ${(honba * 200).toLocaleString()}`}
                  {honba > 0 && kyoutaku > 0 && '　'}
                  {kyoutaku > 0 && `+供託 ${(kyoutaku * 1000).toLocaleString()}`}
                </p>
              )}
            </div>
          )}

          {/* ボタン */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.625rem' }}>
            <button onClick={onCancel} style={{
              padding: '1.125rem',
              background: 'none',
              color: 'var(--c-dim)',
              border: '1px solid var(--c-border)',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.05em',
            }}>
              キャンセル
            </button>
            <button onClick={handleConfirm} disabled={!canConfirm} style={{
              padding: '1.125rem',
              background: canConfirm ? 'var(--c-accent)' : 'var(--c-surface2)',
              color: canConfirm ? '#fff' : 'var(--c-muted)',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 900,
              fontSize: '1.125rem',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              letterSpacing: '0.08em',
              transition: 'opacity 0.15s',
            }}>
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
