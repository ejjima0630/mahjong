import type { ScoreLevel, TsumoRule } from '../types/game'

const roundUp100 = (n: number) => Math.ceil(n / 100) * 100

export function getScoreLevel(han: number, fu: number): ScoreLevel {
  if (han >= 13) return 'yakuman'
  if (han >= 11) return 'sanbaiman'
  if (han >= 8) return 'baiman'
  if (han >= 6) return 'haneman'
  if (han >= 5) return 'mangan'
  // 切り上げ満貫: roundUp100(basic×4) >= 7700 → 満貫
  const basic = fu * Math.pow(2, han + 2)
  if (roundUp100(basic * 4) >= 7700) return 'mangan'
  return 'normal'
}

// 満貫以上の基本支払額テーブル
const MANGAN_TABLE: Record<ScoreLevel, { koRon: number; oyaRon: number; koTsumoKo: number; koTsumoOya: number; oyaTsumoKo: number }> = {
  normal:    { koRon: 0,     oyaRon: 0,     koTsumoKo: 0,    koTsumoOya: 0,    oyaTsumoKo: 0 },
  mangan:    { koRon: 8000,  oyaRon: 12000, koTsumoKo: 2000, koTsumoOya: 4000, oyaTsumoKo: 4000 },
  haneman:   { koRon: 12000, oyaRon: 18000, koTsumoKo: 3000, koTsumoOya: 6000, oyaTsumoKo: 6000 },
  baiman:    { koRon: 16000, oyaRon: 24000, koTsumoKo: 4000, koTsumoOya: 8000, oyaTsumoKo: 8000 },
  sanbaiman: { koRon: 24000, oyaRon: 36000, koTsumoKo: 6000, koTsumoOya: 12000, oyaTsumoKo: 12000 },
  yakuman:   { koRon: 32000, oyaRon: 48000, koTsumoKo: 8000, koTsumoOya: 16000, oyaTsumoKo: 16000 },
}

function getBasePayments(han: number, fu: number, tsumoRule: TsumoRule = 'loss') {
  const level = getScoreLevel(han, fu)
  const basic = level !== 'normal'
    ? MANGAN_TABLE[level].koRon / 4
    : fu * Math.pow(2, han + 2)
  const koRon   = level !== 'normal' ? MANGAN_TABLE[level].koRon  : roundUp100(basic * 4)
  const oyaRon  = level !== 'normal' ? MANGAN_TABLE[level].oyaRon : roundUp100(basic * 6)

  if (tsumoRule === 'noloss') {
    return {
      koRon,
      oyaRon,
      koTsumoKo:  roundUp100(basic)     + roundUp100(basic / 2),
      koTsumoOya: roundUp100(basic * 2) + roundUp100(basic / 2),
      oyaTsumoKo: roundUp100(basic * 3),
    }
  }
  return {
    koRon,
    oyaRon,
    koTsumoKo:  roundUp100(basic),
    koTsumoOya: roundUp100(basic * 2),
    oyaTsumoKo: roundUp100(basic * 2),
  }
}

/**
 * アガリ時の各プレイヤーの点数変動を返す（index 0〜2、正=増加・負=減少）
 */
export function calcAgariDeltas(
  han: number,
  fu: number,
  winType: 'tsumo' | 'ron',
  winnerIndex: number,
  dealerIndex: number,
  ronTargetIndex: number | null,
  honba: number,
  kyoutaku: number,
  tsumoRule: TsumoRule = 'loss',
): number[] {
  const deltas = [0, 0, 0]
  const base = getBasePayments(han, fu, tsumoRule)
  const isDealer = winnerIndex === dealerIndex
  const others = [0, 1, 2].filter(i => i !== winnerIndex)

  if (winType === 'ron' && ronTargetIndex !== null) {
    const payment = (isDealer ? base.oyaRon : base.koRon) + honba * 200
    deltas[ronTargetIndex] -= payment
    deltas[winnerIndex] += payment
  } else {
    // ツモ
    if (isDealer) {
      // 親ツモ: 各子が oyaTsumoKo + honba×100
      for (const i of others) {
        const payment = base.oyaTsumoKo + honba * 100
        deltas[i] -= payment
        deltas[winnerIndex] += payment
      }
    } else {
      // 子ツモ: 親は koTsumoOya、もう一人の子は koTsumoKo
      for (const i of others) {
        const payment = (i === dealerIndex ? base.koTsumoOya : base.koTsumoKo) + honba * 100
        deltas[i] -= payment
        deltas[winnerIndex] += payment
      }
    }
  }

  // 供託
  deltas[winnerIndex] += kyoutaku * 1000

  return deltas
}

/**
 * 流局時の各プレイヤーの点数変動
 * テンパイ人数に応じて3000点を山分け
 */
export function calcRyuukyokuDeltas(tenpaiIndices: number[]): number[] {
  const deltas = [0, 0, 0]
  const notenIndices = [0, 1, 2].filter(i => !tenpaiIndices.includes(i))
  const tenpaiCount = tenpaiIndices.length
  const notenCount = notenIndices.length

  if (tenpaiCount === 0 || tenpaiCount === 3) return deltas

  // 各ノーテンが払う額 / 各テンパイが受け取る額
  const notenPay = 3000 / notenCount
  const tenpaiGain = 3000 / tenpaiCount

  for (const i of notenIndices) deltas[i] -= notenPay
  for (const i of tenpaiIndices) deltas[i] += tenpaiGain

  return deltas
}

export function calcScorePreview(
  han: number,
  fu: number,
  winType: 'tsumo' | 'ron',
  isDealer: boolean,
  tsumoRule: TsumoRule = 'loss',
): string {
  const base = getBasePayments(han, fu, tsumoRule)
  const level = getScoreLevel(han, fu)
  if (winType === 'ron') {
    const total = isDealer ? base.oyaRon : base.koRon
    return `${total.toLocaleString()}点`
  } else {
    if (isDealer) {
      return `${base.oyaTsumoKo.toLocaleString()}点オール`
    } else {
      return `${base.koTsumoKo.toLocaleString()} / ${base.koTsumoOya.toLocaleString()}点`
    }
  }
}

export const SCORE_LEVEL_LABEL: Record<ScoreLevel, string> = {
  normal: '',
  mangan: '満貫',
  haneman: '跳満',
  baiman: '倍満',
  sanbaiman: '三倍満',
  yakuman: '役満',
}

export const FU_OPTIONS = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]
export const HAN_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
