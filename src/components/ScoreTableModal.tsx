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
  const tsumoD = tsumoRule === 'noloss'
    ? R(basic * 2) + R(basic / 2)
    : R(basic * 2)
  const tsumoK = tsumoRule === 'noloss'
    ? R(basic) + R(basic / 2)
    : R(basic)
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* ヘッダー */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">点数表</h2>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
              {(['ko', 'oya'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setWinnerType(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    winnerType === t ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t === 'ko' ? '子アガリ' : '親アガリ'}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold w-8 h-8 flex items-center justify-center">
              ✕
            </button>
          </div>
        </div>

        {/* テーブル */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 sticky top-0">
                <th className="border border-slate-200 px-2 py-2 text-slate-500 text-xs font-bold">符</th>
                {HAN_LIST.map(h => (
                  <th key={h} className="border border-slate-200 px-2 py-2 text-slate-700 font-bold">{h}翻</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FU_LIST.map(fu => (
                <tr key={fu} className="hover:bg-slate-50">
                  <td className="border border-slate-200 px-2 py-2 text-center font-bold text-slate-500 text-xs bg-slate-50 whitespace-nowrap">
                    {fu}符
                  </td>
                  {HAN_LIST.map(han => {
                    if (winnerType === 'ko') {
                      const cell = getCellKo(han, fu, tsumoRule)
                      if (!cell) return (
                        <td key={han} className="border border-slate-200 px-2 py-2 text-center text-slate-300 text-xs">—</td>
                      )
                      return (
                        <td key={han} className={`border border-slate-200 px-2 py-1.5 text-center ${cell.isMangan ? 'bg-emerald-50' : ''}`}>
                          {cell.isMangan && <div className="text-xs font-bold text-emerald-600">満貫</div>}
                          {!cell.isTsumoOnly
                            ? <div className={`font-bold ${cell.isMangan ? 'text-emerald-700' : 'text-slate-800'}`}>{fmt(cell.ron)}</div>
                            : <div className="text-xs text-slate-400">ツモのみ</div>
                          }
                          <div className="text-xs text-slate-500 mt-0.5">
                            親{fmt(cell.tsumoD)}/子{fmt(cell.tsumoK)}
                          </div>
                        </td>
                      )
                    } else {
                      const cell = getCellOya(han, fu, tsumoRule)
                      if (!cell) return (
                        <td key={han} className="border border-slate-200 px-2 py-2 text-center text-slate-300 text-xs">—</td>
                      )
                      return (
                        <td key={han} className={`border border-slate-200 px-2 py-1.5 text-center ${cell.isMangan ? 'bg-emerald-50' : ''}`}>
                          {cell.isMangan && <div className="text-xs font-bold text-emerald-600">満貫</div>}
                          {!cell.isTsumoOnly
                            ? <div className={`font-bold ${cell.isMangan ? 'text-emerald-700' : 'text-slate-800'}`}>{fmt(cell.ron)}</div>
                            : <div className="text-xs text-slate-400">ツモのみ</div>
                          }
                          <div className="text-xs text-slate-500 mt-0.5">各{fmt(cell.tsumoK)}</div>
                        </td>
                      )
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* 5翻以上 */}
          <div className="p-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-400 mb-3">5翻以上</div>
            <div className="grid grid-cols-5 gap-2">
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
                  <div key={level.label} className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
                    <div className="text-xs font-bold text-emerald-600 mb-1">{level.label}</div>
                    <div className="font-black text-emerald-700 text-base">{fmt(ron)}</div>
                    <div className="text-xs text-slate-500 mt-1">{tsumoLine}</div>
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
