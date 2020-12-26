import { createRef, forwardRef } from "react";
import { GameIdWidget } from "../GameIdWidget";
import { LiveUpdatingRows } from "../LiveUpdatingRows";

export const DutchBlitzScoreBoardHeader = ({ round }) => (
  <div className="flex items-center px-4 py-2 text-gray-600 bg-gray-200 text-sm">
    <div className="w-8/12 text-gray-800 font-bold">Round {round}</div>
    <div className="w-12 text-center">Dutch</div>
    <div className="w-12 text-center">Blitz</div>
    <div className="w-12 text-center">Total</div>
  </div>
)

export const DutchBlitzScoreBoardPlayer = forwardRef(({ currentUserId, place, player }, ref) => (
  <div
    className="flex items-center px-4 py-2"    
    ref={ref}
  >
    <div className="flex items-center w-8/12">
      {place && place >= 0 && place <= 2 && (
        <span className="w-8 font-bold">
          {place == 1 && <span>🥇</span>}
          {place == 2 && <span>🥈</span>}
          {place == 3 && <span>🥉</span>}
        </span>
      )}
      {player.name}
      {currentUserId && player.id === currentUserId && <span className="text-xs ml-1">(You)</span>}
    </div>
    <div className="w-12 text-center">{player.dutchScore || 0}</div>
    <div className="w-12 text-center">{player.blitzScore || 0}</div>
    <div className="w-12 text-center text-lg font-bold">
      {player.totalScore || 0}
    </div>
  </div>
));

export const DutchBlitzScoreBoard = ({
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
      {finished && <div className="text-xs font-bold uppercase mt-2">Finished</div>}
      {!finished && <div className="text-xs text-red-800 font-bold uppercase mt-2">Live</div>}
    </div>
    <DutchBlitzScoreBoardHeader round={round} />
    <LiveUpdatingRows>
      {players.map((player, index,) => (
        <DutchBlitzScoreBoardPlayer currentUserId={currentUserId} key={player.id} player={player} place={index + 1} ref={createRef()} />
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
);
