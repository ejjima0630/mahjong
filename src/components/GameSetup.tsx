import { useState } from 'react'

interface Props {
  onStart: (names: [string, string, string]) => void
}

export function GameSetup({ onStart }: Props) {
  const [names, setNames] = useState<[string, string, string]>([
    'プレイヤー1',
    'プレイヤー2',
    'プレイヤー3',
  ])

  const handleChange = (i: number, value: string) => {
    const next = [...names] as [string, string, string]
    next[i] = value
    setNames(next)
  }

  return (
    <div className="h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-black text-center text-slate-800 mb-1">三麻点数管理</h1>
        <p className="text-center text-slate-400 text-sm mb-8">初期点数 35,000点 ／ 半荘戦</p>

        <div className="space-y-3 mb-8">
          {names.map((name, i) => (
            <div key={i}>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Player {i + 1}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => handleChange(i, e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-800 focus:outline-none focus:border-emerald-400 transition-colors"
                placeholder={`プレイヤー${i + 1}`}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => onStart(names)}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-black text-xl py-4 rounded-xl transition-colors shadow-md"
        >
          ゲーム開始
        </button>
      </div>
    </div>
  )
}
