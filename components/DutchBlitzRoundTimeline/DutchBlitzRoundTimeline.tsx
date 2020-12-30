import { FunctionComponent } from 'react'

import {
  DutchBlitzPlayer,
  DutchBlitzScoreBoardHeader,
  DutchBlitzScoreBoardPlayer,
} from '../DutchBlitzScoreBoard'

export interface DutchBlitzRound {
  id?: string
  players: {
    [playerId: string]: DutchBlitzPlayer
  }
}

interface Props {
  currentUserId?: string
  rounds: DutchBlitzRound[]
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
                <DutchBlitzScoreBoardPlayer player={currentUserScores} />
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
