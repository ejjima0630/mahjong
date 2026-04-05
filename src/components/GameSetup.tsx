import { useState } from 'react'
import type { GameType } from '../types/game'

interface Props {
  onStart: (names: [string, string, string], gameType: GameType) => void
}

export function GameSetup({ onStart }: Props) {
  const [names, setNames] = useState<[string, string, string]>([
    'プレイヤー1',
    'プレイヤー2',
    'プレイヤー3',
  ])
  const [gameType, setGameType] = useState<GameType>('hanchan')

  const handleChange = (i: number, value: string) => {
    const next = [...names] as [string, string, string]
    next[i] = value
    setNames(next)
  }

  return (
    <div className="h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-black text-center text-slate-800 mb-1">三麻点数管理</h1>
        <p className="text-center text-slate-400 text-sm mb-8">初期点数 35,000点</p>

        {/* 東風 / 半荘 選択 */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            ゲーム形式
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setGameType('tonpuusen')}
              className={`py-3 rounded-xl font-black text-lg transition-all border-2 ${
                gameType === 'tonpuusen'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
              }`}
            >
              東風戦
            </button>
            <button
              onClick={() => setGameType('hanchan')}
              className={`py-3 rounded-xl font-black text-lg transition-all border-2 ${
                gameType === 'hanchan'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
              }`}
            >
              半荘戦
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {names.map((name, i) => (
            <div key={i}>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                プレイヤー {i + 1}
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
          onClick={() => onStart(names, gameType)}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-black text-xl py-4 rounded-xl transition-colors shadow-md"
        >
          ゲーム開始
        </button>
      </div>
    </div>
  )
}
