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
    paymentDesc = `ノーテン ${notenPay.toLocaleString()}点 → テンパイ ${tenpaiGain.toLocaleString()}点`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-800">流局</h2>
        </div>

        <div className="p-5 space-y-5">
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">テンパイ / ノーテン</h3>
            <div className="grid grid-cols-3 gap-3">
              {players.map((p, i) => {
                const isTenpai = tenpaiIndices.includes(i)
                const isRiichi = p.isRiichi
                return (
                  <button key={i} onClick={() => toggle(i)}
                    className={`py-4 rounded-xl font-bold text-sm transition-all border-2 ${
                      isRiichi
                        ? 'bg-amber-400 text-white border-amber-400 cursor-default'
                        : isTenpai
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-blue-300'
                    }`}>
                    {i === dealerIndex ? '🎴 ' : ''}{p.name}
                    <br />
                    <span className="text-xs font-normal">
                      {isRiichi ? 'リーチ' : isTenpai ? 'テンパイ' : 'ノーテン'}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <div className={`rounded-xl p-3 text-center border ${
            tenpaiCount > 0 && tenpaiCount < 3
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <p className="font-bold">{paymentDesc}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={onCancel}
              className="py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
              キャンセル
            </button>
            <button onClick={() => onConfirm(tenpaiIndices)}
              className="py-4 rounded-xl font-bold text-white bg-slate-600 hover:bg-slate-500 transition-colors shadow-md">
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
