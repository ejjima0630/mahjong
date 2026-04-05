import { useState, useEffect, useRef } from 'react'

const ANIMATE_DURATION = 500 // スコアカウントアップの時間(ms)
const DELTA_DISPLAY_MS = 2000 // 増減バッジの表示時間(ms)

export function useAnimatedScore(targetScore: number) {
  const [displayScore, setDisplayScore] = useState(targetScore)
  const [delta, setDelta] = useState<number | null>(null)

  const displayRef = useRef(targetScore)
  const animRef = useRef<number>(0)
  const deltaTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const startScore = displayRef.current
    const diff = targetScore - startScore
    if (diff === 0) return

    // 増減バッジ表示
    setDelta(diff)
    if (deltaTimerRef.current) clearTimeout(deltaTimerRef.current)
    deltaTimerRef.current = setTimeout(() => setDelta(null), DELTA_DISPLAY_MS)

    // 前のアニメーションをキャンセル
    if (animRef.current) cancelAnimationFrame(animRef.current)

    const startTime = performance.now()

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / ANIMATE_DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current = Math.round(startScore + diff * eased)

      displayRef.current = current
      setDisplayScore(current)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        displayRef.current = targetScore
        setDisplayScore(targetScore)
      }
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [targetScore])

  return { displayScore, delta }
}
