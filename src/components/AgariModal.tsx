import { useState, useMemo } from 'react'
import type { AgariInput } from '../types/game'
import { FU_OPTIONS, HAN_OPTIONS, calcScorePreview, getScoreLevel, SCORE_LEVEL_LABEL } from '../utils/scoring'

interface Props {
  players: { name: string; score: number; isRiichi: boolean }[]
  dealerIndex: number
  honba: number
  kyoutaku: number
  onConfirm: (input: AgariInput) => void
  onCancel: () => void
}

export function AgariModal({ players, dealerIndex, honba, kyoutaku, onConfirm, onCancel }: Props) {
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
  const level = getScoreLevel(han, fu)
  const levelLabel = level !== 'normal' ? SCORE_LEVEL_LABEL[level] : ''
  const needsFu = han <= 4

  const preview = useMemo(() => {
    if (winnerIndex === null) return null
    if (winType === 'ron' && ronTargetIndex === null) return null
    return calcScorePreview(han, fu, winType, isDealer)
  }, [winnerIndex, winType, ronTargetIndex, han, fu, isDealer])

  const canConfirm = winnerIndex !== null && (winType === 'tsumo' || ronTargetIndex !== null)

  const handleConfirm = () => {
    if (!canConfirm || winnerIndex === null) return
    onConfirm({ winnerIndex, winType, ronTargetIndex: winType === 'ron' ? ronTargetIndex : null, han, fu, riichiIndices })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">

        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-800">アガリ入力</h2>
          {(honba > 0 || kyoutaku > 0) && (
            <p className="text-sm text-slate-400 mt-0.5">
              {honba > 0 && `${honba}本場 `}{kyoutaku > 0 && `供託${kyoutaku}本`}
            </p>
          )}
        </div>

        <div className="p-5 space-y-5">
          {/* アガリ者 */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">アガリ者</h3>
            <div className="grid grid-cols-3 gap-2">
              {players.map((p, i) => (
                <button key={i} onClick={() => setWinnerIndex(i)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                    winnerIndex === i
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}>
                  {i === dealerIndex ? '🎴 ' : ''}{p.name}
                </button>
              ))}
            </div>
          </section>

          {/* ツモ / ロン */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">アガリ種類</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['tsumo', 'ron'] as const).map(t => (
                <button key={t} onClick={() => setWinType(t)}
                  className={`py-3 rounded-xl font-black text-xl transition-all border-2 ${
                    winType === t
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                  }`}>
                  {t === 'tsumo' ? 'ツモ' : 'ロン'}
                </button>
              ))}
            </div>
          </section>

          {/* 振込者 */}
          {winType === 'ron' && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">振込者</h3>
              <div className="grid grid-cols-3 gap-2">
                {players.map((p, i) => {
                  if (i === winnerIndex) return <div key={i} />
                  return (
                    <button key={i} onClick={() => setRonTargetIndex(i)}
                      className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                        ronTargetIndex === i
                          ? 'bg-red-500 text-white border-red-500 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-red-300'
                      }`}>
                      {i === dealerIndex ? '🎴 ' : ''}{p.name}
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {/* 翻数 */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              翻数
              {levelLabel && (
                <span className="ml-2 text-emerald-600 normal-case font-black">【{levelLabel}】</span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {HAN_OPTIONS.map(h => (
                <button key={h} onClick={() => setHan(h)}
                  className={`w-12 h-12 rounded-xl font-bold text-sm transition-all border-2 ${
                    han === h
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}>
                  {h}翻
                </button>
              ))}
            </div>
          </section>

          {/* 符数 */}
          {needsFu && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">符数</h3>
              <div className="flex flex-wrap gap-2">
                {FU_OPTIONS.map(f => (
                  <button key={f} onClick={() => setFu(f)}
                    className={`w-14 h-12 rounded-xl font-bold text-sm transition-all border-2 ${
                      fu === f
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}>
                    {f}符
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* リーチ */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">リーチしていた人</h3>
            <div className="grid grid-cols-3 gap-2">
              {players.map((p, i) => (
                <button key={i} onClick={() => toggleRiichi(i)}
                  className={`py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    riichiIndices.includes(i)
                      ? 'bg-amber-400 text-white border-amber-400 shadow-md'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-300'
                  }`}>
                  {p.name}
                </button>
              ))}
            </div>
          </section>

          {/* プレビュー */}
          {preview && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <p className="text-emerald-800 font-black text-xl">{preview}</p>
              {(honba > 0 || kyoutaku > 0) && (
                <p className="text-emerald-600 text-sm mt-1">
                  {honba > 0 && `+本場 ${(honba * 200).toLocaleString()}点`}
                  {honba > 0 && kyoutaku > 0 && '　'}
                  {kyoutaku > 0 && `+供託 ${(kyoutaku * 1000).toLocaleString()}点`}
                </p>
              )}
            </div>
          )}

          {/* ボタン */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button onClick={onCancel}
              className="py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
              キャンセル
            </button>
            <button onClick={handleConfirm} disabled={!canConfirm}
              className={`py-4 rounded-xl font-bold text-white transition-all ${
                canConfirm
                  ? 'bg-emerald-500 hover:bg-emerald-400 shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}>
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
