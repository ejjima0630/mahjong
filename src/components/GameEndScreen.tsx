import { getRankings } from '../utils/gameLogic'

interface Props {
  players: { name: string; score: number }[]
  onRestart: () => void
}

const RANK_CONFIG = [
  { emoji: '🥇', bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-600' },
  { emoji: '🥈', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-500' },
  { emoji: '🥉', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-500' },
]

export function GameEndScreen({ players, onRestart }: Props) {
  const rankings = getRankings(players)
  const sorted = players
    .map((p, i) => ({ ...p, rank: rankings[i] }))
    .sort((a, b) => a.rank - b.rank)

  return (
    <div className="h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-black text-center text-slate-800 mb-1">半荘終了</h2>
        <p className="text-center text-slate-400 text-sm mb-8">最終結果</p>

        <div className="space-y-3 mb-8">
          {sorted.map((p, i) => {
            const cfg = RANK_CONFIG[i]
            return (
              <div
                key={p.name}
                className={`flex items-center justify-between border-2 rounded-xl px-5 py-4 ${cfg.bg} ${cfg.border}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cfg.emoji}</span>
                  <span className="font-bold text-xl text-slate-800">{p.name}</span>
                </div>
                <span className={`text-2xl font-black tabular-nums ${
                  p.score < 0 ? 'text-red-600' : cfg.text
                }`}>
                  {p.score.toLocaleString()}
                  <span className="text-base font-bold ml-1">点</span>
                </span>
              </div>
            )
          })}
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-black text-xl py-4 rounded-xl transition-colors shadow-md"
        >
          もう一回
        </button>
      </div>
    </div>
  )
}
