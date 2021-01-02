import { ScorecardGame } from '@/firebase/game'
import { FunctionComponent, useEffect, useState } from 'react'

import { GameIdWidget } from '../GameIdWidget'

export enum JoinGameFormError {
  DuplicateName = 'duplicate-name',
  GameNotExists = 'game-not-exists',
}

interface Props {
  alreadyJoined?: boolean
  clearError?: () => void
  currentPlayerName?: string
  error?: JoinGameFormError | null
  gameId?: string
  game?: ScorecardGame.DutchBlitz
  onGameCodeEntered?: (gameCode: string) => void
  onJoinGameClicked?: (name: string, gameCode?: string) => void
  playerCount?: number
}

export const JoinGameForm: FunctionComponent<Props> = ({
  alreadyJoined,
  clearError,
  currentPlayerName,
  error,
  gameId,
  game,
  onGameCodeEntered,
  onJoinGameClicked,
  playerCount,
}) => {
  const [gameCode, setGameCode] = useState('')
  const [joinGameName, setJoinGameName] = useState('')

  useEffect(() => {
    if (onGameCodeEntered && gameCode.length === 5) {
      onGameCodeEntered(gameCode)
    }
  }, [gameCode, onGameCodeEntered])

  return (
    <div className="rounded-2xl border-2 overflow-hidden m-4 p-6 text-center">
      {game && (
        <div className="font-bold uppercase mb-2">
          {game === ScorecardGame.DutchBlitz && 'Dutch Blitz'}
        </div>
      )}

      {gameId && (
        <div className="mb-4 text-lg">
          <GameIdWidget gameId={gameId} />
        </div>
      )}

      {playerCount && (
        <div className="mb-4 text-sm">
          {playerCount} player
          {`${playerCount > 1 ? 's' : ''}`} in game
        </div>
      )}

      {!gameId && (
        <div className="flex flex-col mb-4">
          <label
            className="uppercase font-bold text-gray-900 mb-2"
            htmlFor="code"
          >
            Game Code
          </label>
          <input
            className={`border py-2 px-3 text-grey-darkest uppercase text-xl text-center font-mono tracking-widest ${
              error === JoinGameFormError.GameNotExists && 'border-red-500'
            }`}
            id="code"
            maxLength={5}
            type="text"
            placeholder="AB123"
            onChange={(event) => {
              setGameCode(event.currentTarget.value.toUpperCase())
              if (error === JoinGameFormError.GameNotExists && clearError) {
                clearError()
              }
            }}
            value={gameCode}
          />
          {error === JoinGameFormError.GameNotExists && (
            <div className="text-sm mt-1">
              Game doesn&apos;t exist, make sure you got the code right.
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col mb-4">
        <label
          className="uppercase font-bold text-gray-900 mb-2"
          htmlFor="name"
        >
          Display Name
        </label>
        <input
          className={`border py-2 px-3 text-grey-darkest text-center ${
            error === JoinGameFormError.DuplicateName && 'border-red-500'
          }`}
          disabled={alreadyJoined}
          id="name"
          type="text"
          placeholder={currentPlayerName || 'Your Name'}
          onChange={(event) => {
            setJoinGameName(event.currentTarget.value)
            if (error === JoinGameFormError.DuplicateName && clearError) {
              clearError()
            }
          }}
          value={joinGameName}
        />
        {error === JoinGameFormError.DuplicateName && (
          <div className="text-sm mt-1">
            Name already used, try another one.
          </div>
        )}
      </div>
      {alreadyJoined ? (
        <div className="text-sm mt-1">You&apos;re already in this game!</div>
      ) : (
        <button
          className="block bg-indigo-800 hover:bg-indigo-700 text-white uppercase text-sm font-semibold mx-auto px-4 py-2 rounded-2xl"
          onClick={() => {
            if (onJoinGameClicked) {
              onJoinGameClicked(joinGameName, gameCode)
            }
          }}
        >
          Join
        </button>
      )}
    </div>
  )
}
