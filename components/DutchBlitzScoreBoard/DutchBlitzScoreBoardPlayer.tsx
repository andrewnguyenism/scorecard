import { forwardRef } from 'react'

interface Props {
  blitzScore: number
  dutchScore: number
  name: string
  place?: number
  playerIsCurrentUser?: boolean
  totalScore: number
}

export const DutchBlitzScoreBoardPlayer = forwardRef<HTMLDivElement, Props>(
  (
    { blitzScore, dutchScore, name, place, playerIsCurrentUser, totalScore },
    ref
  ) => (
    <div className="flex items-center px-4 py-2" ref={ref}>
      <div className="flex items-center w-8/12">
        {place && place >= 0 && place <= 2 && (
          <span className="w-8 font-bold">
            {place === 1 && <span>🥇</span>}
            {place === 2 && <span>🥈</span>}
            {place === 3 && <span>🥉</span>}
          </span>
        )}
        {name}
        {playerIsCurrentUser && <span className="text-xs ml-1">(You)</span>}
      </div>
      <div className="w-12 text-center">{dutchScore || 0}</div>
      <div className="w-12 text-center">{blitzScore || 0}</div>
      <div className="w-12 text-center text-lg font-bold">
        {totalScore || 0}
      </div>
    </div>
  )
)

DutchBlitzScoreBoardPlayer.displayName = 'DutchBlitzScoreBoardPlayer'
