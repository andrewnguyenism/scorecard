import { useEffect, useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useUser } from '@/context/UserContext'
import { JoinGameForm, JoinGameFormError } from '@/components/JoinGameForm'
import { DutchBlitzScoreBoard } from '@/components/DutchBlitzScoreBoard'
import { DutchBlitzScoreForm } from '@/components/DutchBlitzScoreForm'
import { DutchBlitzRoundTimeline } from '@/components/DutchBlitzRoundTimeline'
import {
  GameInfo,
  getGamePlayers,
  joinGame,
  listenForGameInfoChange,
  progressGameToNextRound,
  setGameFinished,
} from '@/firebase/game'
import {
  DutchBlitzPlayerInfo,
  listenForPlayersChange,
  PlayersInfo,
} from '@/firebase/player'
import {
  DutchBlitzRoundInfo,
  listenForRoundsChange,
  RoundsInfo,
} from '@/firebase/round'
import { callBlitz, submitDutchBlitzScore } from '@/firebase/dutch-blitz'

export default function Game(): JSX.Element {
  const { user } = useUser()
  const router = useRouter()
  const {
    query: { id: gameId },
  } = router

  const [status, setStatus] = useState('idle')
  const [joinGameError, setJoinGameError] = useState<JoinGameFormError | null>(
    null
  )
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null)
  const [players, setPlayers] = useState<
    Array<DutchBlitzPlayerInfo & { id: string }>
  >([])
  const [rounds, setRounds] = useState<
    Array<DutchBlitzRoundInfo & { id: string }>
  >([])
  const [lastRoundSubmitted, setLastRoundSubmitted] = useState<string | null>(
    null
  )

  useEffect(() => {
    const onChange = (remoteGameInfo: GameInfo | null) => {
      if (remoteGameInfo) {
        setGameInfo(remoteGameInfo)
        setStatus('loaded')
      } else if (status === 'loaded') {
        setStatus('closed')
      } else {
        setStatus('notexists')
      }
    }
    const off = listenForGameInfoChange(gameId as string, onChange)
    return () => off()
  }, [gameId, status])

  useEffect(() => {
    if (gameInfo) {
      const onChange = (remotePlayers: PlayersInfo | null) => {
        if (remotePlayers) {
          const remotePlayersArray = Object.entries(remotePlayers)
            .map(([id, info]) => ({
              id,
              ...info,
            }))
            .sort((playerA, playerB) => {
              return (gameInfo?.rounds && gameInfo?.rounds > 1) ||
                gameInfo?.roundStatus === 'blitz'
                ? playerB.totalScore - playerA.totalScore
                : playerA.createdAt - playerB.createdAt
            })
          setPlayers(remotePlayersArray)
          if (user) {
            setLastRoundSubmitted(
              remotePlayers?.[user.uid]?.lastRoundSubmitted || null
            )
          }
        }
      }
      const off = listenForPlayersChange(gameId as string, onChange)
      return () => off()
    }
  }, [gameInfo, gameId, user])

  useEffect(() => {
    const onChange = (remoteRounds: RoundsInfo | null) => {
      if (remoteRounds) {
        const remoteRoundsArray = Object.entries(remoteRounds).map(
          ([id, info]) => ({
            id,
            ...info,
          })
        )
        setRounds(remoteRoundsArray)
      }
    }
    const off = listenForRoundsChange(gameId as string, onChange)
    return () => off()
  }, [gameId])

  const submitScore = async (dutch: number, blitz: number) => {
    if (gameInfo && user) {
      submitDutchBlitzScore(
        gameId as string,
        user.uid,
        dutch,
        blitz,
        lastRoundSubmitted
      )
    }
  }

  return (
    <div>
      <Head>
        <title>Game {gameId} - Scorecard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-center text-2xl my-4">
          {status === 'notexists' && <p>Game doesn&apos;t exist!</p>}
          {status === 'loading' && <p>Loading game...</p>}
          {status === 'closed' && <p>Game doesn&apos;t exist!</p>}
        </div>

        {status === 'loaded' && gameInfo && user && (
          <>
            {gameInfo.players[user.uid] ? (
              <>
                <DutchBlitzScoreBoard
                  blitz={() => callBlitz(gameId as string, user.uid)}
                  canBlitz={
                    gameInfo.roundStatus === 'playing' &&
                    gameInfo.gameStatus !== 'finished'
                  }
                  canFinishGame={gameInfo.gameStatus !== 'finished'}
                  canNextRound={
                    gameInfo.roundStatus === 'blitz' &&
                    gameInfo.gameStatus !== 'finished'
                  }
                  currentUserId={user.uid}
                  finished={gameInfo.gameStatus === 'finished'}
                  finishGame={() => setGameFinished(gameId as string)}
                  gameId={gameId as string}
                  isAdmin={user.uid === gameInfo.owner}
                  nextRound={() => progressGameToNextRound(gameId as string)}
                  players={players}
                  round={gameInfo.rounds}
                />
                {gameInfo.roundStatus === 'blitz' && (
                  <>
                    <div className="text-center uppercase text-lg font-bold mb-4">
                      Submit Score
                    </div>
                    <DutchBlitzScoreForm
                      editMode={lastRoundSubmitted === gameInfo.currentRound}
                      submitScore={submitScore}
                    />
                  </>
                )}
                <DutchBlitzRoundTimeline
                  currentUserId={user.uid}
                  rounds={rounds}
                />
              </>
            ) : (
              <JoinGameForm
                clearError={() => setJoinGameError(null)}
                error={joinGameError}
                gameId={gameId as string}
                game={gameInfo.game}
                onJoinGameClicked={async (name) => {
                  const players = await getGamePlayers(gameId as string)
                  if (
                    players &&
                    Object.values(players).find(
                      (playerName) =>
                        playerName.toLowerCase() === name.toLowerCase()
                    )
                  ) {
                    setJoinGameError(JoinGameFormError.DuplicateName)
                  } else {
                    const joinedGame = await joinGame({
                      gameId: gameId as string,
                      name,
                      userId: user.uid,
                    })
                    if (joinedGame) {
                      router.push(`/game/${gameId}`)
                    }
                  }
                }}
                playerCount={players.length}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
