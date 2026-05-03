import { useState } from 'react'
import type { TsumoRule } from '../types/game'
import { getScoreLevel } from '../utils/scoring'

const R = (n: number) => Math.ceil(n / 100) * 100
const fmt = (n: number) => n.toLocaleString()

type WinnerType = 'ko' | 'oya'

interface Props {
  tsumoRule: TsumoRule
  onClose: () => void
}

const FU_LIST = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]
const HAN_LIST = [1, 2, 3, 4]

const MANGAN_LEVELS = [
  { label: '満貫',   koRon: 8000,  oyaRon: 12000 },
  { label: '跳満',   koRon: 12000, oyaRon: 18000 },
  { label: '倍満',   koRon: 16000, oyaRon: 24000 },
  { label: '三倍満', koRon: 24000, oyaRon: 36000 },
  { label: '役満',   koRon: 32000, oyaRon: 48000 },
]

function getCellKo(han: number, fu: number, tsumoRule: TsumoRule) {
  if ((fu === 20 || fu === 25) && han === 1) return null
  const level = getScoreLevel(han, fu)
  const basic = level !== 'normal' ? 2000 : fu * Math.pow(2, han + 2)
  const ron = level !== 'normal' ? 8000 : R(basic * 4)
  const tsumoD = tsumoRule === 'noloss' ? R(basic * 2) + R(basic / 2) : R(basic * 2)
  const tsumoK = tsumoRule === 'noloss' ? R(basic) + R(basic / 2) : R(basic)
  return { ron, tsumoD, tsumoK, isMangan: level !== 'normal', isTsumoOnly: fu === 20 }
}

function getCellOya(han: number, fu: number, tsumoRule: TsumoRule) {
  if ((fu === 20 || fu === 25) && han === 1) return null
  const level = getScoreLevel(han, fu)
  const basic = level !== 'normal' ? 2000 : fu * Math.pow(2, han + 2)
  const ron = level !== 'normal' ? 12000 : R(basic * 6)
  const tsumoK = tsumoRule === 'noloss' ? R(basic * 3) : R(basic * 2)
  return { ron, tsumoK, isMangan: level !== 'normal', isTsumoOnly: fu === 20 }
}

