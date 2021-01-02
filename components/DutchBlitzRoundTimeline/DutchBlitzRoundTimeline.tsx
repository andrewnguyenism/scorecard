import { DutchBlitzRoundInfo } from '@/firebase/round'
import { FunctionComponent } from 'react'

import {
  DutchBlitzScoreBoardHeader,
  DutchBlitzScoreBoardPlayer,
} from '../DutchBlitzScoreBoard'

interface Props {
  currentUserId?: string
  rounds: Array<DutchBlitzRoundInfo & { id: string }>
}

export const DutchBlitzRoundTimeline: FunctionComponent<Props> = ({
  currentUserId,
  rounds,
}) => (
  <div>
    <div className="text-center uppercase text-lg font-bold">
      Round Timeline
    </div>
    {rounds ? (
      rounds.reverse().map((round, index) => {
        if (round.players) {
          const currentUserRound = Object.entries(round.players).find(
            ([playerId]) => playerId === currentUserId
          )
          if (currentUserRound) {
            const [, currentUserScores] = currentUserRound
            return (
              <div
                className="m-4 rounded-2xl overflow-hidden border-2"
                key={round.id}
              >
                <DutchBlitzScoreBoardHeader
                  round={Math.abs(index - Object.keys(rounds).length)}
                />
                <DutchBlitzScoreBoardPlayer
                  blitzScore={currentUserScores.blitzScore}
                  dutchScore={currentUserScores.dutchScore}
                  name=""
                  totalScore={currentUserScores.totalScore}
                />
              </div>
            )
          }
        }
      })
    ) : (
      <div className="text-center uppercase text-sm">
        No scores submitted yet.
      </div>
    )}
  </div>
)
