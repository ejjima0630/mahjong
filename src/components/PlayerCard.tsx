import { useAnimatedScore } from '../hooks/useAnimatedScore'

interface Props {
  name: string
  score: number
  rank: number
  isDealer: boolean
  isRiichi: boolean
  canRiichi: boolean
  onRiichi: () => void
}

const RANK_COLORS = ['text-yellow-400', 'text-gray-300', 'text-orange-400']

export function PlayerCard({ name, score, rank, isDealer, isRiichi, canRiichi, onRiichi }: Props) {
  const { displayScore, delta } = useAnimatedScore(score)

  return (
    <div className={`bg-white rounded-2xl p-4 flex flex-col gap-3 ${
      isDealer ? 'ring-4 ring-yellow-400' : ''
    }`}>
      {/* 名前・親マーク・順位 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800 text-lg">{name}</span>
          {isDealer && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
              親
            </span>
          )}
        </div>
        <span className={`text-3xl font-black ${RANK_COLORS[rank - 1]}`}>{rank}位</span>
      </div>

      {/* 点数 */}
      <div className="text-center relative py-2">
        {delta !== null && (
          <span
            key={score}
            className={`absolute inset-x-0 -top-3 text-xl font-black animate-delta-fade ${
              delta > 0 ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {delta > 0 ? '+' : ''}{delta.toLocaleString()}
          </span>
        )}
        <p className={`text-4xl font-black tabular-nums ${
          displayScore < 0 ? 'text-red-600' : 'text-gray-900'
        }`}>
          {displayScore.toLocaleString()}
        </p>
      </div>

      {/* リーチ棒 */}
      <button
        onClick={onRiichi}
        disabled={!isRiichi && !canRiichi}
        className={`w-full transition-all duration-150 rounded-xl ${
          !isRiichi && !canRiichi
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:opacity-80 active:scale-95 cursor-pointer'
        }`}
      >
        <img
          src={isRiichi ? '/reach.png' : '/no_reach.png'}
          alt={isRiichi ? 'リーチ中' : 'ノーリーチ'}
          className="w-full object-contain"
        />
      </button>
    </div>
  )
}