export function ScoreTableModal({ tsumoRule, onClose }: Props) {
  const [winnerType, setWinnerType] = useState<WinnerType>('ko')

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem',
    }}>
      <div style={{
        background: 'var(--c-surface)',
        width: '100%', maxWidth: '680px',
        maxHeight: '88vh',
        border: '1px solid var(--c-border)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>

        <div style={{
          padding: '0.875rem 1.25rem',
          borderBottom: '1px solid var(--c-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--c-text)' }}>
            点数表
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0', border: '1px solid var(--c-border)' }}>
              {(['ko', 'oya'] as const).map(t => (
                <button key={t} onClick={() => setWinnerType(t)} style={{
                  padding: '0.3rem 0.875rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: winnerType === t ? 'var(--c-text)' : 'none',
                  color: winnerType === t ? 'var(--c-bg)' : 'var(--c-dim)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '0.05em',
                  transition: 'all 0.1s',
                }}>
                  {t === 'ko' ? '子' : '親'}
                </button>
              ))}
            </div>
            <button onClick={onClose} style={{
              background: 'none',
              border: '1px solid var(--c-border)',
              borderRadius: '6px',
              color: 'var(--c-dim)',
              width: '1.75rem',
              height: '1.75rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              ✕
            </button>
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, background: 'var(--c-surface2)' }}>
                <th style={{ padding: '0.5rem 0.625rem', borderBottom: '1px solid var(--c-border)', color: 'var(--c-dim)', fontWeight: 700, textAlign: 'center', fontSize: '0.65rem' }}>符</th>
                {HAN_LIST.map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.625rem', borderBottom: '1px solid var(--c-border)', color: 'var(--c-text)', fontWeight: 700, textAlign: 'center' }}>
                    {h}翻
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FU_LIST.map((fu, rowIdx) => (
                <tr key={fu} style={{ background: rowIdx % 2 === 0 ? 'none' : 'var(--c-surface2)' }}>
                  <td style={{ padding: '0.5rem 0.625rem', borderBottom: '1px solid var(--c-border)', color: 'var(--c-dim)', fontWeight: 700, textAlign: 'center', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                    {fu}符
                  </td>
                  {HAN_LIST.map(han => {
                    if (winnerType === 'ko') {
                      const cell = getCellKo(han, fu, tsumoRule)
                      if (!cell) return (
                        <td key={han} style={{ padding: '0.5rem 0.625rem', borderBottom: '1px solid var(--c-border)', textAlign: 'center', color: 'var(--c-muted)' }}>—</td>
                      )
                      return (
                        <td key={han} style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid var(--c-border)', textAlign: 'center' }}>
                          {cell.isMangan && (
                            <div style={{ fontSize: '0.55rem', color: 'var(--c-accent)', marginBottom: '0.1rem' }}>満貫</div>
                          )}
                          {!cell.isTsumoOnly
                            ? <div className="mono" style={{ fontWeight: 700, color: cell.isMangan ? 'var(--c-accent)' : 'var(--c-text)' }}>
                                {fmt(cell.ron)}
                              </div>
                            : <div style={{ fontSize: '0.6rem', color: 'var(--c-muted)' }}>ツモのみ</div>
                          }
                          <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--c-dim)', marginTop: '0.1rem' }}>
                            親{fmt(cell.tsumoD)}/子{fmt(cell.tsumoK)}
                          </div>
                        </td>
                      )
                    } else {
                      const cell = getCellOya(han, fu, tsumoRule)
                      if (!cell) return (
                        <td key={han} style={{ padding: '0.5rem 0.625rem', borderBottom: '1px solid var(--c-border)', textAlign: 'center', color: 'var(--c-muted)' }}>—</td>
                      )
                      return (
                        <td key={han} style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid var(--c-border)', textAlign: 'center' }}>
                          {cell.isMangan && (
                            <div style={{ fontSize: '0.55rem', color: 'var(--c-accent)', marginBottom: '0.1rem' }}>満貫</div>
                          )}
                          {!cell.isTsumoOnly
                            ? <div className="mono" style={{ fontWeight: 700, color: cell.isMangan ? 'var(--c-accent)' : 'var(--c-text)' }}>
                                {fmt(cell.ron)}
                              </div>
                            : <div style={{ fontSize: '0.6rem', color: 'var(--c-muted)' }}>ツモのみ</div>
                          }
                          <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--c-dim)', marginTop: '0.1rem' }}>
                            各{fmt(cell.tsumoK)}
                          </div>
                        </td>
                      )
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* 5翻以上 */}
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--c-border)' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--c-dim)', marginBottom: '0.75rem' }}>
              5翻以上
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.375rem' }}>
              {MANGAN_LEVELS.map(level => {
                const ron = winnerType === 'ko' ? level.koRon : level.oyaRon
                const basic = level.koRon / 4
                let tsumoLine: string
                if (winnerType === 'ko') {
                  const d = tsumoRule === 'noloss' ? R(basic * 2) + R(basic / 2) : R(basic * 2)
                  const k = tsumoRule === 'noloss' ? R(basic) + R(basic / 2) : R(basic)
                  tsumoLine = `親${fmt(d)}/子${fmt(k)}`
                } else {
                  const each = tsumoRule === 'noloss' ? R(basic * 3) : R(basic * 2)
                  tsumoLine = `各${fmt(each)}`
                }
                return (
                  <div key={level.label} style={{
                    border: '1px solid var(--c-border)',
                    padding: '0.625rem',
                    textAlign: 'center',
                    background: 'var(--c-surface2)',
                  }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--c-accent)', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
                      {level.label}
                    </div>
                    <div className="mono" style={{ fontWeight: 700, color: 'var(--c-text)', fontSize: '0.875rem' }}>
                      {fmt(ron)}
                    </div>
                    <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--c-dim)', marginTop: '0.25rem' }}>
                      {tsumoLine}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
