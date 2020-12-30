import { createRef, FunctionComponent } from 'react'

import { GameIdWidget } from '../GameIdWidget'
import { LiveUpdatingRows } from '../LiveUpdatingRows'
import { DutchBlitzScoreBoardHeader } from './DutchBlitzScoreBoardHeader'
import {
  DutchBlitzPlayer,
  DutchBlitzScoreBoardPlayer,
} from './DutchBlitzScoreBoardPlayer'

interface Props {
  blitz: () => void
  canBlitz: boolean
  canFinishGame: boolean
  canNextRound: boolean
  currentUserId: string
  finished: boolean
  finishGame: () => void
  gameId: string
  isAdmin: boolean
  nextRound: () => void
  players: DutchBlitzPlayer[]
  round: number
}

export const DutchBlitzScoreBoard: FunctionComponent<Props> = ({
  blitz,
  canBlitz,
  canFinishGame,
  canNextRound,
  currentUserId,
  finished,
  finishGame,
  gameId,
  isAdmin,
  nextRound,
  players,
  round,
}) => (
  <div className="m-4 rounded-2xl overflow-hidden border-2">
    <div className="border-b border-gray-300 px-4 py-3 text-gray-600 bg-gray-200 text-lg text-center">
      <div className="text-sm font-bold uppercase mb-2">Dutch Blitz</div>
      <GameIdWidget gameId={gameId} />
      {finished && (
        <div className="text-xs font-bold uppercase mt-2">Finished</div>
      )}
      {!finished && (
        <div className="text-xs text-red-800 font-bold uppercase mt-2">
          Live
        </div>
      )}
    </div>
    <DutchBlitzScoreBoardHeader round={round} />
    <LiveUpdatingRows>
      {players.map((player, index) => (
        <DutchBlitzScoreBoardPlayer
          currentUserId={currentUserId}
          key={player.id}
          player={player}
          place={index + 1}
          ref={createRef()}
        />
      ))}
    </LiveUpdatingRows>
    {canBlitz && (
      <div className="border-t border-gray-300 px-4 py-3 text-gray-600">
        <button
          className="block bg-indigo-800 hover:bg-indigo-700 text-white uppercase text-2xl font-semibold mx-auto px-4 py-2 rounded-2xl"
          onClick={() => blitz()}
        >
          Blitz!
        </button>
      </div>
    )}
    {isAdmin && (canNextRound || canFinishGame) && (
      <div className="flex justify-center border-t border-gray-300 px-4 py-3 text-gray-600 bg-gray-200">
        {canNextRound && (
          <button
            className="bg-indigo-800 hover:bg-indigo-700 text-white uppercase text-sm font-semibold mx-auto px-4 py-2 rounded-2xl"
            onClick={() => nextRound()}
          >
            Next Round
          </button>
        )}
        {canFinishGame && (
          <button
            className="bg-red-700 hover:bg-red-600 text-white uppercase text-sm mx-auto px-4 py-2 rounded-2xl"
            onClick={() => finishGame()}
          >
            Finish Game
          </button>
        )}
      </div>
    )}
  </div>
)
