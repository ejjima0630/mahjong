interface Props {
  wind: 'east' | 'south'
  roundNumber: number
  honba: number
  kyoutaku: number
  onAgari: () => void
  onRyuukyoku: () => void
  onEndGame: () => void
}

export function GameCenter({ wind, roundNumber, honba, kyoutaku, onAgari, onRyuukyoku, onEndGame }: Props) {
  const windLabel = wind === 'east' ? '東' : '南'

  return (
    <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col items-center justify-between p-4">
      {/* 局情報 */}
      <div className="text-center space-y-1">
        <p className="text-3xl font-black text-slate-800 leading-none">
          {windLabel}{roundNumber}局
        </p>
        <p className={`text-sm font-bold px-3 py-0.5 rounded-full inline-block ${
          honba > 0 ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-400'
        }`}>
          {honba}本場
        </p>
        {kyoutaku > 0 && (
          <p className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-0.5 rounded-full">
            供託 {kyoutaku}本
          </p>
        )}
      </div>

      {/* アクションボタン */}
      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={onAgari}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-black text-lg py-3 rounded-xl shadow-sm transition-colors"
        >
          アガリ
        </button>
        <button
          onClick={onRyuukyoku}
          className="w-full bg-slate-500 hover:bg-slate-400 active:bg-slate-600 text-white font-black text-lg py-3 rounded-xl shadow-sm transition-colors"
        >
          流　局
        </button>
      </div>

      {/* 終了ボタン */}
      <button
        onClick={onEndGame}
        className="text-slate-300 hover:text-slate-500 text-xs font-bold transition-colors"
      >
        半荘終了
      </button>
    </div>
  )
}
